import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerFolderTools } from "./folder.js";
import { registerImageTools } from "./image.js";

export const buildUserScopedMcpServer = ({ userId }) => {
  const server = new McpServer({
    name: "dobby-ads-hosted-mcp",
    version: "1.0.0",
  });

  registerFolderTools(server, userId);
  registerImageTools(server, userId);

  return server;
};
