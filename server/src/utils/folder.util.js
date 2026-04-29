import Folder from "../models/Folder.model.js";

export const getRootFolder = async (userId) => {
  let root = await Folder.findOne({
    parentId: null,
    userId,
  });

  if (!root) {
    root = await Folder.create({
      name: "root",
      parentId: null,
      userId,
    });
  }

  return root;
};
