# C-Suite AI Leadership Simulation

A web application where C-suite leaders and their direct reports practice making strategic AI transformation decisions through realistic, high-stakes business simulations.

The app uses Claude (Anthropic's AI) to play all the characters in each scenario -- board members, ExCo peers, investors, union representatives, and AI advisory systems -- while senior leaders make the decisions. The real learning happens in the team debate before each response is sent.

---

## The 7 Scenarios

| # | Scenario | Difficulty | Duration | Track |
|---|----------|-----------|----------|-------|
| 1 | **The Transformation Bet** -- Allocate a $200M AI budget with a divided ExCo | Foundation | 30 min | Strategic |
| 2 | **The Board Accountability Crisis** -- Your AI made discriminatory decisions. A journalist is calling. | Advanced | 35 min | Human Dilemma |
| 3 | **The Workforce Transformation Town Hall** -- Address 49,000 employees as trust erodes | Advanced | 35 min | Human Dilemma |
| 4 | **The Competitive Intelligence Dilemma** -- A competitor announces full automation. React or differentiate? | Intermediate | 30 min | Strategic |
| 5 | **The ExCo Alignment Test** -- A trilateral ExCo conflict: CIO wants speed, CHRO wants readiness, CCO says customers are pulling in opposite directions | Intermediate | 35 min | Strategic |
| 6 | **The Investor AI Story** -- Capital Markets Day. What you commit to publicly defines 4 years. | Expert | 40 min | Strategic |
| 7 | **The Ethics Red Line** -- A $180M client wants you to use a discriminatory algorithm | Expert | 40 min | Human Dilemma |

**Recommended first scenario:** Start with The Transformation Bet. It is the foundation scenario and every CEO is navigating this decision right now.

---

## Quick Start (for developers)

```bash
cd csuite-simulation
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev                   # opens at http://localhost:3000
```

---

## Full Deployment Guide

See the [root README](../README.md) for complete step-by-step deployment instructions on Windows, including a no-terminal option via the Vercel website.

---

## Project Structure

```
src/
  app/                    # Pages and API routes
    api/simulate/         # AI simulation engine (server-side)
    api/session/          # Session state management
    facilitator/          # Facilitator setup and dashboard
    team/                 # Team join and simulation play
  components/             # Reusable UI components
  lib/                    # Types, scenarios, and prompt builder
.env.example              # Template for API key configuration
```

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Styling:** Tailwind CSS v4 with custom CSS variables
- **AI Engine:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Security:** Server-side API proxy -- the API key is never exposed to browsers
- **State:** In-memory session store (suitable for single-server deployment)
- **Hosting:** Vercel (free tier)
