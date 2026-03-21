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

You need two accounts and one paid API key. Budget 15-20 minutes for the entire setup.

### 1. Anthropic API Key (required -- this is the only cost)

The API key lets the app use Claude to run the simulations.

1. Open your browser and go to **https://console.anthropic.com**
2. Click **"Sign Up"** and create an account with your email
3. Once logged in, click **"API Keys"** in the left sidebar
4. Click **"Create Key"**, give it a name (e.g. `leadership-sim`), and click **Create**
5. A long string of text appears -- this is your API key. **Click the copy button** next to it and paste it somewhere safe (e.g. a private note or password manager). You will need it later.
6. Click **"Plans & Billing"** in the left sidebar and add a payment method
7. Add at least **$10 in credits** to start (this covers several workshops)

**Keep your API key private.** Do not share it in emails, chats, or public documents.

### 2. GitHub Account (free)

1. Go to **https://github.com** and click **"Sign Up"**
2. Complete registration with your email
3. You do not need to create any repositories -- just having an account is enough

### 3. Vercel Account (free)

Vercel is the service that puts the app on the internet so your teams can access it from any device.

1. Go to **https://vercel.com** and click **"Sign Up"**
2. Choose **"Continue with GitHub"** -- this links your GitHub account automatically
3. Approve the permissions when prompted

---

## Deployment on Windows (Step by Step)

This section walks you through getting the app live on the internet from a Windows PC. **You have two options:**

- **Option A (Easiest -- no terminal needed):** Deploy directly from the Vercel website
- **Option B (Terminal):** Deploy using commands in PowerShell

Most people should use **Option A**. It is faster and requires no software installation.

---

### Option A: Deploy from the Vercel Website (Recommended)

This method uses only your web browser. No software installation required.

#### Step A1: Import the project into Vercel

1. Make sure you are logged in to **https://vercel.com**
2. Click this link to import the project directly: **https://vercel.com/new** and then **click "Import Third-Party Git Repository"** at the bottom of the page
3. Paste this URL into the box:
   ```
   https://github.com/Kaizen74/AI-Leadership
   ```
4. Click **Continue**
5. If Vercel asks you to create a repository in your GitHub account, accept the defaults and click **Create**

#### Step A2: Configure the project settings

Before clicking Deploy, you need to tell Vercel where the app code is:

1. Under **"Root Directory"**, click **Edit** and type:
   ```
   csuite-simulation
   ```
2. Click **Continue** or confirm the change
3. Under **"Framework Preset"**, verify it says **Next.js** (it should auto-detect this)

#### Step A3: Add your API key

1. On the same deployment page, look for a section called **"Environment Variables"**
2. In the **"Name"** field, type exactly:
   ```
   ANTHROPIC_API_KEY
   ```
3. In the **"Value"** field, paste the API key you copied from Anthropic earlier
4. Click **Add**

#### Step A4: Deploy

1. Click the **"Deploy"** button
2. Wait 1-2 minutes while Vercel builds your app. You will see a progress log.
3. When it finishes, a **"Congratulations!"** screen appears with your live URL (e.g. `https://csuite-simulation-abc123.vercel.app`)
4. **Copy this URL and save it.** This is the address you will share with workshop participants.

#### Step A5: Add a Redis database (required for sessions to work)

The app needs a small database so that when a facilitator creates a session, teams can find it. This is free and takes 2 minutes.

1. From your Vercel dashboard, click on your **project name** (e.g. "csuite-simulation")
2. Click the **"Storage"** tab at the top of the page
3. Click **"Create Database"** (or **"Connect Store"**)
4. Choose **"Upstash Redis"** (or just **"Redis"** / **"KV"**)
5. Select the **Free** plan
6. Give it a name (e.g. `csuite-sessions`) and click **Create**
7. When asked to connect it to your project, select your project and click **Connect**
8. Vercel automatically adds the required connection credentials to your project

Now redeploy so the database connection takes effect:

1. Click the **"Deployments"** tab
2. Find the latest deployment, click the three dots (**...**) on the right
3. Click **"Redeploy"** and confirm

#### Step A6: Verify it works

1. Open your app URL in your browser
2. You should see a landing page with two buttons: **Facilitator** and **Team**
3. Click **Facilitator**, select any scenario (e.g. "The Transformation Bet"), and click **Create Session**
4. A 5-character session code appears (e.g. `KR4NP`)
5. **Open a new browser tab** with the same URL, click **Team**, enter the session code and a team name, and click **Join Session**
6. If the team joins successfully and sees the scenario briefing, everything is working

**You are done.** Skip ahead to the "Running a Workshop" section below.

---

### Option B: Deploy Using PowerShell (Terminal Method)

Use this method if you prefer working with commands or if Option A did not work for you.

#### Step B1: Open PowerShell

1. Click the **Start** button (Windows icon, bottom-left corner of your screen)
2. Type **PowerShell**
3. Click **Windows PowerShell** to open it
4. A blue/black window with a blinking cursor appears -- this is where you will type commands

**Tip:** After typing each command below, press **Enter** to run it. Wait for it to finish before typing the next command.

#### Step B2: Install Node.js

Node.js is a tool the app needs to build.

1. Open your browser and go to **https://nodejs.org**
2. Click the big green button that says **"LTS"** (Long Term Support) to download the installer
3. Open the downloaded file (it will be called something like `node-v20.x.x-x64.msi`)
4. Click **Next** through each screen, accepting all defaults
5. On the last screen, click **Install**, then **Finish**
6. **Close PowerShell and reopen it** (this is important -- the new tools will not be available until you do)
7. Verify it worked by typing:
   ```
   node --version
   ```
   You should see something like `v20.18.0`. If you see an error, try closing and reopening PowerShell again.

#### Step B3: Install Git

Git is used to download the code.

1. Open your browser and go to **https://git-scm.com/download/win**
2. The download should start automatically. If it does not, click the link for **"64-bit Git for Windows Setup"**
3. Open the downloaded file and click **Next** through each screen, accepting all defaults
4. Click **Install**, then **Finish**
5. **Close PowerShell and reopen it**
6. Verify it worked by typing:
   ```
   git --version
   ```
   You should see something like `git version 2.43.0.windows.1`.

#### Step B4: Download the code

Type these commands one at a time, pressing **Enter** after each:

```
git clone https://github.com/Kaizen74/AI-Leadership.git
```

Wait for it to finish (you will see "done" messages), then type:

```
cd AI-Leadership\csuite-simulation
```

Then type:

```
npm install
```

This installs all the app's dependencies. It may take 1-2 minutes. You will see a progress bar. Wait until you see the blinking cursor again.

#### Step B5: Test on your computer (optional but recommended)

Before putting the app on the internet, you can test it locally.

1. Create a configuration file by typing:
   ```
   copy .env.example .env.local
   ```
2. Open the file in Notepad:
   ```
   notepad .env.local
   ```
3. Notepad opens with this text:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
4. Replace `your_key_here` with your actual API key (the long string from Anthropic). The line should look like:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxx
   ```
5. Click **File > Save**, then close Notepad
6. Back in PowerShell, type:
   ```
   npm run dev
   ```
7. Wait until you see a message that says `Ready` or `started server on 0.0.0.0:3000`
8. Open your browser and go to **http://localhost:3000**
9. You should see the landing page with "Facilitator" and "Team" buttons
10. To stop the test server, go back to PowerShell and press **Ctrl+C**, then type **Y** and press Enter

#### Step B6: Deploy to the internet

1. Install the Vercel command-line tool:
   ```
   npm install -g vercel
   ```
2. Log in to Vercel (this opens a browser window where you confirm):
   ```
   vercel login
   ```
3. Deploy the app:
   ```
   vercel --prod
   ```
4. Vercel will ask you some questions. Answer them like this:
   - **Set up and deploy?** Type `Y` and press Enter
   - **Which scope?** Press Enter to select your account
   - **Link to existing project?** Type `N` and press Enter
   - **Project name?** Press Enter to accept the default
   - **Which directory is the code in?** Type `./` and press Enter
   - **Want to modify these settings?** Type `N` and press Enter
5. Wait for the deployment to finish (1-2 minutes)
6. Vercel prints a URL like `https://csuite-simulation.vercel.app` -- **this is your app's address. Save it.**

#### Step B7: Add your API key to the live app

The API key you used for local testing needs to be added to the internet deployment separately.

1. Type this command:
   ```
   vercel env add ANTHROPIC_API_KEY production
   ```
2. When prompted, paste your Anthropic API key and press Enter
3. Redeploy so the key takes effect:
   ```
   vercel --prod
   ```

#### Step B8: Add a Redis database (required for sessions to work)

The app needs a small database so that when a facilitator creates a session, teams can find it. This is free.

1. Open your browser and go to **https://vercel.com/dashboard**
2. Click on your **project name**
3. Click the **"Storage"** tab at the top
4. Click **"Create Database"** (or **"Connect Store"**)
5. Choose **"Upstash Redis"** (or **"Redis"** / **"KV"**)
6. Select the **Free** plan, give it a name (e.g. `csuite-sessions`), and click **Create**
7. Connect it to your project when prompted
8. Redeploy:
   ```
   vercel --prod
   ```

#### Step B9: Verify

1. Open your app URL in a browser
2. Click **Facilitator**, select a scenario, and create a session
3. Open a **second browser tab** with the same URL, click **Team**, enter the session code and a team name
4. If the team joins successfully, everything is working

---

## Running a Workshop

### Before the session

1. Check your Anthropic credit balance at **https://console.anthropic.com** under "Plans & Billing"
2. Test the app URL on the device you will use to facilitate
3. Have **1 laptop per team** (3-5 people per team is ideal)

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

Monitor your usage at **https://console.anthropic.com** under "Usage".

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "ANTHROPIC_API_KEY is not configured" | Your API key is missing. **Option A users:** Go to your Vercel project dashboard > Settings > Environment Variables, add `ANTHROPIC_API_KEY` with your key, and click Redeploy from the Deployments tab. **Option B users:** Run `vercel env add ANTHROPIC_API_KEY production` then `vercel --prod`. |
| API errors or no response | Check your Anthropic credit balance at https://console.anthropic.com. Add more credits if the balance is $0. |
| Teams cannot join session | Make sure all devices are connected to the internet. The session code is case-sensitive -- type it exactly as shown on the facilitator's screen. |
| "Session not found" when teams try to join | The Redis database is not connected. Go to your Vercel project dashboard > **Storage** tab > create an **Upstash Redis** database (free) > connect it to your project > redeploy. See Step A5 or B8 above. **To verify:** visit `https://your-app-url/api/session?action=health` — it should show `"mode":"redis"` and `"connected":true`. If it shows `"mode":"memory"`, Redis is not connected. |
| Slow first response | Normal. The first message loads the full scenario context. Subsequent responses are faster. |
| Dashboard not updating | Refresh the browser page. The dashboard polls for updates every 5 seconds. |
| `node --version` shows an error in PowerShell | Close and reopen PowerShell. If it still does not work, restart your PC and try again. |
| `npm` is not recognised | Node.js was not installed correctly. Re-download from https://nodejs.org and run the installer again. Make sure to restart PowerShell after installing. |
| Vercel deployment fails with build error | Make sure you set the **Root Directory** to `csuite-simulation` in the Vercel project settings. |

---

## Updating the App After Changes

### If you used Option A (Vercel website):

1. Go to your project at **https://vercel.com/dashboard**
2. Click your project name
3. Click the **Deployments** tab
4. Click the three dots (**...**) next to the latest deployment
5. Click **Redeploy**

### If you used Option B (PowerShell):

Open PowerShell and type:
```
cd AI-Leadership\csuite-simulation
vercel --prod
```

---

## Project Structure

All application code lives inside the `csuite-simulation/` directory:

```
csuite-simulation/
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
- **State:** Upstash Redis for persistent sessions (falls back to in-memory for local dev)
- **Hosting:** Vercel (free tier)
