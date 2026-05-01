import {
  createApiKeyForUser,
  listApiKeysForUser,
  revokeApiKeyForUser,
} from "../services/apiKey.service.js";

export const createApiKey = async (req, res) => {
  try {
    const { name, expiresInDays } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const days = Number(expiresInDays);
    if (!Number.isInteger(days) || days < 1) {
      return res
        .status(400)
        .json({ message: "expiresInDays must be a positive integer" });
    }

    const { apiKey, rawKey } = await createApiKeyForUser({
      userId: req.user.id,
      name,
      expiresInDays: days,
    });

    return res.status(201).json({
      apiKey: {
        id: apiKey._id,
        name: apiKey.name,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
      },
      rawKey,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getApiKeys = async (req, res) => {
  try {
    const apiKeys = await listApiKeysForUser(req.user.id);
    return res.json({ apiKeys });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const revokeApiKey = async (req, res) => {
  try {
    const { id } = req.params;

    const apiKey = await revokeApiKeyForUser({
      userId: req.user.id,
      apiKeyId: id,
    });

    return res.json({
      message: "API key revoked successfully",
      apiKey: {
        id: apiKey._id,
        name: apiKey.name,
        revokedAt: apiKey.revokedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
