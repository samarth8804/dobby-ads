import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { getUserFromApiKey } from "./auth.js";
import {
  createSessionTransport,
  getSessionById,
  getSessionCount,
} from "./sessions.js";
import { buildUserScopedMcpServer } from "./tools/index.js";
import { writeJsonRpcError } from "./tool-helpers.js";

const isCancelNotification = (body) =>
  body?.method === "notifications/cancelled";

export const registerHostedMcpRoutes = (app) => {
  app.get("/mcp/health", (_req, res) => {
    res.status(200).json({
      ok: true,
      sessions: getSessionCount(),
      environment: process.env.NODE_ENV || "development",
    });
  });

  app.post("/mcp", async (req, res) => {
    try {
      const { user } = await getUserFromApiKey(req);
      const userId = String(user._id);

      const sessionId =
        typeof req.headers["mcp-session-id"] === "string"
          ? req.headers["mcp-session-id"]
          : undefined;

      if (sessionId) {
        const session = getSessionById(sessionId);

        if (session) {
          await session.transport.handleRequest(req, res, req.body);
          return;
        }

        if (isCancelNotification(req.body)) {
          res.status(204).end();
          return;
        }

        if (isInitializeRequest(req.body)) {
          const server = buildUserScopedMcpServer({ userId });
          const transport = createSessionTransport({ userId, server });
          await server.connect(transport);
          await transport.handleRequest(req, res, req.body);
          return;
        }

        writeJsonRpcError(res, 409, "Session expired. Reinitialize.");
        return;
      }

      if (!isInitializeRequest(req.body)) {
        writeJsonRpcError(res, 400, "Send initialize request first");
        return;
      }

      const server = buildUserScopedMcpServer({ userId });
      const transport = createSessionTransport({ userId, server });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Server error";
      if (!res.headersSent) {
        writeJsonRpcError(res, msg.includes("Unauthorized") ? 401 : 500, msg);
      }
    }
  });
};
