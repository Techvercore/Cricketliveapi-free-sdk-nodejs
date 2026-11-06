const cricket = require("../src");

async function main() {
  const matchId = process.argv[2];
  if (!matchId) {
    console.error("Usage: node examples/match-details.js <matchId>");
    process.exit(1);
  }

  const api = cricket.createClient({
    apiKey: process.env.CRICKETLIVEAPI_KEY,
  });

  const [facts, scorecard] = await Promise.all([
    api.getMatchFacts(matchId),
    api.getScorecard(matchId),
  ]);

  console.log(JSON.stringify({ facts, scorecard }, null, 2).slice(0, 2000));
}

main().catch((error) => {
  console.error(error.status || "", error.message);
  process.exit(1);
});
