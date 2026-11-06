# CricketLiveAPI Node.js SDK

Official **Cricket API Node.js** client for [CricketLiveApi](https://cricketliveapi.com). Drop the **CricketLiveAPI Node.js SDK** into a Node.js app, pass your own API key, and call live scores, scorecards, commentary, squads, graphs, rankings, fantasy points, and webhooks.

This package is a **Node.js Cricket API Integration** helper. It does not create accounts, sell keys, or run a backend. Get your key from [cricketliveapi.com](https://cricketliveapi.com).

Developed and maintained by [Techwarezen Private Limited](https://techwarezen.com).

## Features

- Cricket Live Score API Node.js methods for live, recent, and upcoming matches
- Cricket Score API JavaScript calls for scorecard, live scorecard, commentary, squads, highlights, and graphs
- Cricket Data API Node.js coverage for series, schedule, teams, player profile, ICC rankings, news, and videos
- Fantasy points, playing XI, and contest leaderboard
- Webhook register, list, toggle, and delete
- Bearer auth, timeouts, and `CricketLiveApiError` with HTTP status and body
- Node.js 18+ built-in `fetch`. No runtime dependencies

## Installation

```bash
npm install @techvercore/cricketliveapi
```

GitHub Packages needs this in the project `.npmrc` before install:

```text
@techvercore:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

`NODE_AUTH_TOKEN` is a GitHub token with `read:packages`. Do not commit the token.

The npm package is MIT and free. CricketLiveAPI itself needs an API key from [cricketliveapi.com](https://cricketliveapi.com). Calls count against your plan.

The package is ready to publish. This repository does not publish it for you.

Node.js 18 or newer is required.

## API key configuration

Every request sends `Authorization: Bearer <your key>`. The SDK never generates a key and never prints the key.

```javascript
const cricket = require("cricketliveapi");

const api = cricket.createClient({
  apiKey: process.env.CRICKETLIVEAPI_KEY,
});
```

Or set the environment variable and omit `apiKey`:

```bash
# Windows PowerShell
$env:CRICKETLIVEAPI_KEY = "YOUR_CRICKETLIVEAPI_KEY"

# macOS / Linux
export CRICKETLIVEAPI_KEY="YOUR_CRICKETLIVEAPI_KEY"
```

Optional client fields:

| Option | Default | Purpose |
| --- | --- | --- |
| `apiKey` | `CRICKETLIVEAPI_KEY` | Your CricketLiveAPI bearer token |
| `baseURL` | `https://cricketliveapi.com/api/v1` | Override only if CricketLiveAPI gives you another host |
| `headers` | `{}` | Extra headers merged into every request |
| `timeoutMs` | `20000` | Abort the request after this many milliseconds |

## Base URL

```text
https://cricketliveapi.com/api/v1
```

```javascript
const api = cricket.createClient({
  apiKey: process.env.CRICKETLIVEAPI_KEY,
  baseURL: "https://cricketliveapi.com/api/v1",
});
```

Paths below are relative to that base. Official reference: [https://cricketliveapi.com/api-docs](https://cricketliveapi.com/api-docs).

## Quick start

```javascript
const cricket = require("cricketliveapi");

const api = cricket.createClient({
  apiKey: process.env.CRICKETLIVEAPI_KEY,
});

const matches = await api.getLiveMatches();
console.log(matches);
```

A successful JSON body looks like:

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "match_id": 173060,
        "series_name": "India tour of England, 2026",
        "first_team": { "name": "India", "score": "287/6 (50 Ov)" },
        "second_team": { "name": "England", "score": "214/4 (38.2 Ov)" },
        "status": "England need 74 runs from 70 balls"
      }
    ]
  }
}
```

Live match objects also include `team_image_url` on each team when an image id is available.

## Available API endpoints

Auth on every JSON method: `Authorization: Bearer YOUR_API_KEY`. An active subscription is required. Player and team image URLs are public, but this client still sends the bearer token.

### Live, recent, and upcoming matches

| Method | HTTP | Path | Params |
| --- | --- | --- | --- |
| `getLiveMatches()` | GET | `/cricket/matches/live` | none |
| `getRecentMatches()` | GET | `/cricket/matches/recent` | none |
| `getUpcomingMatches()` | GET | `/cricket/matches/upcoming` | none |
| `getLiveScores()` | GET | `/cricket/live` | none |

`getRecentMatches()` is the results list. `getUpcomingMatches()` is the upcoming list.

### Scorecard, commentary, squads, highlights, graphs

`matchId` is required. `slug` is optional and only changes the URL, not the data.

| Method | HTTP | Path |
| --- | --- | --- |
| `getScorecard(matchId, slug?)` | GET | `/cricket/scorecard/{matchId}/{slug?}` |
| `getLiveScorecard(matchId, slug?)` | GET | `/cricket/live-scorecard/{matchId}/{slug?}` |
| `getCommentary(matchId, slug?)` | GET | `/cricket/commentary/{matchId}/{slug?}` |
| `getSquads(matchId, slug?)` | GET | `/cricket/squads/{matchId}/{slug?}` |
| `getHighlights(matchId, slug?)` | GET | `/cricket/highlights/{matchId}/{slug?}` |
| `getGraphs(matchId, slug?)` | GET | `/cricket/graphs/{matchId}/{slug?}` |
| `getOvers(matchId, slug?)` | GET | `/cricket/overs/{matchId}/{slug?}` |
| `getMatchFacts(matchId, slug?)` | GET | `/cricket/match-facts/{matchId}/{slug?}` |

`getGraphs` returns the chart payload: win probability, worm, run rate, partnerships, and ball map. `getMatchFacts` returns toss, umpires, referee, venue, and squads. `getOvers` is the over-by-over summary used for charts.

```javascript
const matchId = 173060;

const scorecard = await api.getScorecard(matchId);
const commentary = await api.getCommentary(matchId);
const squads = await api.getSquads(matchId);
const highlights = await api.getHighlights(matchId);
const graphs = await api.getGraphs(matchId);
const facts = await api.getMatchFacts(matchId);
```

Scorecard innings include batters, bowlers, extras, total, and fall of wickets. Commentary entries include over, batter, bowler, runs, and wicket flag. Shapes follow the live API; fields can be empty when a match has not started.

### Schedule and series

| Method | HTTP | Path | Params |
| --- | --- | --- | --- |
| `getSchedule(category = "all")` | GET | `/cricket/schedule/{category}` | `all`, `international`, `domestic`, `league`, `women` |
| `getSeries(category = "all")` | GET | `/cricket/series/{category}` | same categories |
| `getSeriesMatches(seriesId)` | GET | `/cricket/series/{seriesId}/matches` | numeric series id |
| `getPointsTable(seriesId)` | GET | `/cricket/series/{seriesId}/points-table` | numeric series id |
| `getSeriesArchive(year?)` | GET | `/cricket/series-archive?year=YYYY` | optional `year`, defaults to the current year on the server |
| `getWtcPointsTable()` | GET | `/cricket/wtc-points-table` | none |

```javascript
const international = await api.getSeries("international");
const archive = await api.getSeriesArchive(2026);
const table = await api.getPointsTable(seriesId);
```

### Teams, player profile, and images

| Method | HTTP | Path | Params |
| --- | --- | --- | --- |
| `getTeams(category = "international")` | GET | `/cricket/teams/{category}` | `international`, `domestic`, `league`, `women` |
| `getTeamPlayers(teamId, slug?)` | GET | `/cricket/team-players/{teamId}/{slug?}` | numeric team id |
| `getPlayerProfile(playerId, slug?)` | GET | `/cricket/player/{playerId}/{slug?}` | numeric player id. Bio, image, batting and bowling stats |
| `playerImageUrl(imageId, slug?)` | — | full URL | does not download the file |
| `getPlayerImage(imageId, slug?)` | GET | `/player-image/{imageId}/{slug?}` | returns image bytes (`Buffer`) |
| `teamImageUrl(teamId)` | — | full URL | does not download the file |
| `getTeamImage(teamId)` | GET | `/team-image/{teamId}` | returns image bytes (`Buffer`) |

```javascript
const profile = await api.getPlayerProfile(playerId);
const imageUrl = api.playerImageUrl(profile.data.image_id);
```

### ICC rankings

| Method | HTTP | Path |
| --- | --- | --- |
| `getIccRankings(category, format)` | GET | `/cricket/icc-rankings/{category}/{format}` |
| `getIccRankingsWomen(category, format)` | GET | `/cricket/icc-rankings-women/{category}/{format}` |

`category`: `batting`, `bowling`, `allrounder`, `teams`.  
`format`: `test`, `odi`, `t20`.  
Defaults: men `batting` / `test`, women `batting` / `odi`.

```javascript
const batters = await api.getIccRankings("batting", "odi");
```

### News and video

| Method | HTTP | Path |
| --- | --- | --- |
| `getNews()` | GET | `/cricket/news` |
| `getNewsDetail(newsId, slug?)` | GET | `/cricket/news/{newsId}/{slug?}` |
| `getVideos()` | GET | `/cricket/videos` |
| `getSpotlight()` | GET | `/cricket/spotlight` |

### Fantasy

| Method | HTTP | Path |
| --- | --- | --- |
| `getFantasyMatches()` | GET | `/fantasy/matches` |
| `getFantasyPlayers(matchId)` | GET | `/fantasy/players/{matchId}` |
| `getPlayingXi(matchId)` | GET | `/fantasy/playing-xi/{matchId}` |
| `getFantasyPointsEngine()` | GET | `/fantasy/points-engine` |
| `getFantasyPlayerPoints(matchId)` | GET | `/fantasy/player-points/{matchId}` |
| `getFantasyLiveScore(matchId)` | GET | `/fantasy/live-score/{matchId}` |
| `getContestLeaderboard(contestId)` | GET | `/contest/leaderboard/{contestId}` |

`getFantasyPlayers` returns roles (`WK`, `BAT`, `AR`, `BOWL`) and credits. `getFantasyPlayerPoints` returns the points total for that match.

### Webhooks

| Method | HTTP | Path | Body |
| --- | --- | --- | --- |
| `listWebhooks()` | GET | `/webhooks` | — |
| `registerWebhook({ url, events })` | POST | `/webhooks` | `url` (required URL), `events` (1+ names) |
| `deleteWebhook(id)` | DELETE | `/webhooks/{id}` | — |
| `toggleWebhook(id)` | PATCH | `/webhooks/{id}/toggle` | — |

Event names (`cricket.WEBHOOK_EVENTS`):

- `score_update`
- `wicket`
- `over_complete`
- `innings_change`
- `match_start`
- `match_end`
- `toss_update`

```javascript
const created = await api.registerWebhook({
  url: "https://yourapp.com/cricket-hook",
  events: ["score_update", "wicket", "match_end"],
});

// created.data.secret is returned once. Store it. The API will not show it again.
```

Limits from the API: 5 webhook endpoints per account. A sixth register returns HTTP 422.

#### Payload format

CricketLiveAPI POSTs JSON to your URL. Verify the signature with the secret you stored at registration, then read `event` and `data`.

```json
{
  "event": "wicket",
  "match_id": 173060,
  "data": {
    "team_a": {
      "team_id": "776162",
      "team_name": "India",
      "team_short": "IND",
      "team_image_url": ""
    },
    "score": "241/10",
    "curr_score": "241/10",
    "prev_score": "241/9"
  }
}
```

`event` is one of the names above. `team_image_url` uses the CricketLiveAPI image host.

```javascript
const crypto = require("crypto");

function isValidWebhook(rawBody, signatureHeader, secret) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return signatureHeader === expected;
}
```

Confirm the header name in [the webhook section of the API docs](https://cricketliveapi.com/api-docs) before you lock the check. The body fields above match the current score-change payload.

## Verified responses

These samples were returned by the live API through this SDK. Arrays are cut to the first item. Names, scores, and counts change every match.

### Live matches — `getLiveMatches()`

```json
{
  "success": true,
  "type": "live",
  "count": 5,
  "data": [
    {
      "match_id": 173060,
      "series_id": 13211,
      "series_name": "West Indies tour of Bangladesh, 2026",
      "match_desc": "2nd Test",
      "format": "TEST",
      "venue": "Sylhet International Cricket Stadium, Sylhet"
    }
  ]
}
```

### Recent matches — `getRecentMatches()`

```json
{
  "success": true,
  "type": "recent",
  "count": 94,
  "data": [
    {
      "match_id": 177701,
      "series_name": "Nepal Premier League 2026",
      "match_desc": "14th Match",
      "format": "T20",
      "state": "Complete",
      "status": "Lumbini Lions won by 16 runs"
    }
  ]
}
```

### Upcoming matches — `getUpcomingMatches()`

```json
{
  "success": true,
  "type": "upcoming",
  "count": 44,
  "data": [
    {
      "match_id": 173060,
      "series_name": "West Indies tour of Bangladesh, 2026",
      "match_desc": "2nd Test",
      "match_format": "TEST",
      "state": "upcoming",
      "first_team": { "id": 776191, "name": "West Indies", "short_name": "WI", "team_image_url": "" },
      "second_team": { "id": 776210, "name": "Bangladesh", "short_name": "BAN", "team_image_url": "" }
    }
  ]
}
```

### Scorecard — `getScorecard(177701)`

```json
{
  "success": true,
  "data": {
    "match_id": 177701,
    "innings": [
      {
        "bat_team": "Lumbini Lions",
        "bat_team_short": "LUL",
        "bowl_team": "Janakpur Bolts",
        "score": "149/8 (20 ov)",
        "run_rate": 7.45,
        "batsmen": [
          { "player_id": 11050, "name": "D Arcy Short", "runs": 0, "balls": 1, "out_desc": "c Rahul Yadav b Lalit Rajbanshi" }
        ],
        "bowlers": [
          { "player_id": 13626, "name": "Lalit Rajbanshi", "overs": 4, "runs": 31, "wickets": 1, "economy": 7.8 }
        ],
        "extras_detail": { "total": 5, "byes": 1, "leg_byes": 1, "wides": 3, "no_balls": 0 },
        "fall_of_wickets": [{ "wkt_num": 1, "player": "D Arcy Short", "runs": 0, "over": 0.1 }]
      }
    ]
  }
}
```

### Commentary — `getCommentary(177701)`

```json
{
  "success": true,
  "data": {
    "match_id": 177701,
    "miniscore": {
      "bat_team_score": 133,
      "bat_team_wickets": 8,
      "overs": 20,
      "target": 150,
      "status": "Lumbini Lions won by 16 runs"
    },
    "commentary": [
      { "text": "Result - Lumbini Lions won by 16 runs", "innings_id": 2 }
    ]
  }
}
```

### Squads — `getSquads(177701)`

```json
{
  "success": true,
  "data": [
    {
      "team_id": 2918,
      "team_name": "Janakpur Bolts",
      "team_short": "JAB",
      "playing_xi": [
        {
          "id": 15273,
          "name": "Parvez Hossain Emon",
          "role": "WK-Batter",
          "image_id": "616459",
          "player_image_url": "https://cricketliveapi.com/api/v1/player-image/616459/parvez-hossain-emon"
        }
      ]
    }
  ]
}
```

### Highlights — `getHighlights(177701)`

```json
{
  "success": true,
  "data": {
    "total": 28,
    "highlights": [
      {
        "over": 19.6,
        "event": "over-break,WICKET",
        "bat_team": "LUL",
        "batsman": "Ruben Trumpelmann",
        "bowler": "Lalit Rajbanshi",
        "text": "Lalit Rajbanshi to Ruben Trumpelmann, out Ruben Trumpelmann Run Out!!"
      }
    ]
  }
}
```

### Graphs — `getGraphs(177701)`

```json
{
  "success": true,
  "data": {
    "matchId": 177701,
    "team1Name": "LUL",
    "team2Name": "JAB",
    "runsChartData": [{ "over": 0, "team1": 0, "team2": 0, "tooltipText": "Over 0 | LUL: 0 • JAB: 0" }],
    "runRateChartData": [{ "over": 0, "team1": 0, "team2": 0 }],
    "runsPerOverData": [{ "over": 1, "team1": 3, "team2": 6, "isTeam1Wicket": true }],
    "winProbability": { "1": [{ "over": 0, "team1": 50, "team2": 50 }] }
  }
}
```

### Match facts — `getMatchFacts(177701)`

```json
{
  "success": true,
  "data": {
    "match_id": 177701,
    "toss": "Janakpur Bolts won the toss and opt to Bowl",
    "venue": "Tribhuvan University International Cricket Ground, Kirtipur",
    "umpires": "",
    "referee": "",
    "venue_details": { "ground": "Tribhuvan University International Cricket Ground", "city": "Kirtipur", "timezone": "+05:45" }
  }
}
```

### Schedule — `getSchedule("all")`

```json
{
  "success": true,
  "category": "all",
  "total": 133,
  "data": [
    {
      "date": "FRI, NOV 06 2026",
      "series": [
        {
          "series_id": 13211,
          "series_name": "West Indies tour of Bangladesh, 2026",
          "matches": [
            { "match_id": 173060, "match_desc": "2nd Test, Day 2", "team1": "Bangladesh", "team2": "West Indies" }
          ]
        }
      ]
    }
  ]
}
```

### Series list — `getSeries("international")`

```json
{
  "success": true,
  "data": {
    "category": "international",
    "total": 22,
    "months": [
      {
        "month": "FEBRUARY 2024",
        "series": [
          { "id": 7572, "name": "ICC Cricket World Cup League Two 2023-27", "start_date": "2024-02-15", "end_date": "2027-12-29" }
        ]
      }
    ]
  }
}
```

### Teams — `getTeams("international")`

```json
{
  "success": true,
  "data": {
    "total": 38,
    "teams": [
      { "id": 2, "name": "India", "short_name": "IND", "country": "India", "image_url": "" }
    ]
  }
}
```

### Player profile — `getPlayerProfile(15273)`

```json
{
  "success": true,
  "player_id": 15273,
  "data": {
    "id": 15273,
    "name": "Parvez Hossain Emon",
    "bio": { "Born": "June 12, 2002 (24 years)", "Role": "WK-Batsman", "Batting Style": "Left Handed Bat" },
    "batting_form": [{ "score": "70(96)", "oppn": "AFG", "format": "ODI", "date": "21 Oct 26" }],
    "career_timeline": [{ "format": "T20", "debut": "vs Zimbabwe, 2022-08-02", "last": "vs Sri Lanka, 2026-10-03" }]
  }
}
```

### Player image — `getPlayerImage(616459)`

Returns a `Buffer`, not JSON. The live call returned `1128` bytes. Build the URL without downloading:

```javascript
api.playerImageUrl(616459, "parvez-hossain-emon");
// https://cricketliveapi.com/api/v1/player-image/616459/parvez-hossain-emon
```

### ICC rankings — `getIccRankings("batting", "odi")`

```json
{
  "success": true,
  "category": "batting",
  "format": "odi",
  "count": 15,
  "data": {
    "rankings": [
      { "rank": "1", "id": "11808", "name": "Shubman Gill", "country": "India", "rating": "841", "faceImageId": "616515" }
    ]
  }
}
```

### Webhook list — `listWebhooks()`

```json
{ "success": true, "data": [] }
```

An empty `data` array means this account has no webhooks yet. `registerWebhook()` was not called during the test, so no endpoint was created.

## Parameters and responses

- Path ids (`matchId`, `seriesId`, `playerId`, `teamId`, `newsId`, `contestId`) are required numbers.
- Category and ranking values are checked in the SDK before the request. A bad value throws a normal `Error` and does not call the API.
- JSON responses use `success: true` and a `data` object. Image methods return a `Buffer`, not JSON.
- `playerImageUrl()` and `teamImageUrl()` only build a string. They do not send a request.

## Error handling

```javascript
const { CricketLiveApiError } = require("cricketliveapi");

try {
  const matches = await api.getLiveMatches();
} catch (error) {
  if (error instanceof CricketLiveApiError) {
    console.error(error.status, error.message, error.body);
  } else {
    console.error(error.message);
  }
}
```

| Status | Meaning |
| --- | --- |
| 401 | Missing or invalid bearer token |
| 403 | Token is valid but the subscription is not active |
| 404 | Unknown id, or a webhook you do not own |
| 422 | Validation failed (webhook URL, events, or the 5-webhook limit) |
| 429 | Daily or per-minute quota exceeded |
| 500 | Unexpected server error |
| 502 | Upstream cricket data failed. `body.error` has the scraper message |
| 0 | Client timeout (`timeoutMs`) |

The SDK throws when HTTP status is not OK, and also when the JSON body has `success: false`.

## Examples

From this repository, with `CRICKETLIVEAPI_KEY` set:

```bash
node examples/live-matches.js
node examples/upcoming-matches.js
node examples/match-results.js
node examples/match-details.js 173060
```

## FAQ

**Is this a free Cricket API SDK?**  
The npm package is MIT and free. CricketLiveAPI itself needs an API key from [cricketliveapi.com](https://cricketliveapi.com). Calls count against your plan.

**Can the SDK create an API key?**  
No. Pass the key you already have. Do not commit it.

**Which base URL should I use?**  
`https://cricketliveapi.com/api/v1` unless support gives you another host.

**Why did `getLiveMatches()` fail with 403?**  
The token is authenticated, but the account has no active subscription.

**Where is search?**  
`GET /cricket/search/matches` exists in routing and currently returns `501 Not implemented`. This SDK does not wrap it.

## Official documentation

- API docs: [https://cricketliveapi.com/api-docs](https://cricketliveapi.com/api-docs)
- Website: [https://cricketliveapi.com](https://cricketliveapi.com)
- Company: [https://techwarezen.com](https://techwarezen.com)

## Support and contact

- Email: support@cricketliveapi.com
- Issues: [github.com/Techvercore/Cricketliveapi-free-sdk-nodejs/issues](https://github.com/Techvercore/Cricketliveapi-free-sdk-nodejs/issues)

## License

MIT. Copyright Techwarezen Private Limited.
