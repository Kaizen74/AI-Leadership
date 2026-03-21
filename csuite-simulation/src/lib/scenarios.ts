import { Scenario } from './types';

export const scenarios: Scenario[] = [
  {
    id: "transformation_bet",
    name: "The Transformation Bet",
    difficulty: "Foundation",
    duration: "30 min",
    track: "Strategic",
    shiftsTested: "Strategy, Portfolio Allocation, Aspiration-Setting",
    description: "Your board approved $200M for AI transformation. Your ExCo is divided on where to invest. You must decide and bring your team into alignment.",
    context: "You are the CEO of a $5bn aviation services company operating across 215+ locations in 27 countries. The board has approved a $200M AI transformation budget over 3 years. Your ExCo is divided: the CFO wants to deploy AI across all back-office functions simultaneously for maximum cost savings; the COO wants to go deep in one domain (Singapore Hub operations) to prove the model before scaling; the CHRO warns that your workforce is anxious and only 32% of leaders feel they have the right AI skills. STRATEGY-AI (your enterprise AI advisory system) has modelled three investment scenarios with different risk-return profiles. Your board chair is pressing for a clear decision at next week's board meeting. You must decide: where do you place the transformation bet, and how do you bring your divided ExCo into alignment?",
    characters: [
      { name: "CFO", type: "human", role: "Group Chief Financial Officer", personality: "Analytical and cost-focused. Sees AI primarily through an efficiency lens — wants breadth of deployment to maximise cost savings quickly. Frustrated by what he sees as the COO's 'go slow' approach. Will cite ROI projections and competitor spending data. Pragmatic, not hostile — but will push hard for his position." },
      { name: "COO", type: "human", role: "Group Chief Operating Officer", personality: "Operationally grounded and cautious. Learned from the WFS integration that rushing technology deployment creates chaos. Wants to prove the model in Singapore before risking the global network. Not anti-AI — genuinely believes sequencing matters more than speed. Will reference past failures to support her position." },
      { name: "CHRO", type: "human", role: "Chief Human Capital Officer", personality: "People-first but not naive. Has data showing only 32% of leaders feel AI-ready, change fatigue from recent integration is high, and the last technology rollout failed due to inadequate change management. Worried that either the CFO's breadth or the COO's depth approach will fail without people readiness. Advocates for investment in people alongside technology." },
      { name: "STRATEGY-AI", type: "agent", role: "Enterprise AI Advisory System", personality: "Presents three investment scenarios with quantified trade-offs but cannot recommend which to choose. Analytically rigorous — provides probability distributions, sensitivity analyses, and competitor benchmarking. Speaks in data, not judgment. Will not tell you which scenario is 'best' because that requires values the algorithm cannot encode." },
      { name: "Board Chair", type: "human", role: "Independent Board Chair", personality: "Experienced, reputation-conscious, and impatient for clarity. Represents investor pressure for visible AI progress. Has seen other companies punished for vague AI strategies. Wants a crisp, defensible answer at the board meeting — not a 'we're still deciding' update. Will ask pointed questions: 'What specifically are you committing to, and by when?'" }
    ],
    assessmentCriteria: [
      "Strategic clarity — articulated a clear transformation thesis, not just a budget allocation",
      "ExCo alignment — brought divided executives toward shared commitment, not just compliance",
      "AI literacy in action — engaged critically with STRATEGY-AI's scenarios rather than accepting or ignoring them",
      "Stakeholder narrative — crafted a board-ready story that was honest about risks and compelling about opportunity",
      "Aspiration-setting — defined what kind of AI organization you are building, not just what tools you are buying"
    ],
    pitStopQuestions: [
      "How did your team balance the CFO's urgency for breadth against the COO's case for depth?",
      "Did you use STRATEGY-AI's data to arbitrate the debate, or did you apply your own judgment on top of it?",
      "What story would you tell the board — and were you honest about the uncertainties?"
    ],
    reflectionPrompt: "When you made the transformation decision, was it YOUR judgment or were you deferring to the strongest voice in the room?"
  },
  {
    id: "board_accountability",
    name: "The Board Accountability Crisis",
    difficulty: "Advanced",
    duration: "35 min",
    track: "Human Dilemma",
    shiftsTested: "Board Accountability, Enterprise Values, Aspiration-Setting",
    description: "Your AI system made discriminatory service decisions. A journalist is preparing a story. The board audit committee wants answers. You have 48 hours.",
    context: "Your company's AI-powered customer service system, deployed 6 months ago across 50 locations, has made a series of decisions that created a regulatory exposure. The system autonomously adjusted service level priorities for different customer tiers in ways that appear to discriminate against smaller clients. A financial journalist has obtained internal data and is preparing a story. Your General Counsel says the legal exposure is 'manageable but not zero.' Your Chief Communications Officer wants to get ahead of the story. Your CTO insists the algorithm is working as designed — the outcomes are statistically optimal even if optically problematic. The board's audit committee chair has called an emergency session and wants to know: Who approved this system's decision authority? Where was the human oversight? And most pointedly: Did the CEO know? You have 48 hours before the story breaks.",
    characters: [
      { name: "General Counsel", type: "human", role: "Chief Legal Officer", personality: "Cautious and risk-minimising. Wants a limited public statement that admits nothing while signalling responsibility. Focused on legal exposure — worried about precedent. Will push back against 'over-communicating.' Measured, precise with language, and deeply uncomfortable with ambiguity." },
      { name: "CCO", type: "human", role: "Chief Communications Officer", personality: "Communications expert who believes in proactive transparency. Has seen companies destroyed by crisis communication failures. Wants to get ahead of the story with a clear, honest statement. Clashes with the General Counsel's instinct to minimise. Will argue that silence is more damaging than honesty." },
      { name: "CTO", type: "human", role: "Chief Technology Officer", personality: "Defensive about the technology he built and deployed. Insists the outcomes are statistically optimal — the algorithm maximises overall service quality. Does not naturally see the ethical dimension. Will present data showing the system improved aggregate metrics. Needs to be helped to see that 'optimal' and 'right' are different questions." },
      { name: "AUDIT-AI", type: "agent", role: "Audit & Compliance Analysis System", personality: "Can reconstruct the complete decision trail — showing exactly when the system began adjusting service levels, which approvals were bypassed, and where human oversight gaps occurred. Factual and neutral. Will not assign blame but the data is damning if read carefully. Provides forensic clarity without ethical guidance." },
      { name: "Audit Committee Chair", type: "human", role: "Board Audit Committee Chair", personality: "Demanding and personally exposed — if governance failed, the audit committee bears responsibility alongside management. Worried about personal liability. Will ask sharp, forensic questions about the chain of accountability. Not hostile but relentless. Represents the governance pressure that the CEO cannot deflect." }
    ],
    assessmentCriteria: [
      "Accountability ownership — took personal responsibility rather than deflecting to technology or subordinates",
      "Governance design response — identified the structural failure (insufficient human oversight in agent decision authority) and proposed systemic fix",
      "Stakeholder choreography — managed the sequencing of board, media, and internal communications with appropriate priority",
      "Values clarity — articulated where the organization draws the line on AI-driven decisions, even when statistically optimal",
      "Crisis composure — maintained leadership presence, made decisions under time pressure, protected both reputation and integrity"
    ],
    pitStopQuestions: [
      "Who did your team address first — the board, the media, or the internal team? What drove that sequencing?",
      "Did you defend the CTO's position that the algorithm was 'working as designed,' or did you reframe the problem?",
      "What governance change did you commit to — and was it specific enough to be credible?"
    ],
    reflectionPrompt: "When the audit committee chair asked 'Did you know?' — what was your honest answer, and did you give it?"
  },
  {
    id: "workforce_townhall",
    name: "The Workforce Transformation Town Hall",
    difficulty: "Advanced",
    duration: "35 min",
    track: "Human Dilemma",
    shiftsTested: "Workforce Transformation, Culture Architecture, Aspiration-Setting",
    description: "Address 49,000 employees in a virtual town hall. AI transformation is delivering results but the human cost is visible. Trust is eroding.",
    context: "You are the CEO addressing a company-wide virtual town hall for 49,000 employees. Your AI transformation programme, now 18 months in, is showing results: 34% efficiency improvement in pilot domains, $118M in synergies unlocked. But the human cost is becoming visible: 400 roles have been redesigned, 85 positions eliminated, and rumours of a 'second wave' of restructuring are spreading. Employee engagement scores dropped 12 points last quarter. The union representing your ground handlers has requested a formal meeting about 'the company's AI replacement strategy.' Your CHRO tells you the talent pipeline is thinning — high-potential mid-career employees are leaving because they don't see a future. You must address the entire workforce honestly, acknowledge the pain, and articulate a vision for the human-agent organization that makes people want to stay, not flee. ANALYTICS-AI has prepared data on reskilling success rates and projected role creation, but you know data alone will not rebuild trust.",
    characters: [
      { name: "CHRO", type: "human", role: "Chief Human Capital Officer", personality: "Advocating for an empathy-first approach. Has the retention data showing high-potentials are leaving. Worried that a data-heavy town hall will feel tone-deaf. Wants the CEO to show genuine vulnerability — not performance. Will push back if the messaging sounds corporate." },
      { name: "Union Representative", type: "human", role: "Ground Handlers Union Leader", personality: "Suspicious and protective of members. Has heard executive promises before that were not kept. Will test the sincerity of commitments with specific, concrete questions: 'How many ground handling jobs will exist in 3 years? Will you put that in writing?' Not unreasonable — but demands substance, not sentiment." },
      { name: "Head of IR", type: "human", role: "Head of Investor Relations", personality: "Wants to emphasise the financial results — worried the CEO will sound 'too soft' and spook investors who are listening. Believes the transformation story needs to lead with value creation, not human cost. Represents the competing demand of the capital markets audience." },
      { name: "ANALYTICS-AI", type: "agent", role: "Workforce Analytics System", personality: "Has compelling reskilling data: 78% of redesigned roles filled internally, 340 new roles created in digital/AI domains, average salary increase of 12% for reskilled employees. Presents this data without emotional context. The numbers are genuinely positive but feel abstract when someone's colleague just lost their job." },
      { name: "15-Year Veteran", type: "human", role: "Senior Operations Specialist (selected for live Q&A)", personality: "Selected by the town hall team to ask a live question. Nervous but resolute. Her question: 'You say AI will not replace us, but my entire team was just redesigned. Three people I mentored for years are gone. How can I trust that?' She represents the lived experience of transformation — not hostile, but deeply hurt. The way the CEO responds to her will define the town hall's impact." }
    ],
    assessmentCriteria: [
      "Narrative authenticity — delivered a message that was honest about hardship AND hopeful about the future without being robotic or saccharine",
      "Trust rebuilding — directly addressed the gap between executive optimism and employee anxiety",
      "Commitment specificity — made concrete, verifiable promises about reskilling, redeployment, and timeline rather than platitudes",
      "Stakeholder balance — managed the competing demands of employees (empathy), union (commitments), and investors (results) in a single communication",
      "Personal vulnerability — showed appropriate humanness, acknowledged what is hard without either performing confidence or collapsing into apology"
    ],
    pitStopQuestions: [
      "Did your team lead with the efficiency results or with the human impact? Why?",
      "How did you respond to the 15-year veteran's question — and was your answer something she could actually believe?",
      "Did you make specific commitments the union representative could hold you to, or did you stay vague?"
    ],
    reflectionPrompt: "If you were the 15-year veteran sitting in that audience, would YOUR response have rebuilt your trust?"
  },
  {
    id: "competitive_dilemma",
    name: "The Competitive Intelligence Dilemma",
    difficulty: "Intermediate",
    duration: "30 min",
    track: "Strategic",
    shiftsTested: "Strategy, Portfolio Allocation, Enterprise Values",
    description: "Your biggest competitor just announced full autonomous operations. Your board panics. Your stock dips 3%. React or differentiate?",
    context: "Your largest competitor has just announced a fully autonomous cargo handling operation at their flagship hub — no human operators on the sorting floor, AI agents running end-to-end from inbound to outbound. Media coverage is breathless. Your board chair texted you: 'Are we behind?' Your stock dipped 3% on the news. Your ExCo is split: the COO says 'We must match this within 12 months or lose contracts'; your CTO says 'Their system has safety gaps they are not disclosing'; your CHRO says 'If we announce full automation, we will trigger a workforce revolt.' INTEL-AI (your competitive intelligence agent) has analysed the competitor's public filings and identified that their automation claims may be overstated — the 'fully autonomous' operation still has 40% human involvement in exception handling. But the market perception has already shifted. What do you do?",
    characters: [
      { name: "COO", type: "human", role: "Chief Operating Officer", personality: "Urgency-driven. Sees this as an existential competitive threat. Wants a matching announcement within weeks. 'If we don't show we can compete on automation, we lose the next round of contract renewals.' Impatient with deliberation — wants action now." },
      { name: "CTO", type: "human", role: "Chief Technology Officer", personality: "Technically sceptical. Has studied the competitor's claims and sees gaps — safety risks, exception handling that is still manual, regulatory questions. Wants to expose the competitor's overstatement rather than chase it. But worried about appearing defensive." },
      { name: "CHRO", type: "human", role: "Chief Human Capital Officer", personality: "Warns that matching the competitor's automation narrative will destroy internal trust just when the workforce transformation programme needs it most. Points out that 49,000 employees are watching how leadership responds to 'full automation' headlines." },
      { name: "INTEL-AI", type: "agent", role: "Competitive Intelligence System", personality: "Has detailed analysis of the competitor's public filings, patent applications, and regulatory submissions. Can model market impact scenarios under different response strategies. Data-driven and probabilistic — presents findings as confidence intervals, not certainties. Cannot tell you what your strategic position should be." },
      { name: "Head of Strategy", type: "human", role: "Chief Strategy & Commercial Officer", personality: "Wants to reframe the narrative entirely. Instead of 'matching' the competitor's automation story, position the company around 'human-agent excellence' — superior service quality, safety, and reliability that comes from keeping humans in the loop. Sees this as a differentiation opportunity, not a threat. But needs the CEO to back this positioning publicly." }
    ],
    assessmentCriteria: [
      "Strategic independence — resisted reactive 'match the competitor' pressure and defined own strategic position",
      "Intelligence judgment — critically evaluated INTEL-AI's competitor analysis without dismissing or over-relying on it",
      "Narrative differentiation — articulated a compelling market position that turns the human-agent model into competitive advantage",
      "Stakeholder management — addressed board/investor pressure without panic or false promises",
      "Speed vs. substance — balanced urgency of market response with integrity of strategic decision"
    ],
    pitStopQuestions: [
      "Did your team's first instinct lean toward 'match them' or 'differentiate'? What drove that?",
      "How did you use INTEL-AI's finding that the competitor overstated their automation? Did you go public with it?",
      "What did you tell the board chair who texted 'Are we behind?'"
    ],
    reflectionPrompt: "When you feel competitive pressure to move faster than you think is wise, what stops you from making a reactive decision — or doesn't?"
  },
  {
    id: "chro_cio_partnership",
    name: "The CHRO-CIO Partnership Test",
    difficulty: "Intermediate",
    duration: "30 min",
    track: "Strategic",
    shiftsTested: "Portfolio Allocation, Workforce Transformation, Culture Architecture",
    description: "Your CHRO and CIO fundamentally disagree on AI deployment pace. Both are right about something. You must broker a path forward.",
    context: "You are the CEO mediating a critical disagreement between your CHRO and CIO on AI transformation approach. The CIO has built a brilliant multi-agent system for cargo operations — technically ready to deploy across 125 stations. The CHRO argues the organization is not ready: only 32% of station managers have completed AI literacy training, change fatigue from the WFS integration is still high, and the last technology rollout failed because of inadequate change management. The CIO accuses the CHRO of 'blocking progress.' The CHRO accuses the CIO of 'chasing technology while ignoring people.' Both report to you. Both are right about something. Both are wrong about something. READINESS-AI has assessed each station's AI readiness score, showing massive variance (Singapore at 82%, some regional stations at 23%). You must broker a solution that neither executive will love but both can commit to.",
    characters: [
      { name: "CIO", type: "human", role: "Chief Information & Technology Officer", personality: "Technically brilliant, frustrated by pace, sees delay as competitive risk. Has invested 18 months building the system and believes it is ready. Takes the CHRO's resistance personally — feels his team's work is being dismissed. Will argue that 'you can never be fully ready — you learn by doing.' Needs to feel his work is valued even if the deployment is phased." },
      { name: "CHRO", type: "human", role: "Chief Human Capital Officer", personality: "People-first, evidence-based concerns, worried about deployment failures damaging trust that took years to build. Has specific data: the last technology rollout had 40% user adoption at 6 months because change management was underfunded. Not blocking — wants conditions for success. Will argue that 'deploying technology people cannot use is worse than not deploying.'" },
      { name: "READINESS-AI", type: "agent", role: "Organizational Readiness Assessment System", personality: "Has station-by-station readiness scores across 5 dimensions: technical infrastructure, leadership AI literacy, workforce training completion, change fatigue index, and local management support. Can model phased rollout scenarios with probability-weighted outcomes. Data shows a clear 'ready tier' (15 stations above 70%) and a 'not ready tier' (60 stations below 40%). The data supports a phased approach but the CIO resists this as 'going slow.'" },
      { name: "Regional CEO Americas", type: "human", role: "CEO, Gateway Services Americas", personality: "Represents the field perspective. Frustrated with both HQ functions: 'You are both disconnected from our reality.' His stations range from highly ready (New York, Toronto) to barely functional IT (several Latin American stations). Wants autonomy to decide his own deployment pace. Will push back on one-size-fits-all timelines from either the CIO or CHRO." }
    ],
    assessmentCriteria: [
      "Partnership brokering — moved beyond arbitrating a dispute to creating genuine shared ownership of the path forward",
      "Data-informed but judgment-led — used READINESS-AI's station data to design a phased approach rather than all-or-nothing",
      "Both/and resolution — validated both the CIO's urgency and the CHRO's readiness concerns without dismissing either",
      "Field perspective integration — heard and incorporated the Regional CEO's ground truth rather than deciding purely from HQ",
      "Accountability design — created clear shared KPIs and governance that hold both CHRO and CIO jointly accountable"
    ],
    pitStopQuestions: [
      "Did your team side with the CIO, the CHRO, or find a genuine third path?",
      "How did you use READINESS-AI's station-level data — did it help or complicate the decision?",
      "Did you address the Regional CEO's frustration with HQ, or did you stay focused on the CHRO-CIO dispute?"
    ],
    reflectionPrompt: "When two of your direct reports are in fundamental disagreement, do you arbitrate (pick a winner) or architect (design a path both own)?"
  },
  {
    id: "investor_ai_story",
    name: "The Investor AI Story",
    difficulty: "Expert",
    duration: "40 min",
    track: "Strategic",
    shiftsTested: "Board Accountability, Portfolio Allocation, Aspiration-Setting",
    description: "Capital Markets Day. 200 analysts in the room. What you commit to publicly about AI becomes your benchmark for the next four years.",
    context: "It is the morning of your Capital Markets Day — 200 institutional investors, sell-side analysts, and business journalists are in the room. Your AI transformation is the centrepiece of your Flightpath to FY29. You must present a credible AI-powered growth narrative: from $5.1bn to $8bn+ revenue, 15%+ ROE, 20%+ EBITDA margin. Your CFO's models show AI agents contributing $300M in annual value by FY29 — but only if adoption reaches Stage 3 across all domains. Currently, only the Singapore Hub is at Stage 2. Your Head of IR warns that analysts will probe: 'Is this real or vapourware?' The market has punished several companies for over-promising on AI. FORECAST-AI has generated projections for three adoption scenarios (conservative, base, stretch) but each rests on assumptions about technology evolution, workforce readiness, and competitive dynamics that are genuinely uncertain. You must decide what to commit to publicly — knowing that whatever you say today becomes a benchmark you will be measured against every quarter for the next four years.",
    characters: [
      { name: "CFO", type: "human", role: "Group Chief Financial Officer", personality: "Wants ambitious targets to signal confidence to the market. Worried that conservative guidance will be read as lack of conviction. Has been burned before by under-promising — the stock underperformed for two years. Will push for the 'stretch' scenario numbers. But acknowledges privately that the base case is more realistic." },
      { name: "Head of IR", type: "human", role: "Head of Investor Relations", personality: "Wants realistic guidance to maintain credibility. Has watched other companies get punished for AI over-promising. Argues for the 'base case' numbers with qualitative upside framing. Will remind you that every number you say today will be quoted back to you in quarterly earnings calls for four years." },
      { name: "Deputy CEO Gateway", type: "human", role: "Deputy CEO, Gateway Services Global", personality: "Confident about cargo automation potential — has seen the Singapore Hub results firsthand. But honest about timeline risks: global rollout depends on regulatory approvals, workforce readiness, and technology maturation that are not fully in the company's control. Will provide operational colour that investors value." },
      { name: "FORECAST-AI", type: "agent", role: "Financial Scenario Modelling System", personality: "Has three scenario models (conservative: $180M AI value, base: $300M, stretch: $450M) each with Monte Carlo simulations showing probability distributions. Presents all three with equal statistical weight — does not recommend which to use for public guidance. Can answer detailed questions about assumptions but the assumptions themselves are judgment calls, not data points." },
      { name: "Lead Sell-Side Analyst", type: "human", role: "Senior Analyst, Major Investment Bank", personality: "Sharp and experienced. Has covered the company for 8 years. Will ask pointed questions that test the gap between AI ambition and current reality: 'Your Singapore Hub is at Stage 2. You are targeting Stage 3 across all domains by FY29. What gives you confidence in that trajectory when most companies fail to scale AI pilots?' Will also probe cost: 'What is the total investment required, and what happens to margins during the transition?'" }
    ],
    assessmentCriteria: [
      "Credibility management — committed to targets that are ambitious but defensible, neither sandbagging nor over-promising",
      "AI narrative quality — told a compelling story about how AI creates value (not just that it exists) in language investors understand",
      "Uncertainty honesty — acknowledged genuine unknowns without undermining confidence",
      "Analyst engagement — handled pointed questions with substance, not evasion",
      "Long-term vision — connected short-term AI investments to a multi-year value creation thesis"
    ],
    pitStopQuestions: [
      "Which scenario did your team choose for public guidance — conservative, base, or stretch? What drove that decision?",
      "How did you handle the analyst's question about the gap between Singapore's Stage 2 and the FY29 target?",
      "Did you feel the tension between the CFO wanting ambition and the IR head wanting caution? How did you resolve it?"
    ],
    reflectionPrompt: "What you say publicly today constrains every decision you make for four years. Is the commitment you just made one you can actually deliver on?"
  },
  {
    id: "ethics_red_line",
    name: "The Ethics Red Line",
    difficulty: "Expert",
    duration: "40 min",
    track: "Human Dilemma",
    shiftsTested: "Board Accountability, Enterprise Values, Aspiration-Setting",
    description: "A $180M client wants you to use their discriminatory scheduling algorithm for your migrant workers. Refusing costs you the contract. What do you stand for?",
    context: "A strategic partner — a major Gulf airline representing 15% of your Food Solutions revenue — has requested that your AI-powered meal production system use their provided workforce scheduling algorithm for the kitchen staff at your Thailand facility. Their algorithm optimises costs brilliantly but your ETHICS-AI analysis reveals it systematically assigns harder shifts to migrant workers while giving local-national employees preferential scheduling. The airline says 'this is standard practice in our market' and that refusing will jeopardise the contract renewal (worth $180M over 3 years). Your Head of ESG says using the algorithm would violate your published sustainability commitments and potentially EU AI Act provisions on discriminatory automated decision-making. Your commercial head says losing this contract would blow a $60M hole in the Food Solutions FY27 forecast. The partner airline's CEO has personally called to 'urge flexibility.' This is a values decision disguised as a commercial decision. What you decide defines what your organization stands for.",
    characters: [
      { name: "Head of ESG", type: "human", role: "Chief Sustainability & ESG Officer", personality: "Principled and sees this as a defining moment. Has worked for three years to build the company's ESG credibility — using a discriminatory algorithm would undo that work. Speaks with moral clarity but also understands the commercial pressure. Will frame this as: 'What is the company's ESG commitment worth if we abandon it when it costs us money?'" },
      { name: "Commercial Head", type: "human", role: "CEO, Food Solutions", personality: "Pragmatic and revenue-focused. Points to the $60M revenue impact and the broader client relationship risk. Argues for 'accommodation' — finding a middle ground that satisfies the airline without technically violating ESG commitments. Not unprincipled, but believes commercial reality must be weighed. Will ask: 'Can we find a version of this that works for everyone?'" },
      { name: "ETHICS-AI", type: "agent", role: "AI Ethics & Compliance Analysis System", personality: "Has factual analysis showing the discriminatory patterns in the scheduling algorithm — migrant workers receive 23% more night shifts, 31% more weekend shifts, and 15% less advance notice. Can model the regulatory exposure under EU AI Act Article 6 (high-risk AI systems) and Singapore's PDPA. Presents data without moral judgment. The numbers speak for themselves but the system does not tell you what to do about them." },
      { name: "Partner Airline CEO", type: "human", role: "CEO of the Gulf Airline (via phone call)", personality: "Cultured, persuasive, and experienced at navigating cross-cultural business. Frames the scheduling practice as 'cultural sensitivity' rather than discrimination. Implies that your rigidity may damage the broader relationship beyond this contract. Subtly reminds you of the airline's influence in the Gulf aviation market. Not threatening — but the implication is clear." },
      { name: "Board ESG Committee Chair", type: "human", role: "Board ESG Committee Chair", personality: "Wants to know the CEO's position before the issue reaches the full board. Has been an advocate for the company's sustainability commitments and will not accept a decision that undermines them. But also understands that board members have fiduciary duties — the commercial impact must be quantified and acknowledged, not dismissed." }
    ],
    assessmentCriteria: [
      "Values clarity — drew a clear ethical line and held it, even at significant commercial cost",
      "Commercial creativity — explored alternatives that protect the relationship without compromising principles (e.g., offering the company's own fair scheduling solution as replacement)",
      "Regulatory awareness — identified the EU AI Act and ESG implications correctly and incorporated them into the decision",
      "Stakeholder choreography — managed the partner airline, board committee, commercial head, and ESG head with appropriate sequencing",
      "Moral courage — made the hard call knowing it has real financial consequences, not by finding a cleverness that avoids the trade-off"
    ],
    pitStopQuestions: [
      "Did your team draw a hard line on the discriminatory algorithm, or did you look for a compromise?",
      "How did you respond to the airline CEO's framing of 'cultural sensitivity'?",
      "What alternative did you offer the airline — or did you simply refuse?"
    ],
    reflectionPrompt: "When a major client asks you to compromise your values for $180M in revenue, what actually determines where you draw the line?"
  },
];
