---
name: agent-hierarchy
description: Agent hierarchy system with validation layers for error detection, process enforcement, and conflict resolution. Use when: managing multiple agents working on same task, need to catch errors before they reach user, verify facts/recommendations, detect procedural conflicts, identify contradicting requests or interests, ensure agent outputs are consistent. Prevents bad advice from reaching Tamir by adding validation tiers.
---

# Agent Hierarchy & Validation System

## Problem

Current system: 36 agents work independently → errors reach you directly

Better: Agents in hierarchy with validation layers that catch errors before they reach you

---

## Hierarchy Structure

```
TAMIR (Final Decision)
    ↑ (approval/feedback)
    │
VALIDATION LAYER (Checks everything)
├─ Error Checker (catches mistakes)
├─ Conflict Detector (finds contradictions)
├─ Fact Verifier (validates claims)
├─ Process Auditor (checks procedures)
└─ Interest Analyzer (detects conflicts of interest)
    ↑ (escalations)
    │
EXECUTION LAYER (36 agents)
├─ Infrastructure (12)
├─ Specialists (7)
└─ Execution (13)
    ↑ (raw output)
    │
DATA/CONTEXT LAYER
└─ Projects, decisions, history
```

---

## Validation Layer Components

### 1. Error Checker
**What it does:** Catches logical errors, factual mistakes, inconsistencies

**Checks:**
- Internal contradictions ("Agent A says X, Agent B says not-X")
- Logical fallacies ("If we do Y, we can't do Z" but both are planned)
- Missing context (recommendation ignores known constraint)
- Mathematical errors (costs don't add up)
- Factual claims (are they supported by data?)

**Example:**
```
Agent 1: "Project costs $100K"
Agent 2: "Project costs $150K"
Error Checker: "CONFLICT - same project, different costs. Need resolution."
```

### 2. Conflict Detector
**What it does:** Finds contradictory decisions, competing interests

**Checks:**
- Agent A recommends X, Agent B recommends not-X
- Two agents claim authority over same decision
- Procedural conflicts (order of operations wrong)
- Resource conflicts (both agents claim same resource)
- Timeline conflicts (dependencies don't work)

**Example:**
```
Agent 1: "Start execution immediately"
Agent 2: "Wait for approval first"
Conflict Detector: "PROCEDURAL CONFLICT - execution order unclear"
```

### 3. Fact Verifier
**What it does:** Validates factual claims before they reach you

**Checks:**
- "Is this claim supported by data?"
- "Did agent cite sources?"
- "Are assumptions stated?"
- "Is this guesswork or fact?"

**Example:**
```
Agent: "NuDay has 50K users"
Fact Verifier: "UNVERIFIED - where's this data from? Check git history/emails"
```

### 4. Process Auditor
**What it does:** Ensures agents follow correct procedures

**Checks:**
- Did agent follow escalation rules?
- Did agent respect authority hierarchy?
- Did agent wait for required approvals?
- Did agent document decisions?

**Example:**
```
Agent: Recommends killing $500K project without escalation
Process Auditor: "ESCALATION REQUIRED - needs Tamir approval for projects >$100K"
```

### 5. Interest Analyzer
**What it does:** Detects conflicts of interest, biased recommendations

**Checks:**
- Is agent recommending something that benefits it?
- Is agent downplaying risks to get approved?
- Is agent pushing its own agenda vs. objective analysis?
- Is agent hiding relevant information?

**Example:**
```
Cost Agent: "My system is 100% accurate, no need for second opinion"
Interest Analyzer: "BIAS DETECTED - agent recommending only itself. Suggest independent verification"
```

---

## How It Works

### Flow

```
Agent generates output
    ↓
Validation Layer checks:
  1. Error Checker: Any mistakes?
  2. Conflict Detector: Contradictions?
  3. Fact Verifier: Are claims true?
  4. Process Auditor: Rules followed?
  5. Interest Analyzer: Any bias?
    ↓
If ALL checks pass → Output to Tamir (marked as "VALIDATED")
If ANY check fails → Output flagged + escalated for review
```

### Three Types of Outputs

#### 1. ✅ VALIDATED (Green)
- All checks passed
- Can send to Tamir immediately
- No errors, conflicts, or bias detected

#### 2. ⚠️ FLAGGED (Yellow)
- Some issues found but not blocking
- Send to Tamir WITH NOTES about issues
- Agent should respond to concerns
- Example: "Fact unverified but logically sound"

#### 3. ❌ BLOCKED (Red)
- Critical error, conflict, or violation
- MUST be resolved before sending
- Escalate to Tamir for decision
- Example: "Contradicts mandatory safety requirement"

---

## Authority Hierarchy

```
Level 0: Data (facts, history, known constraints)
    ↓
Level 1: Checker Agents (find errors)
    ↓
Level 2: Execution Agents (make recommendations)
    ↓
Level 3: Specialist Agents (domain expertise)
    ↓
Level 4: Infrastructure Agents (cross-cutting concerns)
    ↓
Level 5: Tamir (final decision)
```

**Authority rule:** Lower levels cannot override higher levels.

Example: Execution Agent cannot say "ignore the cost constraint"

---

## Procedure for Handling Issues

### When Error Checker Finds Mistake

```
1. Flag output as BLOCKED
2. Identify which agent made error
3. Get explanation from agent: "Why did you say X?"
4. Fix the error
5. Re-validate
6. Send to Tamir only after revalidation
```

### When Conflict Detector Finds Contradiction

```
1. Flag as FLAGGED (needs resolution)
2. Bring both agents into discussion
3. Ask: "Which is correct and why?"
4. Get supporting evidence from each
5. Escalate to Tamir if agents disagree
6. Document resolution for future reference
```

### When Fact Verifier Doubts Claim

```
1. Flag as FLAGGED with uncertainty level
2. Ask agent: "Source for this claim?"
3. If source found: Mark as VERIFIED
4. If source unclear: Mark as UNVERIFIED
5. Send to Tamir with confidence level
```

### When Process Auditor Finds Violation

```
1. Flag as BLOCKED (safety/authority issue)
2. Explain violation to agent
3. Agent must follow correct procedure
4. Re-validate after correct procedure
5. Never bypass procedural requirements
```

### When Interest Analyzer Detects Bias

```
1. Flag as FLAGGED with bias note
2. Request independent verification
3. Get second opinion from different agent
4. Compare outputs
5. Send both to Tamir with bias disclosure
```

---

## Checklist Before Sending Anything to Tamir

- [ ] Error Checker: No logical errors?
- [ ] Conflict Detector: No contradictions?
- [ ] Fact Verifier: Claims verified or marked unverified?
- [ ] Process Auditor: All procedures followed?
- [ ] Interest Analyzer: No hidden bias?
- [ ] Classification: GREEN/YELLOW/RED?

Only send if ALL are satisfied.

---

## Benefits

✅ **Catch errors before reaching Tamir** - Validation layer filters bad advice
✅ **Transparency** - Know which checks passed/failed
✅ **Learning** - Each caught error improves system
✅ **Consistency** - Same rules every time
✅ **Trust** - Tamir knows output is vetted
✅ **Efficiency** - Focus on validated recommendations

---

## Implementation Phases

**Phase 1 (Now):** Error Checker + Conflict Detector
**Phase 2:** Fact Verifier + Process Auditor  
**Phase 3:** Interest Analyzer
**Phase 4:** Automated escalation rules

