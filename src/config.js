const DEFAULT_BASE_URL = "https://cricketliveapi.com/api/v1";

function createConfig(options = {}) {
  const apiKey = options.apiKey || process.env.CRICKETLIVEAPI_KEY || "";
  const baseURL = String(options.baseURL || process.env.CRICKETLIVEAPI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const headers = options.headers && typeof options.headers === "object" ? options.headers : {};
  const timeoutMs = Number(options.timeoutMs || 20000);

  if (!apiKey) {
    throw new Error("Missing API key. Pass apiKey to createClient() or set CRICKETLIVEAPI_KEY.");
  }

  return { apiKey, baseURL, headers, timeoutMs };
}

module.exports = {
  DEFAULT_BASE_URL,
  createConfig,
};
