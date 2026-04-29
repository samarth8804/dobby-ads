import Folder from "../models/Folder.model.js";

// Create Folder
export const createFolder = async (req, res) => {
  try {
    const { name, parentId = null } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        message: "Folder name is required",
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
      parentId,
      userId: req.user.id,
    });

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get folders inside a folder
export const getFolderContents = async (req, res) => {
  try {
    const { parentId = null } = req.query;

    const folders = await Folder.find({
      parentId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(folders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
