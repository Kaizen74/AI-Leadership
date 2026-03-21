# C-Suite AI Leadership Simulation

## What This Is

A web app where C-suite leaders practice making strategic AI transformation decisions through realistic business simulations. The app uses AI to play all the characters -- board members, ExCo peers, investors, union representatives -- while leaders make the decisions.

There are 7 scenarios covering: AI transformation strategy, board accountability, workforce communication, competitive response, CHRO-CIO partnership, investor commitments, and ethical dilemmas.

## What You Need Before Starting

1. **An Anthropic account** -- Sign up at https://console.anthropic.com, add a payment method, and note your API key. Estimated cost: $3-8 per team per session.
2. **A GitHub account** -- Sign up at https://github.com (free).
3. **A Vercel account** -- Sign up at https://vercel.com (free tier). Connect your GitHub account during signup.

## Quick Start (Local Development)

```bash
# Clone the repository
git clone <your-repo-url>
cd csuite-simulation

# Install dependencies
npm install

# Set your API key
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Run the development server
npm run dev
```

Open http://localhost:3000 to see the app.

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod

# Set your API key in Vercel
vercel env add ANTHROPIC_API_KEY production
# Paste your key when prompted

# Redeploy with the env var
vercel --prod
```

## Running a Workshop

### Setup (facilitator)

1. Open the app URL on your laptop. Select "Facilitator."
2. Choose a scenario. Note the 5-character session code.
3. Project your dashboard on the room screen.

### Teams join

1. Each team opens the URL on their laptop. Select "Team."
2. Enter the session code and a team name.
3. Read the briefing, discuss strategy, then launch the simulation.

### During the session

- Teams discuss each response before sending (the real learning is in the debate).
- Every 4 turns, the simulation pauses for facilitator-led group discussion.
- After 8-12 turns, teams request their AI assessment.
- Facilitator uses the Pattern Observatory and Reflection Prompt mode for debriefs.

### Recommended first scenario

Start with **The Transformation Bet** -- the foundation scenario about where to invest the AI transformation budget. Every CEO is navigating this decision right now.

## Costs

| Usage | Estimated API Cost |
|-------|-------------------|
| Single team, 2-hour session | $3-8 |
| Workshop (4 teams) | $12-32 |
| Programme (4 workshops x 4 teams) | $48-128 |

## Troubleshooting

- **API errors**: Check your Anthropic API key balance at console.anthropic.com
- **Teams cannot join**: Ensure all devices are online. Session code is case-sensitive.
- **Slow first response**: Normal. The first message loads the full scenario context.
- **Dashboard not updating**: Refresh the page. Polling interval is 5 seconds.

## Tech Stack

- Next.js (App Router) with TypeScript
- Tailwind CSS with custom CSS variables
- Anthropic Claude API (claude-sonnet-4-20250514)
- Server-side API proxy for key security
- In-memory session state (Vercel KV upgrade path available)
