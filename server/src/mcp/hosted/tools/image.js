import * as z from "zod";
import { basename } from "node:path";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import cloudinary from "../../../config/cloudinary.js";
import Folder from "../../../models/Folder.model.js";
import Image from "../../../models/Image.model.js";
import { updateFolderSize } from "../../../utils/folderSize.util.js";
import { getRootFolder } from "../../../utils/folder.util.js";
import { handleTool } from "../tool-helpers.js";
import { resolveFolderIdForUser } from "./helpers.js";

const maxBytes = Number(process.env.MCP_IMAGE_MAX_BYTES) || 10 * 1024 * 1024;

const normalizePath = (input) => {
  let path = input.trim();
  if (
    (path.startsWith('"') && path.endsWith('"')) ||
    (path.startsWith("'") && path.endsWith("'"))
  ) {
    path = path.slice(1, -1).trim();
  }

  if (path.toLowerCase().startsWith("file://")) {
    try {
      path = fileURLToPath(path);
    } catch {}
  }

  return path;
};

export const registerImageTools = (server, userId) => {
  server.registerTool(
    "listImages",
    {
      description: "List images in folder",
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

        return Image.find({
          userId,
          folderId: resolvedId,
        }).sort({ createdAt: -1 });
      }),
  );

  server.registerTool(
    "uploadImage",
    {
      description: "Upload image from file path",
      inputSchema: {
        filePath: z.string().min(1),
        imageName: z.string().optional(),
        folderId: z.string().optional(),
        folderName: z.string().optional(),
        parentId: z.string().optional(),
      },
    },
    async ({ filePath, imageName, folderId, folderName, parentId }) =>
      handleTool(async () => {
        const path = normalizePath(filePath);
        const fileStats = await stat(path);

        if (
          !fileStats.isFile() ||
          fileStats.size <= 0 ||
          fileStats.size > maxBytes
        ) {
          throw new Error("Invalid file");
        }

        const fileBuffer = await readFile(path);
        const root = await getRootFolder(userId);
        const resolvedId = await resolveFolderIdForUser({
          userId,
          folderId,
          folderName,
          parentId,
        });

        const folder = await Folder.findOne({
          userId,
          _id: resolvedId || root._id,
        });

        if (!folder) throw new Error("Folder not found");

        const base64 = fileBuffer.toString("base64");
        const dataUri = `data:image/*;base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "dobby-ads",
        });

        const image = await Image.create({
          name: imageName || basename(path),
          url: result.secure_url,
          publicId: result.public_id,
          size: fileStats.size,
          folderId: resolvedId,
          userId,
        });

        await updateFolderSize(resolvedId, fileStats.size, userId);

        return image;
      }),
  );
  server.registerTool(
    "deleteImage",
    {
      description: "Delete image by id",
      inputSchema: {
        imageId: z.string().min(1),
      },
    },
    async ({ imageId }) =>
      handleTool(async () => {
        const image = await Image.findOne({
          _id: imageId,
          userId,
        });

        if (!image) {
          throw new Error("Image not found");
        }

        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (error) {
          console.log("Cloudinary delete failed");
        }

        await Image.findByIdAndDelete(imageId);
        await updateFolderSize(image.folderId, -image.size, userId);

        return {
          message: "Image deleted successfully",
        };
      }),
  );
};

