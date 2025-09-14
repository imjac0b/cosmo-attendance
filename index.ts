import { ofetch } from "ofetch";

let artists = Bun.env.ARTISTS?.split(",");
const accessToken = Bun.env.ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("ACCESS_TOKEN is not set");
}

if (!artists || artists.length === 0 || artists[0] === "") {
  console.warn("ARTISTS is not set, setting to tripleS");
  artists = ["tripleS"];
}

const cosmo = ofetch.create({
  baseURL: "https://api.cosmo.fans",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "User-Agent": "cosmo/448 CFNetwork/3860.100.1 Darwin/25.0.0",
    deviceid: "iPhone18,4",
    appversion: "2.22.3",
  },
});

for (const artist of artists) {
  const { challenge } = await cosmo("/bff/v3/attendances", {
    params: {
      artist: artist,
    },
  });

  if (!challenge) {
    console.log(`No challenge found for ${artist}, skipping`);
    continue;
  }

  console.log(
    `Found challenge: ${challenge.title} (${challenge.id}) (${
      challenge.nowStageIndex + 1
    }/${challenge.stages.length}) for ${artist}`
  );

  const active = challenge.stages.find(
    (stage: { isActive: boolean; completed: boolean }) =>
      stage.isActive && !stage.completed
  );

  if (!active) {
    console.log(`No active stage found for ${artist}, skipping`);
    continue;
  }

  console.log(`Active stage for ${artist}: ${active.name}`);

  const complete = await cosmo.raw(`/challenge/v1/${challenge.id}/complete`, {
    method: "POST",
    body: {
      stageName: active.name,
    },
  });

  console.log(`Marked stage as complete for ${artist}: ${complete.statusText}`);

  const reward = await cosmo(`/challenge/v1/${challenge.id}/claim-reward`, {
    method: "POST",
    body: {
      stageName: active.name,
    },
  });

  console.log(`Claimed reward for ${artist}:`, reward);
}
