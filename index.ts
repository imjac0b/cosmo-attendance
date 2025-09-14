import { ofetch } from "ofetch";

const accessToken = Bun.env.ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("ACCESS_TOKEN is not set");
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

const { challenge } = await cosmo("/bff/v3/attendances", {
  params: {
    artist: "tripleS",
  },
});

if (!challenge) {
  console.log("No challenge found");
  process.exit(1);
}

console.log(
  `Found challenge: ${challenge.title} (${challenge.id}) (${
    challenge.nowStageIndex + 1
  }/${challenge.stages.length})`
);

const active = challenge.stages.find(
  (stage: { isActive: boolean; completed: boolean }) =>
    stage.isActive && !stage.completed
);

if (!active) {
  console.log("No active stage found");
  process.exit(1);
}

console.log(`Active stage: ${active.name}`);

const complete = await cosmo.raw(`/challenge/v1/${challenge.id}/complete`, {
  method: "POST",
  body: {
    stageName: active.name,
  },
});

console.log(`Marked stage as complete: ${complete.statusText}`);

const reward = await cosmo(`/challenge/v1/${challenge.id}/claim-reward`, {
  method: "POST",
  body: {
    stageName: active.name,
  },
});

console.log(`Claimed reward:`, reward);
