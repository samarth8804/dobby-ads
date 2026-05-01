export const toToolSuccess = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
});

export const toToolError = (error) => ({
  isError: true,
  content: [
    {
      type: "text",
      text: `Tool failed: ${error instanceof Error ? error.message : "Unexpected error"}`,
    },
  ],
});

export const handleTool = async (run) => {
  try {
    return toToolSuccess(await run());
  } catch (error) {
    return toToolError(error);
  }
};

export const writeJsonRpcError = (res, statusCode, message) => {
  res.status(statusCode).json({
    jsonrpc: "2.0",
    error: { code: -32000, message },
    id: null,
  });
};
