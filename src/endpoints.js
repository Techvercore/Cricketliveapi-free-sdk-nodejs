const WEBHOOK_EVENTS = [
  "score_update",
  "wicket",
  "over_complete",
  "innings_change",
  "match_start",
  "match_end",
  "toss_update",
];

const SERIES_CATEGORIES = ["all", "international", "domestic", "league", "women"];
const TEAM_CATEGORIES = ["international", "domestic", "league", "women"];
const RANKING_CATEGORIES = ["batting", "bowling", "allrounder", "teams"];
const RANKING_FORMATS = ["test", "odi", "t20"];

function requireId(name, value) {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${name} is required`);
  }
  return encodeURIComponent(String(value));
}

function optionalSlug(slug) {
  if (!slug) return "";
  return `/${encodeURIComponent(String(slug))}`;
}

function oneOf(name, value, allowed) {
  if (!allowed.includes(value)) {
    throw new Error(`${name} must be one of: ${allowed.join(", ")}`);
  }
  return value;
}

function attachEndpoints(http) {
  return {
    getLiveMatches() {
      return http.get("/cricket/matches/live");
    },

    getRecentMatches() {
      return http.get("/cricket/matches/recent");
    },

    getUpcomingMatches() {
      return http.get("/cricket/matches/upcoming");
    },

    getLiveScores() {
      return http.get("/cricket/live");
    },

    getScorecard(matchId, slug) {
      return http.get(`/cricket/scorecard/${requireId("matchId", matchId)}${optionalSlug(slug)}`);
    },

    getLiveScorecard(matchId, slug) {
      return http.get(`/cricket/live-scorecard/${requireId("matchId", matchId)}${optionalSlug(slug)}`);
    },

    getCommentary(matchId, slug) {
      return http.get(`/cricket/commentary/${requireId("matchId", matchId)}${optionalSlug(slug)}`);
    },

    getSquads(matchId, slug) {
      return http.get(`/cricket/squads/${requireId("matchId", matchId)}${optionalSlug(slug)}`);
    },

    getHighlights(matchId, slug) {
      return http.get(`/cricket/highlights/${requireId("matchId", matchId)}${optionalSlug(slug)}`);
    },

    getGraphs(matchId, slug) {
      return http.get(`/cricket/graphs/${requireId("matchId", matchId)}${optionalSlug(slug)}`);
    },

    getOvers(matchId, slug) {
      return http.get(`/cricket/overs/${requireId("matchId", matchId)}${optionalSlug(slug)}`);
    },

    getMatchFacts(matchId, slug) {
      return http.get(`/cricket/match-facts/${requireId("matchId", matchId)}${optionalSlug(slug)}`);
    },

    getSchedule(category = "all") {
      return http.get(`/cricket/schedule/${oneOf("category", category, SERIES_CATEGORIES)}`);
    },

    getSeries(category = "all") {
      return http.get(`/cricket/series/${oneOf("category", category, SERIES_CATEGORIES)}`);
    },

    getSeriesMatches(seriesId) {
      return http.get(`/cricket/series/${requireId("seriesId", seriesId)}/matches`);
    },

    getPointsTable(seriesId) {
      return http.get(`/cricket/series/${requireId("seriesId", seriesId)}/points-table`);
    },

    getSeriesArchive(year) {
      return http.get("/cricket/series-archive", year ? { year } : undefined);
    },

    getWtcPointsTable() {
      return http.get("/cricket/wtc-points-table");
    },

    getTeams(category = "international") {
      return http.get(`/cricket/teams/${oneOf("category", category, TEAM_CATEGORIES)}`);
    },

    getTeamPlayers(teamId, slug) {
      return http.get(`/cricket/team-players/${requireId("teamId", teamId)}${optionalSlug(slug)}`);
    },

    getPlayerProfile(playerId, slug) {
      return http.get(`/cricket/player/${requireId("playerId", playerId)}${optionalSlug(slug)}`);
    },

    getPlayerImage(imageId, slug) {
      return http.getBuffer(`/player-image/${requireId("imageId", imageId)}${optionalSlug(slug)}`);
    },

    getPlayerImageUrl(imageId, slug) {
      return `/player-image/${requireId("imageId", imageId)}${optionalSlug(slug)}`;
    },

    getTeamImage(teamId) {
      return http.getBuffer(`/team-image/${requireId("teamId", teamId)}`);
    },

    getIccRankings(category = "batting", format = "test") {
      const safeCategory = oneOf("category", category, RANKING_CATEGORIES);
      const safeFormat = oneOf("format", format, RANKING_FORMATS);
      return http.get(`/cricket/icc-rankings/${safeCategory}/${safeFormat}`);
    },

    getIccRankingsWomen(category = "batting", format = "odi") {
      const safeCategory = oneOf("category", category, RANKING_CATEGORIES);
      const safeFormat = oneOf("format", format, RANKING_FORMATS);
      return http.get(`/cricket/icc-rankings-women/${safeCategory}/${safeFormat}`);
    },

    getNews() {
      return http.get("/cricket/news");
    },

    getNewsDetail(newsId, slug) {
      return http.get(`/cricket/news/${requireId("newsId", newsId)}${optionalSlug(slug)}`);
    },

    getVideos() {
      return http.get("/cricket/videos");
    },

    getSpotlight() {
      return http.get("/cricket/spotlight");
    },

    getFantasyMatches() {
      return http.get("/fantasy/matches");
    },

    getFantasyPlayers(matchId) {
      return http.get(`/fantasy/players/${requireId("matchId", matchId)}`);
    },

    getPlayingXi(matchId) {
      return http.get(`/fantasy/playing-xi/${requireId("matchId", matchId)}`);
    },

    getFantasyPointsEngine() {
      return http.get("/fantasy/points-engine");
    },

    getFantasyPlayerPoints(matchId) {
      return http.get(`/fantasy/player-points/${requireId("matchId", matchId)}`);
    },

    getFantasyLiveScore(matchId) {
      return http.get(`/fantasy/live-score/${requireId("matchId", matchId)}`);
    },

    getContestLeaderboard(contestId) {
      return http.get(`/contest/leaderboard/${requireId("contestId", contestId)}`);
    },

    listWebhooks() {
      return http.get("/webhooks");
    },

    registerWebhook({ url, events }) {
      if (!url) throw new Error("url is required");
      if (!Array.isArray(events) || events.length === 0) throw new Error("events must be a non-empty array");
      events.forEach((event) => oneOf("event", event, WEBHOOK_EVENTS));
      return http.post("/webhooks", { url, events });
    },

    deleteWebhook(id) {
      return http.delete(`/webhooks/${requireId("id", id)}`);
    },

    toggleWebhook(id) {
      return http.patch(`/webhooks/${requireId("id", id)}/toggle`);
    },
  };
}

module.exports = {
  WEBHOOK_EVENTS,
  attachEndpoints,
};
