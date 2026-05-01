import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiKeyApi } from "../api/apiKey.api";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";
import { getApiErrorMessage } from "../utils/errorMessage";

const ApiKeys = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  // create form
  const [name, setName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [creating, setCreating] = useState(false);

  // raw key display after creation
  const [rawKey, setRawKey] = useState(null);
  const [createdMeta, setCreatedMeta] = useState(null);

  // revoke confirm
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await apiKeyApi.list();
      setKeys(res.data.apiKeys || []);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load API keys."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchKeys();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      setCreating(true);
      const res = await apiKeyApi.create({ name, expiresInDays });
      setRawKey(res.data.rawKey);
      setCreatedMeta(res.data.apiKey);
      toast.success("API key created — copy it now.");
      setName("");
      setExpiresInDays(30);
      await fetchKeys();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create API key."));
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeConfirm = (item) => {
    setRevokeTarget(item);
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    try {
      setIsRevoking(true);
      await apiKeyApi.revoke(revokeTarget._id);
      toast.success("API key revoked");
      setRevokeTarget(null);
      await fetchKeys();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to revoke API key."));
    } finally {
      setIsRevoking(false);
    }
  };

  const copyRawKey = async () => {
    try {
      await navigator.clipboard.writeText(rawKey);
      toast.success("Key copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-amber-950">API Keys</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Create and manage API keys for programmatic access to MCP tools.
            Keep keys secret — they grant access to your data.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-1 lg:gap-10">
          {/* Create Key Card */}
          <section className="rounded-xl border border-amber-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-amber-950">
              Create New Key
            </h2>

            <form
              onSubmit={handleCreate}
              className="mt-4 grid gap-4 sm:grid-cols-3 sm:items-end"
            >
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-amber-950">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm sm:text-base text-gray-900 outline-none focus:border-amber-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My MCP key (e.g., CI/CD)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-950">
                  Expires (days)
                </label>
                <select
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm sm:text-base text-gray-900 outline-none focus:border-amber-500"
                >
                  <option value={7}>7</option>
                  <option value={30}>30</option>
                  <option value={90}>90</option>
                  <option value={365}>365</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center mt-6">
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full sm:w-auto rounded-lg bg-linear-to-r from-amber-700 to-amber-900 px-6 py-3 text-sm sm:text-base font-medium text-white transition-all hover:shadow-lg hover:shadow-amber-700/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {creating ? "Creating..." : "Create Key"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setName("");
                    setExpiresInDays(30);
                  }}
                  className="w-full sm:w-auto rounded-lg border border-amber-200 bg-white px-5 py-3 text-sm sm:text-base font-medium text-amber-900 hover:bg-amber-50"
                >
                  Reset
                </button>
              </div>
            </form>

            {rawKey && (
              <div className="mt-5 rounded-lg border border-amber-100 bg-amber-50 p-4 sm:p-5">
                <p className="text-sm text-gray-700">
                  This is the only time the raw key will be shown. Copy and
                  store it securely.
                </p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    readOnly
                    value={rawKey}
                    className="flex-1 rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm sm:text-base text-gray-900"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={copyRawKey}
                      className="rounded-lg bg-amber-700 px-4 py-3 text-sm sm:text-base font-medium text-white hover:bg-amber-800"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => {
                        setRawKey(null);
                        setCreatedMeta(null);
                      }}
                      className="rounded-lg border border-amber-200 bg-white px-4 py-3 text-sm sm:text-base font-medium text-amber-900 hover:bg-amber-50"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Existing Keys + Instructions */}
          <div className="space-y-6">
            <section className="rounded-xl border border-amber-200 bg-white p-6 mb-6 sm:p-8">
              <h2 className="text-lg font-semibold text-amber-950">
                Your Keys
              </h2>

              <div className="mt-4 space-y-4">
                {loading ? (
                  <p className="text-sm text-gray-600">Loading...</p>
                ) : keys.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No API keys created yet.
                  </p>
                ) : (
                  keys.map((k) => (
                    <div
                      key={k._id}
                      className="flex flex-col gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm sm:text-base font-medium text-amber-950">
                            {k.name}
                          </div>
                          <div className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-600 border border-amber-200">
                            {k.keyPrefix}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          Expires: {new Date(k.expiresAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRevokeConfirm(k)}
                          className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm sm:text-base font-medium text-red-600 hover:bg-red-50"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <ConfirmModal
                isOpen={!!revokeTarget}
                title={`Revoke API key "${revokeTarget?.name}"?`}
                message="Revoking will immediately prevent any use of this key."
                onConfirm={handleRevoke}
                onCancel={() => setRevokeTarget(null)}
                isLoading={isRevoking}
                isDanger
              />
            </section>

            <section className="rounded-xl border border-amber-200 bg-white p-6 sm:p-8">
              <h3 className="text-base font-semibold text-amber-950">
                How to use
              </h3>

              <p className="mt-3 text-sm sm:text-base text-gray-600">
                <strong>For MCP clients (Claude Desktop, Cline, etc):</strong>
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Add this to your MCP configuration file:
              </p>

              <pre className="mt-3 w-full overflow-auto rounded-md bg-gray-900 p-4 text-xs sm:text-sm text-gray-100">
                {` "mcpServers": {
    "dobby-prod": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://localhost:3000/mcp",
        "--transport",
        "http-only",
        "--header",
        "X-API-Key : PASTE_YOUR_API_KEY_HERE"
      ]
    },`}
              </pre>

              <div className="mt-4 space-y-2 rounded-lg border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm font-medium text-amber-950">
                  Setup Instructions:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Create an API key above and copy it</li>
                  <li>
                    Replace{" "}
                    <code className="bg-white px-1 rounded text-xs">
                      PASTE_YOUR_API_KEY_HERE
                    </code>{" "}
                    with your key
                  </li>
                  <li>Paste this config in your MCP client settings</li>
                  <li>Restart your MCP client</li>
                </ol>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Keep your API key secret. Never share it publicly or commit it
                to version control.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApiKeys;
