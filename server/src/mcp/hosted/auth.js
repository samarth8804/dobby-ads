import { resolveUserByApiKey } from "../../services/apiKey.service.js";

const extractApiKey = (req) => {
  const header = req.headers["x-api-key"];
  if (typeof header === "string" && header.trim()) return header.trim();
  return null;
};

export const getUserFromApiKey = async (req) => {
  const rawApiKey = extractApiKey(req);
  if (!rawApiKey) {
    throw new Error("Unauthorized: API key is required");
  }

  const { user, apiKey } = await resolveUserByApiKey(rawApiKey);
  return { user, apiKey, rawApiKey };
};
