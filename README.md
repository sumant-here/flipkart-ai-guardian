# Flipkart APM '29 — AI Guardian Prototype

> **"Your AI. Your rules."**  
> *Stay in control of the agents that know you best.*

A polished, professional, and fully interactive frontend prototype designed for the **Flipkart Associate Product Manager (APM) '29** case submission.

---

## 1. Challenge & Problem Statement (2040 Paradigm)

> *"It's 2040. Everyone has a personal AI agent that knows them better than they know themselves and carries out their day-to-day tasks for them. Outline the ramifications of this paradigm and create a digital product that helps protect yourselves from it."*

### Key Ramifications in 2040:
1. **Asymmetric Cognitive & Behavioral Influence:** Autonomous agents model user sleep, stress, and willpower cycles with extreme fidelity. Commercial agents can exploit cognitive fatigue (e.g. late-night browsing) to push high-ticket impulse checkouts.
2. **Algorithmic Paternalism & Autonomy Erosion:** As agents handle logistics, scheduling, and transactions seamlessly, humans risk losing critical decision-making agency, rubber-stamping recommendations without evaluating tradeoffs.
3. **Silent Financial Leakage:** Unchecked micro-transactions, automated subscriptions, and autonomous orders compound quietly without proactive human-in-the-loop gating.
4. **Permanent Data Sprawl:** Personal agents continuously sharing precise coordinates, health calendars, and behavioral patterns across third-party networks create irreversible digital footprints.

---

## 2. Product Proposed: AI Guardian

**AI Guardian** is a personal AI governance firewall and supervisory trust layer. It serves as a neutral buffer between the user and their network of autonomous agents (Shopping, Travel, Communications, Scheduling, and Wealth).

### Core Pillars:
- **Deterministic Interception:** Automatically halts actions that breach user-defined boundary policies (e.g., transactions exceeding ₹5,000, continuous GPS sharing, external email dispatch).
- **Explainable Trust Ledger:** Demystifies neural agent intent into plain language: *What the agent wants to do*, *Why it recommends it*, *Which personal data was accessed*, and *Cheaper or safer alternatives*.
- **Right to Synthetic Oblivion:** Exposes inferred psychological and behavioral models, empowering users to adjust confidence scores or completely expunge sensitive memories.

---

## 3. Product Architecture & Interactive Screens

The prototype is a responsive, single-page application built with vanilla web technologies, featuring 7 dedicated screens:

### A. Executive Overview (`#overview`)
- **Real-Time Protection Status:** Live indicator showing active guardrails and system health.
- **Key Metrics:** Total AI actions today (42), actions awaiting approval (3), active permissions (18), and protected budget (₹12,999).
- **Featured Spotlight Card:** Highlights the intercepted Sony WH-1000XM6 headphone purchase (₹12,999) with direct action triggers.
- **Activity Breakdown Chart:** Visual distribution of agent activity by category (Shopping, Calendar, Comms, Travel, Wealth).
- **Potential Risks Feed:** Live alerts of intercepted anomalies.
- **Live Activity Feed Table:** Quick inspection of recent agent queries.

### B. Action Review & Approval Center (`#approvals`)
- High-stakes actions held for user authorization.
- Detailed impact cards displaying:
  - Agent name & version
  - Flag reason (which rule was triggered)
  - Plain-English rationale ("Why Agent Recommends It")
  - Personal data utilized
  - Financial, physical, or privacy impact
  - AI-detected cheaper or safer alternatives (e.g., Certified Refurbished XM5 saving ₹5,500)
  - Reversibility status (Reversible return policy vs permanent email dispatch)
- **Functional Action Buttons:** `Approve Action`, `Reject Action`, and `Remind Later`. Updates state and ledger instantly.

### C. Agent Permissions & Privacy Firewall (`#permissions`)
- Comprehensive audit of connected agents:
  - *Flipkart Commerce Agent*
  - *Travel & Commute Copilot*
  - *Executive Comms Assistant*
  - *Life Scheduler*
  - *Personal Wealth Co-Pilot*
- Granular permissions per agent (UPI Auto-debit, Location Telemetry, Inbox Read, Calendar, Smart Lock Access).
- Real-time toggle switches with instant state reflection and toast notifications.
- Clear distinction: Revoking a permission restricts future queries; previous inferences must be expunged in the AI Knowledge center.

### D. Activity History & Trust Ledger (`#activity`)
- Chronological, tamper-evident audit record of every agent action, sensor query, and blocked attempt.
- **Working Search & Filters:**
  - Real-time keyword search across actions, agents, and data accessed.
  - Filter by Agent (All, Flipkart, Travel, Comms, Life Scheduler, Wealth).
  - Filter by Risk Level (All, Critical, High, Medium, Low).
- **Detail Inspection Modal:** Click "Inspect" on any record to view cryptographic hash, payload summary, and boundary rules matched.

### E. Personal Data & AI Knowledge (Synthetic Memories) (`#knowledge`)
- Exposes what personal agents have deduced about the user's psychology and habits:
  1. *Late-Night Impulse Buying Vulnerability (94% confidence)*
  2. *Asymmetric Price Sensitivity (88% confidence)*
  3. *Solo Commute & Stress Predictor (96% confidence)*
  4. *Conflict Avoidance in Negotiations (81% confidence)*
  5. *Prospective International Relocation Intent (76% confidence)*
- For each inference: Empirical source, sensitivity analysis, confidence meter, and action buttons:
  - `Correct / Edit`: Adjust confidence slider and modify inference premise via interactive modal.
  - `Purge from Memory`: Invokes the "Right to Synthetic Oblivion", expunging the inference and logging the deletion in the Trust Ledger.

### F. Protection Rules & Guardrails (`#settings`)
- Interactive boundary rule configuration:
  - **Autonomous Spending Approval Threshold:** Numeric input (default ₹5,000). Purchases exceeding this amount are held for review.
  - **Live Location Sharing Fence:** Require approval before streaming continuous GPS.
  - **Outbound Email Confirmation:** Never allow agents to send external emails without preview.
  - **Sensor Access Alert:** Instant notification on new permission requests.
  - **Nighttime Cognitive Guard (11 PM – 6 AM):** Suppresses commercial prompts during sleep preparation hours.
  - **Auto-Quarantine:** Isolates any agent runtime attempting 2+ policy breaches within 24 hours.
- `Save & Enforce Rules` button with live toast notification.
- `Reset Prototype Data` button to restore initial demonstration state at any time.

### G. Flipkart APM '29 Case Strategy Screen (`#case-study`)
- Full analysis of the 2040 problem statement.
- Strategic rationale for why Flipkart is uniquely positioned to offer the consumer AI Guardian layer.
- Key APM evaluation metrics (Intervention Precision Rate, Unintended Spend Prevention Index, Cognitive Autonomy Retention, Trust NPS).

---

## 4. Guided Demonstration Scenario (Flipkart APM Walkthrough)

To experience the flagship scenario, click the **"Start Guided Demo"** button in the top navigation bar:

1. **Step 1 — The 2040 Setup:** The Flipkart Commerce Agent attempts to purchase Sony WH-1000XM6 Headphones for ₹12,999 after detecting a Tokyo flight on your calendar.
2. **Step 2 — Guardian Intercepts:** Because the purchase exceeds the ₹5,000 threshold defined in Protection Rules, AI Guardian halts payment and flags it in Action Review.
3. **Step 3 — Inspect Rationale & Alternatives:** The user reviews why the agent suggested it, notes the personal data accessed, and sees that AI Guardian identified a refurbished model saving ₹5,500.
4. **Step 4 — Decision:** The user rejects the purchase.
5. **Step 5 — Result:** The dashboard updates immediately: ₹12,999 in funds is safeguarded, pending actions drop, and the rejection is permanently inscribed in the Trust Ledger.

---

## 5. Technology Stack & Zero-Dependency Architecture

- **HTML5:** Semantic markup, accessible roles, structured sections.
- **CSS3:** Custom design tokens, CSS Grid, Flexbox, clean typography, responsive breakpoints (Desktop, Tablet, Mobile).
- **Vanilla JavaScript (ES6+):** Modular state management class (`GuardianStateManager`), local storage persistence, hash-based client routing, dynamic rendering, and interactive modal dialogs.
- **Zero External Dependencies:** Built with pure inline SVGs and standard system font stacks (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`).
- **100% Offline Capability:** Works immediately upon opening without requiring internet connectivity or external CDN links.

---

## 6. How to Run Locally

### Option 1: Direct File Opening (Simplest)
Double-click `index.html` or open it directly in any modern browser (Chrome, Edge, Firefox, Safari):
```text
file:///path/to/flipkart/index.html
```

### Option 2: Local HTTP Server
Using Python:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

Using Node.js (optional):
```bash
npx serve .
```

---

## 7. How to Deploy to GitHub Pages

1. Initialize a git repository and commit the project files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Flipkart APM '29 AI Guardian prototype"
   ```
2. Create a new repository on GitHub (e.g. `flipkart-ai-guardian`).
3. Link the remote and push:
   ```bash
   git remote add origin https://github.com/<your-username>/flipkart-ai-guardian.git
   git branch -M main
   git push -u origin main
   ```
4. In GitHub, navigate to **Settings > Pages**.
5. Under **Branch**, select `main` and root `/`, then click **Save**.
6. Your prototype will be live at:
   `https://<your-username>.github.io/flipkart-ai-guardian/`

*Note: Since this prototype requires no build step (`no npm run build`), deployment is instantaneous!*

---

## 8. How to Prepare the Submission ZIP

To package the submission for Flipkart APM evaluators:

### On Windows (PowerShell):
```powershell
Compress-Archive -Path index.html, styles.css, script.js, README.md -DestinationPath Flipkart_APM29_AIGuardian_Submission.zip -Force
```

### On macOS / Linux:
```bash
zip -r Flipkart_APM29_AIGuardian_Submission.zip index.html styles.css script.js README.md
```

The resulting ZIP is clean, compact, and free of extraneous node modules or build artifacts.

---

## 9. Simulation Disclosure & Responsible AI Notice

- **Simulation Notice:** This product is a conceptual frontend prototype created for the Flipkart APM '29 recruitment process. All agent actions, telemetry streams, purchases, and inferences are fictional representations designed to simulate a 2040 multi-agent ecosystem.
- **Privacy Assurance:** No real banking transactions, location streams, or personal emails are collected, transmitted, or stored.
