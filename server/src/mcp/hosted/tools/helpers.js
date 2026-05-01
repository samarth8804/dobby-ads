import Folder from "../../../models/Folder.model.js";
import { getRootFolder } from "../../../utils/folder.util.js";

export const resolveFolderIdForUser = async ({
  userId,
  folderId,
  folderName,
  parentId,
}) => {
  if (folderId?.trim()) return folderId;

  if (folderName?.trim()) {
    const root = await getRootFolder(userId);
    const parent = parentId?.trim() || root._id;

    const folder = await Folder.findOne({
      userId,
      name: folderName,
      parentId: parent,
    });

    if (!folder?._id) {
      throw new Error("Failed to resolve folder by name");
    }

    return String(folder._id);
  }

  const root = await getRootFolder(userId);
  return String(root._id);
};
