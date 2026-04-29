import cloudinary from "../config/cloudinary.js";
import Image from "../models/Image.model.js";
import Folder from "../models/Folder.model.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const { folderId } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        message: "Only image files are allowed",
      });
    }

    const folder = await Folder.findOne({
      _id: folderId,
      userId: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    const base64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "dobby-ads",
    });

    const image = await Image.create({
      name: file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      size: file.size,
      folderId,
      userId: req.user.id,
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
