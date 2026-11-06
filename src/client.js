const { createConfig } = require("./config");

class CricketLiveApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "CricketLiveApiError";
    this.status = status;
    this.body = body;
  }
}

function buildQuery(query) {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.append(key, String(value));
  });
  const text = params.toString();
  return text ? `?${text}` : "";
}

function createHttp(config) {
  async function request(method, path, { query, body, raw } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs);
    const url = `${config.baseURL}${path}${buildQuery(query)}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Accept: raw ? "*/*" : "application/json",
          Authorization: `Bearer ${config.apiKey}`,
          ...(body ? { "Content-Type": "application/json" } : {}),
          ...config.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (raw) {
        if (!response.ok) {
          const text = await response.text();
          throw new CricketLiveApiError(`CricketLiveAPI ${response.status}`, response.status, text);
        }
        return Buffer.from(await response.arrayBuffer());
      }

      const text = await response.text();
      let payload = null;
      if (text) {
        try {
          payload = JSON.parse(text);
        } catch (error) {
          payload = { raw: text };
        }
      }

      if (!response.ok || (payload && payload.success === false)) {
        const message = (payload && (payload.message || payload.error)) || `CricketLiveAPI ${response.status}`;
        throw new CricketLiveApiError(message, response.status, payload);
      }

      return payload;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new CricketLiveApiError("Request timed out", 0, null);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    get: (path, query) => request("GET", path, { query }),
    post: (path, body) => request("POST", path, { body }),
    patch: (path) => request("PATCH", path),
    delete: (path) => request("DELETE", path),
    getBuffer: (path) => request("GET", path, { raw: true }),
  };
}

function createClient(options = {}) {
  const config = createConfig(options);
  return createHttp(config);
}

module.exports = {
  CricketLiveApiError,
  createClient,
  createHttp,
};
