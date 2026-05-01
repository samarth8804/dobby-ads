import crypto from "node:crypto";
import ApiKey from "../models/ApiKey.model.js";
import User from "../models/User.model.js";

const hashKey = (rawKey) =>
  crypto.createHash("sha256").update(rawKey).digest("hex");

const makeRawKey = () => {
  const prefix = "mcp";
  const secret = crypto.randomBytes(32).toString("hex");
  const rawKey = `${prefix}_${secret}`;
  return { rawKey, prefix };
};

export const createApiKeyForUser = async ({ userId, name, expiresInDays }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const { rawKey, prefix } = makeRawKey();
  const keyHash = hashKey(rawKey);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + Number(expiresInDays));

  const apiKey = await ApiKey.create({
    userId,
    name,
    keyHash,
    keyPrefix: prefix,
    expiresAt,
  });

  return {
    apiKey,
    rawKey,
  };
};

export const listApiKeysForUser = async (userId) => {
  return ApiKey.find({ userId })
    .select("_id name keyPrefix expiresAt lastUsedAt revokedAt createdAt")
    .sort({ createdAt: -1 });
};

export const revokeApiKeyForUser = async ({ userId, apiKeyId }) => {
  const apiKey = await ApiKey.findOne({ _id: apiKeyId, userId });
  if (!apiKey) {
    throw new Error("API key not found");
  }

  apiKey.revokedAt = new Date();
  await apiKey.save();

  return apiKey;
};

export const resolveUserByApiKey = async (rawApiKey) => {
  if (!rawApiKey) {
    throw new Error("Unauthorized: API key is required");
  }

  const keyHash = hashKey(rawApiKey);

  const apiKey = await ApiKey.findOne({
    keyHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!apiKey) {
    throw new Error("Unauthorized: API key is invalid or expired");
  }

  const user = await User.findById(apiKey.userId);
  if (!user) {
    throw new Error("Unauthorized: user not found");
  }

  apiKey.lastUsedAt = new Date();
  await apiKey.save();

  return { user, apiKey };
};
