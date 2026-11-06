const cricket = require("../src");

async function main() {
  const api = cricket.createClient({
    apiKey: process.env.CRICKETLIVEAPI_KEY,
  });

  const matches = await api.getLiveMatches();
  const list = Array.isArray(matches.data) ? matches.data : [];
  console.log(`Live matches: ${list.length}`);
  console.log(JSON.stringify(list[0] || matches, null, 2).slice(0, 1200));
}

main().catch((error) => {
  console.error(error.status || "", error.message);
  process.exit(1);
});
