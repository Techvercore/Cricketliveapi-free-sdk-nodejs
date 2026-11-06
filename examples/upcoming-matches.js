const cricket = require("../src");

async function main() {
  const api = cricket.createClient({
    apiKey: process.env.CRICKETLIVEAPI_KEY,
  });

  const upcoming = await api.getUpcomingMatches();
  console.log(JSON.stringify(upcoming, null, 2).slice(0, 1500));
}

main().catch((error) => {
  console.error(error.status || "", error.message);
  process.exit(1);
});
