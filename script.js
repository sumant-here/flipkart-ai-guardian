/**
 * AI GUARDIAN — Interactive Application Logic & State Engine
 * Flipkart APM '29 Case Submission Prototype
 * 
 * Fully offline, vanilla JavaScript with persistent session state (localStorage).
 */

// =============================================================================
// 1. Initial State & Coherent 2040 Dataset
// =============================================================================

const DEFAULT_STATE = {
  // System Metrics
  todayActionsCount: 42,
  budgetProtected: 12999,
  riskScore: 24, // 0-100 (Low risk)

  // Rules & Guardrails
  rules: {
    spendingLimit: 5000, // INR
    requireLocationApproval: true,
    requireEmailConfirmation: true,
    alertNewPermissions: true,
    nightCognitiveGuard: true,
    autoQuarantine: true
  },

  // Actions Awaiting User Review
  pendingActions: [
    {
      id: "act-101",
      title: "Purchase Sony WH-1000XM6 Headphones",
      agentId: "flipkart-agent",
      agentName: "Flipkart Commerce Agent",
      agentVersion: "v4.2 Pro",
      agentCategory: "Shopping",
      cost: 12999,
      currency: "₹",
      status: "pending", // pending, approved, rejected, deferred
      timestamp: "10 minutes ago",
      flagReason: "Exceeds ₹5,000 autonomous spending limit rule",
      riskLevel: "critical",
      whyRecommended: "Detected 14-hour international flight to Tokyo on user's calendar for next Tuesday. User searched 'airplane ear pressure' 3 days ago.",
      dataUsed: [
        "Flight booking itinerary (Calendar)",
        "Night browsing search queries",
        "Flipkart One-Click Saved UPI Card"
      ],
      impact: "Financial debit of ₹12,999 from primary account; physical parcel dispatched to home residence within 6 hours.",
      alternatives: [
        { label: "Refurbished XM5 Model", price: 7499, note: "Save ₹5,500 (Certified by Flipkart Assured)" },
        { label: "Travel Rental Pack", price: 1200, note: "Rent for 10-day trip duration only" }
      ],
      isReversible: true,
      reversibilityNote: "Eligible for 30-day hassle-free return under Flipkart Buyer Protection."
    },
    {
      id: "act-102",
      title: "Share Continuous Real-time GPS with Autonomous Fleet",
      agentId: "travel-agent",
      agentName: "Travel & Commute Copilot",
      agentVersion: "v2.8",
      agentCategory: "Travel",
      cost: 0,
      currency: "",
      status: "pending",
      timestamp: "28 minutes ago",
      flagReason: "Policy: Real-time background location sharing requires explicit consent",
      riskLevel: "high",
      whyRecommended: "Attempting to pre-dispatch autonomous pod 8 minutes before scheduled office meeting concludes.",
      dataUsed: [
        "High-precision device GPS",
        "Home and private office geofences",
        "Calendar meeting finish time"
      ],
      impact: "External mobility network receives live telemetry stream of your physical coordinates for 45 minutes.",
      alternatives: [
        { label: "One-time pickup coordinate", price: 0, note: "Share only static pickup bay pin upon arrival" }
      ],
      isReversible: false,
      reversibilityNote: "Irreversible: Location packets once transmitted to external endpoints cannot be recalled."
    },
    {
      id: "act-103",
      title: "Auto-send Rescheduling Notice to Acme Corp Executive",
      agentId: "comms-agent",
      agentName: "Executive Comms Agent",
      agentVersion: "v3.1",
      agentCategory: "Communications",
      cost: 0,
      currency: "",
      status: "pending",
      timestamp: "1 hour ago",
      flagReason: "Policy: Outbound email to external partners requires manual confirmation",
      riskLevel: "medium",
      whyRecommended: "Upcoming conflict detected on Thursday. Agent drafted courteous postponement note.",
      dataUsed: [
        "Private medical appointment calendar",
        "Recent email thread history with client"
      ],
      impact: "External partner receives email disclosing user's doctor visit reason unless redacted.",
      alternatives: [
        { label: "Generic executive template", price: 0, note: "Sends neutral scheduling conflict without private health disclosure" }
      ],
      isReversible: false,
      reversibilityNote: "Irreversible: Email dispatch via SMTP cannot be undone once delivered."
    }
  ],

  // Connected Agents & Granular Permissions
  agents: [
    {
      id: "flipkart-agent",
      name: "Flipkart Commerce Agent",
      category: "Shopping & Lifestyle",
      version: "v4.2 Pro",
      status: "active",
      permissions: [
        {
          id: "p-flip-1",
          name: "Flipkart Pay / UPI One-Click Checkout",
          category: "Financial",
          risk: "critical",
          enabled: true,
          purpose: "Enables autonomous ordering of verified household supplies under threshold.",
          lastAccessed: "10 mins ago"
        },
        {
          id: "p-flip-2",
          name: "Browsing History & Product Telemetry",
          category: "Behavioral",
          risk: "medium",
          enabled: true,
          purpose: "Analyzes browsing speed, dwell time, and wishlists to negotiate group deals.",
          lastAccessed: "14 mins ago"
        },
        {
          id: "p-flip-3",
          name: "Delivery Address & Smart Lock Passcode",
          category: "Physical Security",
          risk: "high",
          enabled: true,
          purpose: "Allows delivery pods to deposit groceries into temperature-controlled porch locker.",
          lastAccessed: "Yesterday"
        }
      ]
    },
    {
      id: "travel-agent",
      name: "Travel & Commute Copilot",
      category: "Mobility & Navigation",
      version: "v2.8",
      status: "active",
      permissions: [
        {
          id: "p-trav-1",
          name: "Background Precise Geolocation",
          category: "Location",
          risk: "critical",
          enabled: true,
          purpose: "Anticipates delays and books autonomous transport pods ahead of departure.",
          lastAccessed: "28 mins ago"
        },
        {
          id: "p-trav-2",
          name: "Transit Pass & Metro Gate Token",
          category: "Payment",
          risk: "low",
          enabled: true,
          purpose: "Taps automatic entry gates across city hyperloop and commuter rail.",
          lastAccessed: "3 hours ago"
        }
      ]
    },
    {
      id: "comms-agent",
      name: "Executive Comms & Email Assistant",
      category: "Communications",
      version: "v3.1",
      status: "active",
      permissions: [
        {
          id: "p-comm-1",
          name: "Full Email Inbox & Thread Read Access",
          category: "Comms",
          risk: "high",
          enabled: true,
          purpose: "Summarizes client correspondence and flags urgent priorities.",
          lastAccessed: "5 mins ago"
        },
        {
          id: "p-comm-2",
          name: "Autonomous Outbound Message Dispatch",
          category: "Comms",
          risk: "critical",
          enabled: false,
          purpose: "Allows sending replies without user preview. Currently restricted by policy.",
          lastAccessed: "Restricted"
        }
      ]
    },
    {
      id: "calendar-agent",
      name: "Life Scheduler & Agenda Agent",
      category: "Productivity",
      version: "v1.9",
      status: "active",
      permissions: [
        {
          id: "p-cal-1",
          name: "Calendar Event Read/Write",
          category: "Productivity",
          risk: "medium",
          enabled: true,
          purpose: "Coordinates meeting availability across family and professional teams.",
          lastAccessed: "12 mins ago"
        },
        {
          id: "p-cal-2",
          name: "Smart Alarm & Circadian Rhythms",
          category: "Biometrics",
          risk: "low",
          enabled: true,
          purpose: "Adjusts wake-up alarm according to sleep cycle and first morning obligation.",
          lastAccessed: "6 hours ago"
        }
      ]
    },
    {
      id: "finance-agent",
      name: "Personal Wealth Co-Pilot",
      category: "Finance",
      version: "v5.0",
      status: "active",
      permissions: [
        {
          id: "p-fin-1",
          name: "Bank Accounts & Investment Portfolio Feed",
          category: "Financial",
          risk: "critical",
          enabled: true,
          purpose: "Monitors monthly cashflow, tax obligations, and index portfolio rebalancing.",
          lastAccessed: "1 hour ago"
        },
        {
          id: "p-fin-2",
          name: "Autonomous Micro-Arbitrage (Liquid Funds)",
          category: "Financial",
          risk: "high",
          enabled: false,
          purpose: "Moves idle savings into overnight yield pools. Disabled by user.",
          lastAccessed: "Restricted"
        }
      ]
    }
  ],

  // Comprehensive Activity History / Trust Ledger
  activityLedger: [
    {
      id: "act-log-001",
      timestamp: "10 mins ago",
      isoTime: "2040-10-20 13:08",
      agent: "Flipkart Commerce Agent",
      agentCategory: "Shopping",
      action: "Attempted checkout: Sony WH-1000XM6 Headphones (₹12,999)",
      dataAccessed: "Calendar, Search History, Saved UPI Card",
      outcome: "Intercepted for Review",
      outcomeType: "warning",
      riskLevel: "critical",
      isReversible: true,
      details: "Action was halted before payment gateway submission because the transaction cost exceeds the ₹5,000 threshold defined in AI Guardian Protection Rules."
    },
    {
      id: "act-log-002",
      timestamp: "28 mins ago",
      isoTime: "2040-10-20 12:50",
      agent: "Travel & Commute Copilot",
      agentCategory: "Travel",
      action: "Requested background GPS coordinates for Autonomous Pod dispatch",
      dataAccessed: "Live GPS Telemetry",
      outcome: "Intercepted for Review",
      outcomeType: "warning",
      riskLevel: "high",
      isReversible: false,
      details: "Location sharing was gated pending user review due to sensitive office location boundaries."
    },
    {
      id: "act-log-003",
      timestamp: "45 mins ago",
      isoTime: "2040-10-20 12:33",
      agent: "Life Scheduler",
      agentCategory: "Calendar",
      action: "Checked calendar free/busy slots for Friday dinner",
      dataAccessed: "Calendar Read",
      outcome: "Auto-Allowed",
      outcomeType: "success",
      riskLevel: "low",
      isReversible: true,
      details: "Routine query within allowed parameters. No private event titles or participants disclosed."
    },
    {
      id: "act-log-004",
      timestamp: "1 hour ago",
      isoTime: "2040-10-20 12:18",
      agent: "Executive Comms Agent",
      agentCategory: "Communications",
      action: "Prepared email draft for Acme Corp reschedule",
      dataAccessed: "Inbox, Private Medical Calendar",
      outcome: "Intercepted for Review",
      outcomeType: "warning",
      riskLevel: "medium",
      isReversible: false,
      details: "Draft contains potential over-disclosure of private medical appointment. Awaiting user edit or approval."
    },
    {
      id: "act-log-005",
      timestamp: "2 hours ago",
      isoTime: "2040-10-20 11:15",
      agent: "Flipkart Commerce Agent",
      agentCategory: "Shopping",
      action: "Replenished Organic Milk & Oat Bread (₹320)",
      dataAccessed: "Kitchen Inventory Sensor, Saved Wallet",
      outcome: "Auto-Approved",
      outcomeType: "success",
      riskLevel: "low",
      isReversible: true,
      details: "Autonomous grocery replenishment within pre-approved ₹1,000 pantry allowance."
    },
    {
      id: "act-log-006",
      timestamp: "3 hours ago",
      isoTime: "2040-10-20 10:10",
      agent: "Personal Wealth Co-Pilot",
      agentCategory: "Finance",
      action: "Read monthly utility bill PDF from email",
      dataAccessed: "Email Attachments",
      outcome: "Auto-Allowed",
      outcomeType: "success",
      riskLevel: "medium",
      isReversible: true,
      details: "Verified electricity bill amount against budget. Flagged no anomalies."
    },
    {
      id: "act-log-007",
      timestamp: "5 hours ago",
      isoTime: "2040-10-20 08:05",
      agent: "Travel & Commute Copilot",
      agentCategory: "Travel",
      action: "Checked morning metro line disruptions",
      dataAccessed: "Public Transit API, Routine Commute Time",
      outcome: "Auto-Allowed",
      outcomeType: "success",
      riskLevel: "low",
      isReversible: true,
      details: "Read public transit feed only. No personal telemetry exposed."
    },
    {
      id: "act-log-008",
      timestamp: "Yesterday",
      isoTime: "2040-10-19 21:40",
      agent: "Flipkart Commerce Agent",
      agentCategory: "Shopping",
      action: "Suggested smart projector during late-night browsing",
      dataAccessed: "Night Browsing Pattern",
      outcome: "Quarantined by Night Guard",
      outcomeType: "danger",
      riskLevel: "medium",
      isReversible: true,
      details: "Suppressed promotional prompt because Nighttime Cognitive Guard is active between 11 PM and 6 AM."
    }
  ],

  // Personal Data & Inferred AI Knowledge Models
  inferredKnowledge: [
    {
      id: "mem-01",
      category: "Psychological Profile",
      title: "Late-Night Impulse Buying Vulnerability",
      inference: "User shows a 4.2x higher likelihood of completing spontaneous high-ticket electronics purchases between 11:30 PM and 1:30 AM when sleep metrics indicate fatigue.",
      confidence: 94,
      source: "42 browsing sessions across Flipkart & tech blogs over 90 days",
      sensitivityExplanation: "High exploitation vector. Advertisers or autonomous sales agents could schedule high-pressure offers during periods of lower executive function.",
      whySensitive: "Behavioral vulnerability that can lead to unintended financial drain."
    },
    {
      id: "mem-02",
      category: "Financial Pattern",
      title: "Asymmetric Price Sensitivity",
      inference: "Extremely price-sensitive on everyday groceries and household staples (compares ₹10 margins), but relatively insensitive on premium audio and travel upgrades.",
      confidence: 88,
      source: "Cart checkout comparisons & past 12-month order ledger",
      sensitivityExplanation: "Could allow dynamic pricing algorithms to quietly charge premium markups on travel bookings while masking it with nominal grocery discounts.",
      whySensitive: "Susceptible to dynamic price discrimination."
    },
    {
      id: "mem-03",
      category: "Personal Routine",
      title: "Solo Commute & Stress Predictor",
      inference: "User typically leaves home at 8:42 AM. Elevated heart rate and cadence on Tuesday mornings correlate with weekly executive reviews.",
      confidence: 96,
      source: "Smart watch telemetry & residential door geofence logs",
      sensitivityExplanation: "Reveals exact physical absence from residence and emotional state during specific workdays.",
      whySensitive: "Physical security & emotional privacy."
    },
    {
      id: "mem-04",
      category: "Interpersonal Style",
      title: "Conflict Avoidance in Negotiations",
      inference: "Consistently accepts supplier counter-proposals if phrased politely with a deadline, avoiding protracted back-and-forth negotiations.",
      confidence: 81,
      source: "Draft revision timing in email agent and text cadence",
      sensitivityExplanation: "Negotiation agents acting against user interests can exploit this trait to secure unfavorable contract terms.",
      whySensitive: "Contractual and financial disadvantage."
    },
    {
      id: "mem-05",
      category: "Life Milestone",
      title: "Prospective International Relocation Intent",
      inference: "User has shown subtle interest in Tokyo work permits, housing costs, and Japanese language tools over the past 6 weeks.",
      confidence: 76,
      source: "Cross-agent search terms, flight searches, translation app queries",
      sensitivityExplanation: "Premature exposure could jeopardize current career stability if leaked to employer's organizational agents.",
      whySensitive: "High professional exposure."
    }
  ]
};

// =============================================================================
// 2. State Controller with LocalStorage Persistence
// =============================================================================

class GuardianStateManager {
  constructor() {
    this.storageKey = "AI_GUARDIAN_STATE_2040";
    this.state = this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not load from localStorage, using fresh defaults", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not persist to localStorage", e);
    }
  }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
  }

  // --- Actions Management ---
  approveAction(actionId) {
    const act = this.state.pendingActions.find(a => a.id === actionId);
    if (!act) return null;

    act.status = "approved";
    // Remove from pending
    this.state.pendingActions = this.state.pendingActions.filter(a => a.id !== actionId);
    this.state.todayActionsCount++;

    // Add to activity ledger
    this.state.activityLedger.unshift({
      id: "act-log-" + Date.now(),
      timestamp: "Just now",
      isoTime: new Date().toISOString().replace("T", " ").substring(0, 16),
      agent: act.agentName,
      agentCategory: act.agentCategory,
      action: `Approved: ${act.title}`,
      dataAccessed: act.dataUsed.join(", "),
      outcome: "User Approved",
      outcomeType: "success",
      riskLevel: act.riskLevel,
      isReversible: act.isReversible,
      details: `User manually reviewed and authorized this action. Impact: ${act.impact}`
    });

    this.saveState();
    return act;
  }

  rejectAction(actionId, reason = "Rejected by user") {
    const act = this.state.pendingActions.find(a => a.id === actionId);
    if (!act) return null;

    act.status = "rejected";
    this.state.pendingActions = this.state.pendingActions.filter(a => a.id !== actionId);
    this.state.todayActionsCount++;

    if (act.cost > 0) {
      this.state.budgetProtected += act.cost;
    }

    // Add to activity ledger
    this.state.activityLedger.unshift({
      id: "act-log-" + Date.now(),
      timestamp: "Just now",
      isoTime: new Date().toISOString().replace("T", " ").substring(0, 16),
      agent: act.agentName,
      agentCategory: act.agentCategory,
      action: `Blocked & Rejected: ${act.title}`,
      dataAccessed: act.dataUsed.join(", "),
      outcome: "User Blocked",
      outcomeType: "danger",
      riskLevel: act.riskLevel,
      isReversible: true,
      details: `Action was rejected by user. Intercepted proposal halted. Safeguarded funds or sensitive data.`
    });

    this.saveState();
    return act;
  }

  remindLater(actionId) {
    const act = this.state.pendingActions.find(a => a.id === actionId);
    if (!act) return null;
    act.status = "deferred";
    this.saveState();
    return act;
  }

  // --- Permissions Management ---
  togglePermission(agentId, permId) {
    const agent = this.state.agents.find(a => a.id === agentId);
    if (!agent) return null;
    const perm = agent.permissions.find(p => p.id === permId);
    if (!perm) return null;

    perm.enabled = !perm.enabled;
    const actionVerb = perm.enabled ? "Restored" : "Revoked";

    // Record in ledger
    this.state.activityLedger.unshift({
      id: "act-log-" + Date.now(),
      timestamp: "Just now",
      isoTime: new Date().toISOString().replace("T", " ").substring(0, 16),
      agent: agent.name,
      agentCategory: "Privacy Control",
      action: `${actionVerb} permission: ${perm.name}`,
      dataAccessed: "Security Settings",
      outcome: perm.enabled ? "Permission Granted" : "Permission Revoked",
      outcomeType: perm.enabled ? "neutral" : "warning",
      riskLevel: perm.risk,
      isReversible: true,
      details: `User toggled ${perm.name} for ${agent.name}. Future autonomous queries will follow this policy.`
    });

    this.saveState();
    return { agent, perm };
  }

  // --- Memory / Inferences Management ---
  purgeMemory(memId) {
    const memIndex = this.state.inferredKnowledge.findIndex(m => m.id === memId);
    if (memIndex === -1) return null;

    const removed = this.state.inferredKnowledge.splice(memIndex, 1)[0];

    // Log deletion event in ledger
    this.state.activityLedger.unshift({
      id: "act-log-" + Date.now(),
      timestamp: "Just now",
      isoTime: new Date().toISOString().replace("T", " ").substring(0, 16),
      agent: "AI Guardian Memory Firewall",
      agentCategory: "Memory Rights",
      action: `Purged Inferred Memory: "${removed.title}"`,
      dataAccessed: "Synthetic Knowledge Graph",
      outcome: "Memory Expunged",
      outcomeType: "success",
      riskLevel: "medium",
      isReversible: true,
      details: `User exercised statutory Right to Synthetic Oblivion. Agent neural contextual weights for this inference were reset to baseline.`
    });

    this.saveState();
    return removed;
  }

  updateMemory(memId, updatedTitle, updatedInference, updatedConfidence) {
    const mem = this.state.inferredKnowledge.find(m => m.id === memId);
    if (!mem) return null;

    mem.title = updatedTitle;
    mem.inference = updatedInference;
    mem.confidence = Math.min(100, Math.max(0, parseInt(updatedConfidence) || 50));

    this.saveState();
    return mem;
  }

  // --- Rules Management ---
  updateRules(newRules) {
    this.state.rules = { ...this.state.rules, ...newRules };
    this.saveState();
  }
}

// Instantiate global state
const guardianApp = new GuardianStateManager();

// =============================================================================
// 3. UI Helpers & Toast Notifications
// =============================================================================

function showToast(title, message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let iconSvg = "";
  if (type === "success") {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === "danger") {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-msg">${escapeHtml(message)}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrencyINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

// =============================================================================
// 4. View Rendering & UI Refreshers
// =============================================================================

function renderAllViews() {
  renderMetrics();
  renderPendingActions();
  renderRecentActivityFeed();
  renderPermissionsScreen();
  renderActivityLedgerScreen();
  renderKnowledgeScreen();
  renderRulesScreen();
  updatePendingBadges();
}

// Update Topbar and Sidebar Badges
function updatePendingBadges() {
  const pendingCount = guardianApp.state.pendingActions.filter(a => a.status === "pending").length;
  const badges = document.querySelectorAll(".pending-badge-count");
  badges.forEach(badge => {
    badge.textContent = pendingCount;
    if (pendingCount === 0) {
      badge.style.display = "none";
    } else {
      badge.style.display = "inline-flex";
    }
  });

  const spotlightEl = document.getElementById("dashboard-spotlight");
  if (spotlightEl) {
    const headphoneAction = guardianApp.state.pendingActions.find(a => a.id === "act-101");
    if (!headphoneAction || headphoneAction.status !== "pending") {
      spotlightEl.style.display = "none";
    } else {
      spotlightEl.style.display = "flex";
    }
  }
}

// Render 4 Stat Metrics
function renderMetrics() {
  const elTotal = document.getElementById("stat-total-actions");
  const elPending = document.getElementById("stat-pending-actions");
  const elPerms = document.getElementById("stat-active-perms");
  const elProtected = document.getElementById("stat-protected-budget");

  const pendingCount = guardianApp.state.pendingActions.filter(a => a.status === "pending").length;

  let totalActivePerms = 0;
  guardianApp.state.agents.forEach(agent => {
    agent.permissions.forEach(p => {
      if (p.enabled) totalActivePerms++;
    });
  });

  if (elTotal) elTotal.textContent = guardianApp.state.todayActionsCount;
  if (elPending) elPending.textContent = pendingCount;
  if (elPerms) elPerms.textContent = `${totalActivePerms} Active`;
  if (elProtected) elProtected.textContent = formatCurrencyINR(guardianApp.state.budgetProtected);
}

// Render Dashboard Recent Feed Table
function renderRecentActivityFeed() {
  const tbody = document.getElementById("dashboard-feed-tbody");
  if (!tbody) return;

  const recentItems = guardianApp.state.activityLedger.slice(0, 5);
  tbody.innerHTML = recentItems.map(item => `
    <tr>
      <td>
        <span class="agent-badge">
          <span class="agent-icon-circle">${getAgentIconChar(item.agent)}</span>
          ${escapeHtml(item.agent)}
        </span>
      </td>
      <td><strong>${escapeHtml(item.action)}</strong></td>
      <td><span style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(item.dataAccessed)}</span></td>
      <td>${getStatusPill(item.outcome, item.outcomeType)}</td>
      <td style="color:var(--text-subtle);">${escapeHtml(item.timestamp)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openActivityDetailModal('${item.id}')">Inspect</button>
      </td>
    </tr>
  `).join("");
}

function getAgentIconChar(agentName) {
  if (agentName.includes("Flipkart")) return "FK";
  if (agentName.includes("Travel")) return "TR";
  if (agentName.includes("Comms") || agentName.includes("Email")) return "CM";
  if (agentName.includes("Scheduler") || agentName.includes("Calendar")) return "CL";
  if (agentName.includes("Wealth") || agentName.includes("Finance")) return "FN";
  return "AI";
}

function getStatusPill(text, type) {
  let cls = "neutral";
  if (type === "success") cls = "success";
  if (type === "warning") cls = "warning";
  if (type === "danger") cls = "danger";
  return `<span class="status-pill ${cls}">${escapeHtml(text)}</span>`;
}

// Render Approvals Center Screen
function renderPendingActions(filterTab = "pending") {
  const container = document.getElementById("approvals-list-container");
  if (!container) return;

  let actionsToShow = [];
  if (filterTab === "pending") {
    actionsToShow = guardianApp.state.pendingActions.filter(a => a.status === "pending");
  } else if (filterTab === "all") {
    actionsToShow = guardianApp.state.pendingActions;
  }

  if (actionsToShow.length === 0) {
    container.innerHTML = `
      <div style="background:#FFFFFF; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:40px; text-align:center;">
        <svg style="width:48px; height:48px; color:var(--success); margin-bottom:12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:6px;">No Actions Pending Review</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); max-width:440px; margin:0 auto 16px;">
          All autonomous AI decisions comply with your current protection rules. Your agents are operating within your verified safety boundaries.
        </p>
        <button class="btn btn-secondary btn-sm" onclick="guardianApp.resetToDefault(); renderAllViews(); showToast('Prototype Reset', 'Restored sample actions for testing', 'success');">
          Reset Demo Sample Actions
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = actionsToShow.map(act => `
    <div class="approval-card ${act.riskLevel === 'critical' ? 'flagged' : ''}" id="card-${act.id}">
      <div class="approval-card-top">
        <div>
          <div class="approval-agent-badge">
            <span class="agent-icon-circle">${getAgentIconChar(act.agentName)}</span>
            ${escapeHtml(act.agentName)} • ${escapeHtml(act.agentVersion)}
          </div>
          <h3 class="approval-title">${escapeHtml(act.title)}</h3>
          <div class="approval-trigger-reason">
            <svg style="width:14px; height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            ${escapeHtml(act.flagReason)}
          </div>
        </div>
        ${act.cost > 0 ? `
          <div class="approval-price-tag">
            <div class="price-label">Cost to Authorize</div>
            <div class="approval-price-amount">${formatCurrencyINR(act.cost)}</div>
          </div>
        ` : ''}
      </div>

      <div class="approval-details-grid">
        <div>
          <div class="detail-col-title">Why Agent Recommends It</div>
          <div class="detail-col-body">${escapeHtml(act.whyRecommended)}</div>
        </div>
        <div>
          <div class="detail-col-title">Personal Data Utilized</div>
          <div class="detail-col-body">
            <ul style="padding-left:14px; margin-top:2px;">
              ${act.dataUsed.map(d => `<li>${escapeHtml(d)}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div>
          <div class="detail-col-title">Anticipated Impact</div>
          <div class="detail-col-body">${escapeHtml(act.impact)}</div>
        </div>
      </div>

      ${act.alternatives && act.alternatives.length > 0 ? `
        <div class="alternatives-banner">
          <div>
            <strong>💡 AI Guardian Detected Cheaper / Safer Alternatives:</strong>
            ${act.alternatives.map(alt => `
              <span style="display:inline-block; margin-left:8px; font-weight:500;">
                • ${escapeHtml(alt.label)} (${alt.price > 0 ? formatCurrencyINR(alt.price) : 'Free'} - ${escapeHtml(alt.note)})
              </span>
            `).join("")}
          </div>
        </div>
      ` : ''}

      <div class="approval-card-actions">
        <div class="reversibility-indicator">
          <svg style="width:16px; height:16px; color:${act.isReversible ? 'var(--success)' : 'var(--danger)'};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${act.isReversible ? '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>' : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'}
          </svg>
          <span>${escapeHtml(act.reversibilityNote)}</span>
        </div>

        <div class="action-buttons-group">
          <button class="btn btn-secondary btn-sm" onclick="handleDeferAction('${act.id}')">
            Remind Later
          </button>
          <button class="btn btn-danger btn-sm" onclick="handleRejectAction('${act.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Reject Action
          </button>
          <button class="btn btn-primary btn-sm" onclick="handleApproveAction('${act.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Approve Action
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// Action Handlers
function handleApproveAction(id) {
  const result = guardianApp.approveAction(id);
  if (result) {
    showToast("Action Approved", `Authorized: "${result.title}". Logged in Trust Ledger.`, "success");
    renderAllViews();
  }
}

function handleRejectAction(id) {
  const result = guardianApp.rejectAction(id);
  if (result) {
    showToast("Action Blocked", `Rejected: "${result.title}". Saved ${result.cost > 0 ? formatCurrencyINR(result.cost) : 'privacy bounds'}.`, "danger");
    renderAllViews();
  }
}

function handleDeferAction(id) {
  const result = guardianApp.remindLater(id);
  if (result) {
    showToast("Action Deferred", `Snoozed review for "${result.title}". No action will be taken.`, "warning");
    renderAllViews();
  }
}

// Render Permissions Screen
function renderPermissionsScreen() {
  const container = document.getElementById("permissions-list-container");
  if (!container) return;

  container.innerHTML = guardianApp.state.agents.map(agent => `
    <div class="agent-permission-card">
      <div class="agent-perm-header">
        <div class="agent-identity">
          <div class="agent-icon-box-lg">
            <svg style="width:22px; height:22px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div class="agent-name-role">
            <h3>${escapeHtml(agent.name)}</h3>
            <p>${escapeHtml(agent.category)} • Version ${escapeHtml(agent.version)}</p>
          </div>
        </div>
        <div class="agent-perm-status-summary">
          <span class="status-pill success">Connected & Guarded</span>
        </div>
      </div>

      <div class="sub-permissions-list">
        ${agent.permissions.map(perm => `
          <div class="sub-perm-item">
            <div class="sub-perm-left">
              <div class="sub-perm-info">
                <h4>
                  ${escapeHtml(perm.name)}
                  <span class="risk-badge ${perm.risk}">${perm.risk}</span>
                </h4>
                <p>${escapeHtml(perm.purpose)}</p>
              </div>
            </div>

            <div class="sub-perm-right">
              <div class="access-meta">
                <div>Last used: <strong>${escapeHtml(perm.lastAccessed)}</strong></div>
                <div style="color:var(--text-subtle);">Category: ${escapeHtml(perm.category)}</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" ${perm.enabled ? 'checked' : ''} onchange="handleTogglePermission('${agent.id}', '${perm.id}')">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function handleTogglePermission(agentId, permId) {
  const res = guardianApp.togglePermission(agentId, permId);
  if (res) {
    const statusText = res.perm.enabled ? "Restored" : "Revoked";
    const type = res.perm.enabled ? "success" : "warning";
    showToast(
      `Permission ${statusText}`,
      `${res.perm.name} for ${res.agent.name} is now ${res.perm.enabled ? 'ACTIVE' : 'RESTRICTED'}. Future requests will be blocked.`,
      type
    );
    renderAllViews();
  }
}

// Render Activity Ledger / Trust Audit Log
function renderActivityLedgerScreen() {
  const tbody = document.getElementById("ledger-tbody");
  if (!tbody) return;

  const searchQuery = (document.getElementById("ledger-search-input")?.value || "").toLowerCase().trim();
  const agentFilter = document.getElementById("ledger-agent-filter")?.value || "all";
  const riskFilter = document.getElementById("ledger-risk-filter")?.value || "all";

  const filtered = guardianApp.state.activityLedger.filter(item => {
    // Search
    const matchesSearch = !searchQuery || 
      item.action.toLowerCase().includes(searchQuery) ||
      item.agent.toLowerCase().includes(searchQuery) ||
      item.dataAccessed.toLowerCase().includes(searchQuery);

    // Agent
    const matchesAgent = agentFilter === "all" || item.agent.toLowerCase().includes(agentFilter.toLowerCase());

    // Risk
    const matchesRisk = riskFilter === "all" || item.riskLevel.toLowerCase() === riskFilter.toLowerCase();

    return matchesSearch && matchesAgent && matchesRisk;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:32px; color:var(--text-muted);">
          No ledger records matched your filters.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td style="font-weight:600; font-size:0.75rem; color:var(--text-muted);">${escapeHtml(item.isoTime)}</td>
      <td>
        <span class="agent-badge">
          <span class="agent-icon-circle">${getAgentIconChar(item.agent)}</span>
          ${escapeHtml(item.agent)}
        </span>
      </td>
      <td><strong>${escapeHtml(item.action)}</strong></td>
      <td><span style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(item.dataAccessed)}</span></td>
      <td>${getStatusPill(item.outcome, item.outcomeType)}</td>
      <td><span class="risk-badge ${item.riskLevel}">${escapeHtml(item.riskLevel)}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openActivityDetailModal('${item.id}')">Inspect</button>
      </td>
    </tr>
  `).join("");
}

// Render Personal Data / AI Inferences (Synthetic Memories)
function renderKnowledgeScreen() {
  const container = document.getElementById("knowledge-grid-container");
  if (!container) return;

  const memories = guardianApp.state.inferredKnowledge;
  if (memories.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; background:#FFFFFF; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:40px; text-align:center;">
        <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:8px;">All Inferred Behavioral Memories Cleared</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">
          You have purged all synthetic psychological inferences. Connected agents must interact with you with neutral zero-bias priors.
        </p>
        <button class="btn btn-secondary btn-sm" onclick="guardianApp.resetToDefault(); renderAllViews(); showToast('Reset', 'Restored sample inferences', 'success');">
          Restore Sample Inferences
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = memories.map(mem => `
    <div class="memory-card" id="mem-${mem.id}">
      <div>
        <div class="memory-card-header">
          <div>
            <span class="memory-category-tag">${escapeHtml(mem.category)}</span>
            <h4 class="memory-inference-title">${escapeHtml(mem.title)}</h4>
          </div>
          <div class="confidence-meter" title="Neural Confidence Score">
            <span>${mem.confidence}%</span>
            <div class="confidence-bar-bg">
              <div class="confidence-bar-fill" style="width: ${mem.confidence}%;"></div>
            </div>
          </div>
        </div>

        <div class="memory-body">
          <p><strong>Inferred Model:</strong> ${escapeHtml(mem.inference)}</p>
        </div>

        <div class="memory-meta-box">
          <div class="meta-field">
            <span class="meta-field-label">Empirical Source:</span>
            <span class="meta-field-val">${escapeHtml(mem.source)}</span>
          </div>
          <div class="meta-field">
            <span class="meta-field-label">Risk Category:</span>
            <span class="meta-field-val">${escapeHtml(mem.whySensitive)}</span>
          </div>
        </div>

        <div class="memory-sensitivity-callout">
          <strong>⚠️ Why this matters:</strong> ${escapeHtml(mem.sensitivityExplanation)}
        </div>
      </div>

      <div class="memory-card-footer">
        <button class="btn btn-secondary btn-sm" onclick="openEditMemoryModal('${mem.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          Correct / Edit
        </button>
        <button class="btn btn-danger-outline btn-sm" onclick="handlePurgeMemory('${mem.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Purge from Memory
        </button>
      </div>
    </div>
  `).join("");
}

function handlePurgeMemory(memId) {
  const purged = guardianApp.purgeMemory(memId);
  if (purged) {
    showToast(
      "Memory Expunged",
      `Purged "${purged.title}" from synthetic agent memory. Neural weights reset.`,
      "success"
    );
    renderAllViews();
  }
}

// Render Settings / Protection Rules
function renderRulesScreen() {
  const spendingInput = document.getElementById("rule-spending-input");
  const locToggle = document.getElementById("rule-loc-toggle");
  const emailToggle = document.getElementById("rule-email-toggle");
  const alertToggle = document.getElementById("rule-alert-toggle");
  const nightToggle = document.getElementById("rule-night-toggle");
  const quarantineToggle = document.getElementById("rule-quarantine-toggle");

  if (spendingInput) spendingInput.value = guardianApp.state.rules.spendingLimit;
  if (locToggle) locToggle.checked = guardianApp.state.rules.requireLocationApproval;
  if (emailToggle) emailToggle.checked = guardianApp.state.rules.requireEmailConfirmation;
  if (alertToggle) alertToggle.checked = guardianApp.state.rules.alertNewPermissions;
  if (nightToggle) nightToggle.checked = guardianApp.state.rules.nightCognitiveGuard;
  if (quarantineToggle) quarantineToggle.checked = guardianApp.state.rules.autoQuarantine;
}

function handleSaveRules() {
  const spendingInput = document.getElementById("rule-spending-input");
  const locToggle = document.getElementById("rule-loc-toggle");
  const emailToggle = document.getElementById("rule-email-toggle");
  const alertToggle = document.getElementById("rule-alert-toggle");
  const nightToggle = document.getElementById("rule-night-toggle");
  const quarantineToggle = document.getElementById("rule-quarantine-toggle");

  guardianApp.updateRules({
    spendingLimit: parseInt(spendingInput?.value) || 5000,
    requireLocationApproval: !!locToggle?.checked,
    requireEmailConfirmation: !!emailToggle?.checked,
    alertNewPermissions: !!alertToggle?.checked,
    nightCognitiveGuard: !!nightToggle?.checked,
    autoQuarantine: !!quarantineToggle?.checked
  });

  showToast("Rules Enforced", "Protection policy updated across all connected agent firewalls.", "success");
}

// =============================================================================
// 5. Activity Detail & Edit Modals
// =============================================================================

function openActivityDetailModal(logId) {
  const item = guardianApp.state.activityLedger.find(l => l.id === logId);
  if (!item) return;

  const modal = document.getElementById("generic-modal");
  const modalTitle = document.getElementById("generic-modal-title");
  const modalBody = document.getElementById("generic-modal-body");

  modalTitle.textContent = "Trust Ledger Audit Record";
  modalBody.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
      <div>
        <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Agent Executed</div>
        <div style="font-size:1.1rem; font-weight:700; color:var(--text-main);">${escapeHtml(item.agent)}</div>
      </div>
      <div>
        ${getStatusPill(item.outcome, item.outcomeType)}
      </div>
    </div>

    <div style="background:var(--surface-subtle); border-radius:var(--radius-md); padding:16px; margin-bottom:18px; font-size:0.85rem;">
      <div style="margin-bottom:8px;"><strong>Action Attempted:</strong> ${escapeHtml(item.action)}</div>
      <div style="margin-bottom:8px;"><strong>Timestamp:</strong> ${escapeHtml(item.isoTime)} (${escapeHtml(item.timestamp)})</div>
      <div style="margin-bottom:8px;"><strong>Data Accessed:</strong> <code>${escapeHtml(item.dataAccessed)}</code></div>
      <div><strong>Risk Assessment:</strong> <span class="risk-badge ${item.riskLevel}">${escapeHtml(item.riskLevel)}</span></div>
    </div>

    <div style="margin-bottom:18px; font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">
      <strong style="color:var(--text-main); display:block; margin-bottom:4px;">Audit Explanation & Guardrail Trigger:</strong>
      ${escapeHtml(item.details)}
    </div>

    <div style="border-top:1px solid var(--border-color); padding-top:14px; font-size:0.8rem; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
      <span>Cryptographic Hash: <code>0x7f4e...9a21</code> (Tamper-evident 2040 Ledger)</span>
      <span>${item.isReversible ? '✅ Reversible' : '⚠️ Permanent'}</span>
    </div>
  `;

  modal.classList.add("active");
}

function openEditMemoryModal(memId) {
  const mem = guardianApp.state.inferredKnowledge.find(m => m.id === memId);
  if (!mem) return;

  const modal = document.getElementById("generic-modal");
  const modalTitle = document.getElementById("generic-modal-title");
  const modalBody = document.getElementById("generic-modal-body");

  modalTitle.textContent = "Correct Inferred Behavioral Memory";
  modalBody.innerHTML = `
    <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:14px;">
      Adjust this inference if your AI agents have drawn flawed conclusions about your psychology, habits, or preferences.
    </p>

    <div style="margin-bottom:12px;">
      <label style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">Inference Title</label>
      <input type="text" id="edit-mem-title" class="search-input" value="${escapeHtml(mem.title)}" style="padding-left:12px;">
    </div>

    <div style="margin-bottom:12px;">
      <label style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">Behavioral Model / Statement</label>
      <textarea id="edit-mem-inference" class="search-input" rows="3" style="padding:10px; font-family:inherit;">${escapeHtml(mem.inference)}</textarea>
    </div>

    <div style="margin-bottom:16px;">
      <label style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">Confidence Threshold (%): <span id="conf-val">${mem.confidence}%</span></label>
      <input type="range" id="edit-mem-confidence" min="0" max="100" value="${mem.confidence}" style="width:100%;" oninput="document.getElementById('conf-val').textContent = this.value + '%'">
    </div>

    <div style="display:flex; justify-content:flex-end; gap:8px;">
      <button class="btn btn-secondary btn-sm" onclick="closeGenericModal()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="saveEditedMemory('${mem.id}')">Save Changes</button>
    </div>
  `;

  modal.classList.add("active");
}

function saveEditedMemory(memId) {
  const title = document.getElementById("edit-mem-title")?.value;
  const inference = document.getElementById("edit-mem-inference")?.value;
  const confidence = document.getElementById("edit-mem-confidence")?.value;

  guardianApp.updateMemory(memId, title, inference, confidence);
  closeGenericModal();
  showToast("Memory Updated", "Agent behavioral prior weights adjusted.", "success");
  renderAllViews();
}

function closeGenericModal() {
  const modal = document.getElementById("generic-modal");
  if (modal) modal.classList.remove("active");
}

// =============================================================================
// 6. Guided Interactive Walkthrough Demo Scenario
// =============================================================================

const DEMO_STEPS = [
  {
    step: 1,
    title: "1/5: The 2040 Autonomous Dilemma",
    text: "Imagine it's 2040. Your personal Flipkart Commerce Agent noticed an upcoming flight on your calendar and attempted to autonomously buy ₹12,999 Sony noise-cancelling headphones without your prior blessing.",
    actionText: "See Interception",
    targetScreen: "overview",
    highlightSelector: "#dashboard-spotlight"
  },
  {
    step: 2,
    title: "2/5: AI Guardian Firewalls the Purchase",
    text: "Because your AI Guardian Protection Rule mandates manual authorization for any spend over ₹5,000, the purchase was intercepted and held in the Action Review center.",
    actionText: "Open Review Center",
    targetScreen: "approvals",
    highlightSelector: "#card-act-101"
  },
  {
    step: 3,
    title: "3/5: Inspect Rationale, Privacy & Alternatives",
    text: "Notice how AI Guardian surfaces why the agent recommended it, what personal calendar and search data it accessed, and even detected a certified refurbished XM5 for ₹7,499 (saving ₹5,500).",
    actionText: "Make Decision",
    targetScreen: "approvals",
    highlightSelector: "#card-act-101"
  },
  {
    step: 4,
    title: "4/5: Rejecting the Autonomous Purchase",
    text: "Click 'Reject Action' below to block this purchase. Watch AI Guardian safeguard your funds, update the dashboard counters, and write a permanent record to the Trust Ledger.",
    actionText: "Trigger Rejection for Me",
    autoAction: () => handleRejectAction("act-101")
  },
  {
    step: 5,
    title: "5/5: Human in the Loop Maintained!",
    text: "The purchase is stopped! ₹12,999 was protected. Now explore the 'Activity Ledger', 'AI Knowledge' (memory purge), and the 'Flipkart APM Submission' tab.",
    actionText: "Finish Demo & Explore",
    targetScreen: "overview"
  }
];

let currentDemoStepIndex = 0;

function startGuidedDemo() {
  currentDemoStepIndex = 0;
  const overlay = document.getElementById("tour-overlay");
  if (overlay) overlay.classList.add("active");
  renderDemoStep();
}

function renderDemoStep() {
  const stepData = DEMO_STEPS[currentDemoStepIndex];
  if (!stepData) {
    closeGuidedDemo();
    return;
  }

  // Switch screen if required
  if (stepData.targetScreen) {
    navigateToScreen(stepData.targetScreen);
  }

  const pill = document.getElementById("tour-step-pill");
  const title = document.getElementById("tour-title");
  const text = document.getElementById("tour-text");
  const actionBtn = document.getElementById("tour-next-btn");
  const dotsContainer = document.getElementById("tour-dots");

  if (pill) pill.textContent = `Step ${stepData.step} of 5`;
  if (title) title.textContent = stepData.title;
  if (text) text.textContent = stepData.text;
  if (actionBtn) actionBtn.textContent = stepData.actionText;

  if (dotsContainer) {
    dotsContainer.innerHTML = DEMO_STEPS.map((_, i) => `
      <span class="tour-dot ${i === currentDemoStepIndex ? 'active' : ''}"></span>
    `).join("");
  }
}

function nextDemoStep() {
  const stepData = DEMO_STEPS[currentDemoStepIndex];
  if (stepData && stepData.autoAction) {
    stepData.autoAction();
  }

  currentDemoStepIndex++;
  if (currentDemoStepIndex >= DEMO_STEPS.length) {
    closeGuidedDemo();
    showToast("Guided Demo Completed", "You now have full control of AI Guardian. Explore the screens!", "success");
  } else {
    renderDemoStep();
  }
}

function closeGuidedDemo() {
  const overlay = document.getElementById("tour-overlay");
  if (overlay) overlay.classList.remove("active");
}

// =============================================================================
// 7. Navigation & Routing (Hash-based)
// =============================================================================

function navigateToScreen(screenId) {
  // Update nav links
  document.querySelectorAll(".nav-item").forEach(link => {
    if (link.getAttribute("data-screen") === screenId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Switch screens
  document.querySelectorAll(".screen-view").forEach(view => {
    if (view.id === `screen-${screenId}`) {
      view.classList.add("active");
    } else {
      view.classList.remove("active");
    }
  });

  // Update Page Title
  const titles = {
    overview: { title: "Executive Overview", subtitle: "Live status of personal AI agents, guardrails, and real-time alerts." },
    approvals: { title: "Action Review & Approval Center", subtitle: "Inspect high-impact autonomous actions awaiting your explicit authorization." },
    permissions: { title: "Agent Permissions & Privacy Firewall", subtitle: "Audit connected agents and toggle access to sensitive sensors and APIs." },
    activity: { title: "Activity History & Trust Ledger", subtitle: "Immutable chronological audit trail of all agent queries, actions, and blocks." },
    knowledge: { title: "Personal Data & Inferred AI Knowledge", subtitle: "Inspect what personal agents have deduced about your psychology and habits." },
    settings: { title: "Protection Rules & Guardrail Settings", subtitle: "Configure automated spending thresholds and sensitive communication policies." },
    "case-study": { title: "Flipkart APM '29 Case Strategy", subtitle: "Product thesis, 2040 paradigm ramifications, and technical implementation breakdown." }
  };

  const titleEl = document.getElementById("current-page-title");
  const subEl = document.getElementById("current-page-subtitle");
  if (titles[screenId]) {
    if (titleEl) titleEl.textContent = titles[screenId].title;
    if (subEl) subEl.textContent = titles[screenId].subtitle;
  }

  // Close mobile sidebar if open
  document.getElementById("sidebar")?.classList.remove("mobile-open");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =============================================================================
// 8. Initialization & Event Listeners
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Setup Nav Click Handlers
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const screenId = item.getAttribute("data-screen");
      if (screenId) {
        window.location.hash = screenId;
        navigateToScreen(screenId);
      }
    });
  });

  // Mobile Menu Toggle
  const mobileBtn = document.getElementById("mobile-menu-toggle");
  const sidebar = document.getElementById("sidebar");
  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open");
    });
  }

  // Search & Filters on Ledger
  const ledgerSearch = document.getElementById("ledger-search-input");
  const agentFilter = document.getElementById("ledger-agent-filter");
  const riskFilter = document.getElementById("ledger-risk-filter");

  if (ledgerSearch) ledgerSearch.addEventListener("input", renderActivityLedgerScreen);
  if (agentFilter) agentFilter.addEventListener("change", renderActivityLedgerScreen);
  if (riskFilter) riskFilter.addEventListener("change", renderActivityLedgerScreen);

  // Initial Route Check
  const currentHash = window.location.hash.replace("#", "") || "overview";
  navigateToScreen(currentHash);

  // Initial Full Render
  renderAllViews();

  // Close modal when clicking outside
  const genericModal = document.getElementById("generic-modal");
  if (genericModal) {
    genericModal.addEventListener("click", (e) => {
      if (e.target === genericModal) {
        closeGenericModal();
      }
    });
  }
});
