const { DEFAULT_BASE_URL } = require("./config");
const { createClient } = require("./client");
const { CricketLiveApiError } = require("./client");
const { WEBHOOK_EVENTS, attachEndpoints } = require("./endpoints");

function createApi(options = {}) {
  const http = createClient(options);
  const api = attachEndpoints(http);
  api.baseURL = (options.baseURL || process.env.CRICKETLIVEAPI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
  api.playerImageUrl = (imageId, slug) => `${api.baseURL}${api.getPlayerImageUrl(imageId, slug)}`;
  api.teamImageUrl = (teamId) => `${api.baseURL}/team-image/${encodeURIComponent(String(teamId))}`;
  return api;
}

module.exports = {
  DEFAULT_BASE_URL,
  WEBHOOK_EVENTS,
  CricketLiveApiError,
  createClient: createApi,
};
