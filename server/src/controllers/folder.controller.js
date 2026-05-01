import Folder from "../models/Folder.model.js";
import Image from "../models/Image.model.js";
import cloudinary from "../config/cloudinary.js";
import { updateFolderSize } from "../utils/folderSize.util.js";
import { getRootFolder } from "../utils/folder.util.js";

// helper function
const getAllSubfolders = async (parentId, userId) => {
  let allFolders = [];

  const findChildren = async (parentIds) => {
    const children = await Folder.find({
      parentId: { $in: parentIds },
      userId,
    });

    if (!children.length) return;

    allFolders.push(...children);

    const childIds = children.map((f) => f._id);
    await findChildren(childIds);
  };

  await findChildren([parentId]);

  return allFolders;
};

// Create Folder
export const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.user.id;

    // Validation
    if (!name) {
      return res.status(400).json({
        message: "Folder name is required",
      });
    }

    const root = await getRootFolder(userId);

    const finalParentId = parentId || root._id;

    // check if parent folder exists or not

    const parentFolder = await Folder.findOne({
      _id: finalParentId,
      userId: req.user.id,
    });

    if (!parentFolder) {
      return res.status(404).json({
        message: "Folder doesn't exist",
      });
    }

    // Check duplicate folder in same directory
    const existing = await Folder.findOne({
      name,
      parentId,
      userId: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        message: "Folder already exists in this location",
      });
    }

    // Create folder
    const folder = await Folder.create({
      name,
      parentId: finalParentId,
      userId,
    });

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getFolderData = async (req, res) => {
  try {
    const userId = req.user.id;

    const root = await getRootFolder(userId);

    const parentId =
      req.query.parentId && req.query.parentId !== "null"
        ? req.query.parentId
        : root._id;

    // Get folders
    const folders = await Folder.find({
      parentId,
      userId,
    }).sort({ createdAt: -1 });

    // Get images
    const images = await Image.find({
      folderId: parentId,
      userId,
    }).sort({ createdAt: -1 });

    const currentFolder = await Folder.findOne({
      _id: parentId,
      userId,
    });

    res.json({
      currentFolder,
      folders,
      images,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate folder
    const folder = await Folder.findOne({
      _id: id,
      userId,
    });

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    if (!folder.parentId) {
      return res.status(400).json({
        message: "Root folder cannot be deleted",
      });
    }

    // Get all subfolders
    const subfolders = await getAllSubfolders(id, userId);

    const allFolderIds = [folder._id, ...subfolders.map((f) => f._id)];

    // Get all images
    const images = await Image.find({
      folderId: { $in: allFolderIds },
      userId,
    });

    // Calculate total size
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);

    // Delete from Cloudinary
    await Promise.all(
      images.map((img) => cloudinary.uploader.destroy(img.publicId)),
    );

    // Delete images from DB
    await Image.deleteMany({
      _id: { $in: images.map((img) => img._id) },
    });

    // Delete folders from DB
    await Folder.deleteMany({
      _id: { $in: allFolderIds },
    });

    // Update parent folder size
    if (folder.parentId) {
      await updateFolderSize(folder.parentId, -totalSize, userId);
    }

    res.json({
      message: "Folder deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
