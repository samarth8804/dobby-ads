import Folder from "../models/Folder.model.js";

// size change upward
export const updateFolderSize = async (folderId, sizeChange, userId) => {
  let currentId = folderId;

  while (currentId) {
    const folder = await Folder.findOne({
      _id: currentId,
      userId,
    });

    if (!folder) break;

    // update size
    folder.size += sizeChange;
    await folder.save();

    // move upward
    currentId = folder.parentId;
  }
};
