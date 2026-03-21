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

## What You Need Before Starting

You need three accounts (all free to create) and one paid API key:

### 1. Anthropic API Key (required, paid)

This is the only cost. The API key lets the app use Claude to run the simulations.

1. Go to https://console.anthropic.com
2. Click "Sign Up" and create an account
3. Once logged in, click "API Keys" in the left sidebar
4. Click "Create Key", give it a name (e.g. "leadership-sim"), and copy the key
5. Go to "Plans & Billing" and add a payment method
6. Add at least $10 in credits to start (this covers several workshops)

**Keep your API key safe.** Do not share it publicly. You will need it during deployment.

### 2. GitHub Account (free)

1. Go to https://github.com and click "Sign Up"
2. Complete registration with your email

### 3. Vercel Account (free)

Vercel hosts the app on the internet so your teams can access it from any device.

1. Go to https://vercel.com and click "Sign Up"
2. Choose "Continue with GitHub" and connect your GitHub account

---

## Deployment Guide

This section walks you through getting the app live on the internet. You will use the **Terminal** application on your computer to run commands. Each step tells you exactly what to type.

### Step 1: Install Node.js

Node.js is required to build and deploy the app.

**On Mac:**
Open Terminal (search for "Terminal" in Spotlight) and run:
```bash
curl -fsSL https://fnm.vercel.app/install | bash
```
Close and reopen Terminal, then run:
```bash
fnm install 20
```

**On Windows:**
Download and install Node.js from https://nodejs.org (choose the LTS version). Use the default settings in the installer.

Verify it worked by typing:
```bash
node --version
```
You should see a version number like `v20.x.x`.

### Step 2: Install Git

Git is used to download the code.

**On Mac:** Git is usually pre-installed. Test by typing:
```bash
git --version
```
If it is not installed, macOS will prompt you to install it.

**On Windows:** Download from https://git-scm.com/download/win and install with default settings.

### Step 3: Download the Code

Open Terminal and run these commands one at a time:

```bash
git clone https://github.com/Kaizen74/AI-Leadership.git
```

```bash
cd AI-Leadership/csuite-simulation
```

```bash
npm install
```

The last command installs all dependencies. It may take 1-2 minutes.

### Step 4: Test Locally (Optional)

Before deploying, you can test on your own computer.

Create a file for your API key:
```bash
cp .env.example .env.local
```

Open the file and add your key. On Mac:
```bash
nano .env.local
```
Replace `your_key_here` with your actual Anthropic API key. Press `Ctrl+X`, then `Y`, then `Enter` to save.

Start the app:
```bash
npm run dev
```

Open http://localhost:3000 in your browser. You should see the landing page with "Facilitator" and "Team" buttons. Press `Ctrl+C` in Terminal to stop the server when done.

### Step 5: Deploy to the Internet via Vercel

Install the Vercel command-line tool:
```bash
npm install -g vercel
```

Log in to Vercel (this opens a browser window):
```bash
vercel login
```

Deploy the app:
```bash
vercel --prod
```

Vercel will ask a few questions:
- **Set up and deploy?** Type `Y` and press Enter
- **Which scope?** Select your account and press Enter
- **Link to existing project?** Type `N` and press Enter
- **Project name?** Press Enter to accept the default
- **Which directory is the code in?** Type `./` and press Enter
- **Want to modify these settings?** Type `N` and press Enter

Wait for the deployment to finish. Vercel will show you a URL like `https://csuite-simulation.vercel.app`. **This is your app's address.** Save it.

### Step 6: Add Your API Key to Vercel

Your API key needs to be added to the live deployment:

```bash
vercel env add ANTHROPIC_API_KEY production
```

When prompted, paste your Anthropic API key and press Enter.

Now redeploy so the key takes effect:
```bash
vercel --prod
```

### Step 7: Verify

Open your app URL in a browser. You should see the landing page. Click "Facilitator", select a scenario, and create a session. If everything works, your app is ready for workshops.

---

## Running a Workshop

### Before the session

1. Ensure your Anthropic account has credits (check at https://console.anthropic.com under "Plans & Billing")
2. Test the app URL on the device you will use to facilitate
3. Have 1 laptop per team (3-5 people per team is ideal)

### Setup (facilitator)

1. Open the app URL on your laptop
2. Click **Facilitator**
3. Select a scenario from the list
4. Click **Create Session** -- a 5-character code appears (e.g. `KR4NP`)
5. Project your dashboard on the room screen so everyone can see the code

### Teams join

1. Each team opens the app URL on their laptop
2. Click **Team**
3. Enter the session code displayed on the facilitator's screen
4. Enter a team name (e.g. "Team Alpha")
5. The scenario briefing appears -- teams should read it carefully and discuss strategy before launching

### During the simulation

- Teams type their responses as the leader (CEO) in the chat interface
- Claude plays all the other characters (CFO, board chair, union rep, AI systems, etc.)
- **The real learning is in the team debate** before each message is sent
- Every **4 turns**, the simulation pauses for a **Pit Stop**:
  - Each team sees their interim scores (private, not shared with other teams)
  - Discussion questions appear for the facilitator to lead a group conversation
  - A reflection prompt displays with a 2-minute timer for individual thinking
  - Click "Resume Simulation" to continue
- After **8-12 turns**, teams click **End & Request Assessment** for a full AI-generated debrief

### Facilitator dashboard features

- **Team Status Grid** -- see which teams are playing, at a pit stop, or completed
- **Pattern Observatory** -- after 2+ teams finish a pit stop, anonymised patterns appear (e.g. "Teams averaged 4.2/5 on strategic clarity but only 2.8/5 on alignment")
- **Reflection Prompt Mode** -- click to display the scenario's reflection question full-screen for projection. Click anywhere to start the 2-minute timer.
- **View Team Scores (Private)** -- see individual team scores for debrief design. These are never shown to other teams.

### Recommended session flow

| Time | Activity |
|------|----------|
| 0-5 min | Facilitator introduces scenario, teams join |
| 5-10 min | Teams read briefing, discuss strategy |
| 10-30 min | Simulation (aim for 8-12 turns) |
| At pit stops | Facilitator leads 5-min group discussion |
| 30-35 min | Teams request final assessment |
| 35-50 min | Facilitator-led debrief using Pattern Observatory and Reflection Prompt |

---

## Costs

| Usage | Estimated API Cost |
|-------|-------------------|
| Single team, 1 session | $3-8 |
| Workshop (4 teams, 1 scenario) | $12-32 |
| Full programme (4 workshops, 4 teams each) | $48-128 |

Monitor your usage at https://console.anthropic.com under "Usage".

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "ANTHROPIC_API_KEY is not configured" | Your API key is missing from the deployment. Run `vercel env add ANTHROPIC_API_KEY production` and then `vercel --prod` to redeploy. |
| API errors or no response | Check your Anthropic credit balance at https://console.anthropic.com. Add more credits if needed. |
| Teams cannot join session | Ensure all devices are on the same network and online. The session code is case-sensitive -- type it exactly as shown. |
| Slow first response | Normal. The first message loads the full scenario context (2,000+ words). Subsequent responses are faster. |
| Dashboard not updating | Refresh the browser page. The dashboard polls for updates every 5 seconds. |
| "Session not found" error | Sessions are stored in server memory. If the server restarts (e.g. after a new deployment), previous sessions are cleared. Create a new session. |
| App shows wrong fonts or plain white background | Your browser may be blocking Google Fonts. Try a different browser or check your ad blocker settings. |

---

## Updating the App

If you need to update the app after making changes:

```bash
cd AI-Leadership/csuite-simulation
vercel --prod
```

This deploys the latest code to your existing URL.

---

## Project Structure

All application code lives inside the `csuite-simulation/` directory:

```
csuite-simulation/
  src/
    app/                    # Next.js pages and API routes
      api/simulate/         # Anthropic API proxy (server-side)
      api/session/          # Session state management
      facilitator/          # Facilitator setup and dashboard
      team/                 # Team join and simulation play
    components/             # Reusable UI components
    lib/                    # Types, scenarios, and prompt builder
  .env.example              # Template for API key configuration
```

---

## Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS with custom CSS variables
- **AI Engine:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Security:** Server-side API proxy -- the API key is never exposed to browsers
- **State:** In-memory session store (suitable for single-server deployment)
- **Hosting:** Vercel (free tier)
