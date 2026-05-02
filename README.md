# Dobby Drive

Dobby Drive is a full-stack app for managing folders and images with user-level isolation and MCP support.

## Live URLs

- Frontend: https://dobby-ads-five.vercel.app/
- Backend: https://dobby-ads-server-4hj2.onrender.com
- Backend health route: https://dobby-ads-server-4hj2.onrender.com/api/health
- MCP route: https://dobby-ads-xqkn.onrender.com/mcp

## Important Functionality

- User authentication: register, login, logout
- Folder management:
  - Create folders at root or nested level
  - List folders
  - Resolve folders by name
  - Delete folders with nested content
- Image management:
  - Upload images
  - List images by folder
  - Delete image by id or by name
- Per-user data isolation:
  - All folder and image operations are scoped to the authenticated user
- API key management:
  - Create API keys
  - List API keys
  - Revoke API keys
  - API keys are used for MCP authentication
- Hosted MCP endpoint:
  - MCP runs from the same deployed backend
  - MCP route: https://dobby-ads-server-4hj2.onrender.com/mcp

 ## Tech Stack

### Frontend
- React
- Vite
- React Router
- Redux Toolkit
- Axios
- React Hot Toast
- React Icons
- Tailwind CSS v4

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Cloudinary
- MCP SDK
- Zod
- Cookie Parser
- CORS

## MCP Setup (Claude Desktop)

This project is connected in Claude Desktop using `mcp-remote` as a stdio bridge to the hosted MCP HTTP endpoint.

### 1. Create API Key

- Open the frontend: https://dobby-ads-five.vercel.app/
- Log in
- Open the API Keys page
- Create a key and copy it once

### 2. Update Claude Desktop Config

Config file location on Windows:

%APPDATA%\Claude\claude_desktop_config.json

Or go to Claude Desktop:

File
Settings
Developer
Edit config

Use this server entry:

```text
{
  "mcpServers": {
    "dobby-prod": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://dobby-ads-server-4hj2.onrender.com/mcp",
        "--transport",
        "http-only",
        "--header",
        "X-API-Key:${DOBBY_API_KEY}"
      ],
      "env": {
        "DOBBY_API_KEY": "PASTE_YOUR_API_KEY"
      }
    }
  }
}
```
#### Notes:

- Keep X-API-Key:${DOBBY_API_KEY} exactly as shown
- Do not use --allow-http for a production HTTPS URL
- Restart Claude Desktop after saving the config

### 3. Verify Connection

- Open Claude Desktop
- Confirm the MCP server loads without a disconnected state
- Ask Claude to call MCP tools, for example:
List my folders
- Create a folder named MCP Test

#### MCP Workflow
- User creates an API key from the app
- Claude Desktop sends MCP requests to https://dobby-ads-xqkn.onrender.com/mcp through mcp-remote
- Backend extracts the API key from X-API-Key or Authorization
- Backend validates the key and resolves the corresponding user
- MCP tools execute folder and image service methods using that user id
- Response is returned to Claude
- Result: each user can access only their own folders and images through MCP
