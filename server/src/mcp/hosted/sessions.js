import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const sessions = new Map();

export const getSessionCount = () => sessions.size;
export const getSessionById = (sessionId) => sessions.get(sessionId);

export const createSessionTransport = ({ userId, server }) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (generatedSessionId) => {
      sessions.set(generatedSessionId, { transport, server, userId });
    },
  });

  transport.onclose = () => {
    if (transport.sessionId) sessions.delete(transport.sessionId);
    void server.close();
  };

  return transport;
};
