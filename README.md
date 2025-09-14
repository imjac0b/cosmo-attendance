# cosmo-attendance

Automatically complete attendance challenges inside of MODHAUS's Cosmo platform. This tool monitors and responds to attendance check-ins, ensuring consistent participation without manual intervention.

## Setup

Install dependencies:

```bash
bun install
```

Set required environment variables:

```bash
export ACCESS_TOKEN="your_cosmo_access_token"
export ARTISTS="tripleS,artms"  # Optional: comma-separated list of artists
```

Run the automation:

```bash
bun run index.ts
```

Built with Bun runtime for fast execution and reliable automation.
