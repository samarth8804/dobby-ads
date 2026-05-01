import * as z from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Folder from "../../../models/Folder.model.js";
import Image from "../../../models/Image.model.js";
import { getRootFolder } from "../../../utils/folder.util.js";
import { updateFolderSize } from "../../../utils/folderSize.util.js";
import { handleTool } from "../tool-helpers.js";
import { resolveFolderIdForUser } from "./helpers.js";
import cloudinary from "../../../config/cloudinary.js";

export const registerFolderTools = (server, userId) => {
  server.registerTool(
    "createFolder",
    {
      description: "Create a folder",
      inputSchema: {
        name: z.string().min(1).max(120),
        parentId: z.string().optional(),
      },
    },
    ({ name, parentId }) =>
      handleTool(async () => {
        const root = await getRootFolder(userId);
        const finalParentId = parentId || root._id;

        const existing = await Folder.findOne({
          userId,
          name,
          parentId: finalParentId,
        });

        if (existing) {
          throw new Error("Folder already exists in this location");
        }

        const folder = await Folder.create({
          name,
          parentId: finalParentId,
          userId,
        });

        return folder;
      }),
  );

  server.registerTool(
    "getFolderContent",
    {
      description: "Get folders and images in a folder",
      inputSchema: {
        folderId: z.string().optional(),
        folderName: z.string().optional(),
        parentId: z.string().optional(),
      },
    },
    async ({ folderId, folderName, parentId }) =>
      handleTool(async () => {
        const resolvedId = await resolveFolderIdForUser({
          userId,
          folderId,
          folderName,
          parentId,
        });

        const folders = await Folder.find({
          userId,
          parentId: resolvedId,
        }).sort({ createdAt: -1 });

        const images = await Image.find({
          userId,
          folderId: resolvedId,
        }).sort({ createdAt: -1 });

        const currentFolder = await Folder.findOne({
          userId,
          _id: resolvedId,
        });

        return { currentFolder, folders, images };
      }),
  );

  server.registerTool(
    "deleteFolder",
    {
      description: "Delete folder by id or name",
      inputSchema: {
        folderId: z.string().optional(),
        folderName: z.string().optional(),
        parentId: z.string().optional(),
      },
    },
    async ({ folderId, folderName, parentId }) =>
      handleTool(async () => {
        const resolvedId = await resolveFolderIdForUser({
          userId,
          folderId,
          folderName,
          parentId,
        });

        const folder = await Folder.findOne({ _id: resolvedId, userId });
        if (!folder) throw new Error("Folder not found");
        if (!folder.parentId) throw new Error("Root folder cannot be deleted");

        const allFolders = [folder];
        const subfolders = await Folder.find({
          userId,
          parentId: resolvedId,
        });

        if (subfolders.length) allFolders.push(...subfolders);

        const images = await Image.find({
          userId,
          folderId: { $in: allFolders.map((f) => f._id) },
        });

        const totalSize = images.reduce((sum, img) => sum + img.size, 0);

        await Promise.all(
          images.map(async (image) => {
            try {
              await cloudinary.uploader.destroy(image.publicId);
            } catch (error) {
              console.log("Cloudinary delete failed");
            }
          }),
        );
        await Image.deleteMany({ _id: { $in: images.map((img) => img._id) } });
        await Folder.deleteMany({ _id: { $in: allFolders.map((f) => f._id) } });

        await updateFolderSize(folder.parentId, -totalSize, userId);

        return { message: "Folder deleted successfully" };
      }),
  );
};
