---
name: facts-checker
description: Systematic fact-checking and claim verification before outputs reach Tamir. Use when: validating agent claims, verifying data accuracy, checking assumptions, assessing confidence levels, detecting misinformation or unverified speculation. Ensures every factual claim in agent outputs is either verified, qualified with uncertainty, or blocked.
---

# Facts Checker Skill

## Problem

Agents make claims. Not all are true.

Bad: Claim reaches Tamir without verification → Tamir makes decision based on false information

Good: Claim is checked before it reaches Tamir → Tamir only gets verified facts

---

## Fact Categories & How to Verify

### Category 1: Historical Facts (Happened/Exists)

**Examples:**
- "NuDay has 50K users"
- "Project cost was $100K"
- "Launch date is March 2026"

**How to verify:**
1. Check git history / commit messages
2. Check spreadsheets / internal data
3. Check email records / previous decisions
4. Ask: "Where did this number come from?"
5. If multiple sources agree → VERIFIED
6. If sources disagree → CONFLICT (needs resolution)
7. If no source → UNVERIFIED

**Status levels:**
```
VERIFIED (100% confident)
  └─ Multiple sources confirm
  └─ Primary source is authoritative
  └─ Data matches reality

LIKELY (80%+ confident)
  └─ One good source confirms
  └─ No contradicting information
  └─ Reasonable assumption

UNCERTAIN (50% confident)
  └─ Some indication but not confirmed
  └─ Could go either way
  └─ Need more data

UNLIKELY (20% confident)
  └─ Contradicted by evidence
  └─ Sources are weak
  └─ Contradicts known facts

UNVERIFIED (0% - we don't know)
  └─ No sources found
  └─ Not contradicted either
  └─ Could be true or false
```

### Category 2: Derived Facts (Calculated/Inferred)

**Examples:**
- "If we add 5 engineers, timeline becomes 8 weeks"
- "Cost per unit is $2.50"
- "ROI will be 8x over 24 months"

**How to verify:**
1. Check calculation method
2. Verify assumptions are stated
3. Verify data inputs are accurate
4. Check for math errors
5. Verify logic is sound

**Status levels:**
```
LOGICALLY SOUND (method is correct)
  └─ Calculation method verified
  └─ No math errors
  └─ Assumptions are reasonable

MATH CHECK (numbers correct)
  └─ Re-calculate independently
  └─ Same result → VERIFIED
  └─ Different result → ERROR

ASSUMPTION CHECK (are premises true?)
  └─ "If we add 5 engineers" → is that possible?
  └─ "At $2.50/unit" → is that market rate?
  └─ "In 24 months" → is timeline realistic?
```

### Category 3: Expert Opinions (Judgment Calls)

**Examples:**
- "This design is beautiful"
- "NuDay will succeed"
- "This approach is feasible"

**How to verify:**
1. Is expert qualified?
2. Is reasoning provided?
3. Do other experts agree?
4. Are assumptions stated?
5. What's the confidence level?

**Status levels:**
```
EXPERT CONSENSUS (multiple experts agree)
  └─ 3+ qualified people say same thing
  └─ Different approaches, same conclusion
  └─ Confidence: HIGH

EXPERT OPINION (one qualified source)
  └─ Domain expert with track record
  └─ Reasoning provided
  └─ Confidence: MEDIUM

UNQUALIFIED OPINION (guess)
  └─ Person has no expertise
  └─ No reasoning provided
  └─ Confidence: LOW → BLOCK
```

### Category 4: Assumptions (Things We're Assuming)

**Examples:**
- "We assume market size is $1B"
- "We assume team can execute"
- "We assume timeline is realistic"

**How to verify:**
1. Is assumption stated explicitly?
2. Is it necessary for the conclusion?
3. Is it reasonable?
4. Are alternatives considered?

**Status levels:**
```
VERIFIED ASSUMPTION (backed by data)
  └─ Evidence supports it
  └─ Reasonable constraints
  
REASONABLE ASSUMPTION (seems logical)
  └─ No contradicting evidence
  └─ Similar situations support it
  └─ Mark as: "Assuming..."

RISKY ASSUMPTION (questionable)
  └─ Limited support
  └─ Could be wrong
  └─ Mark as: "RISKY - if this is wrong, conclusion fails"

INVALID ASSUMPTION (contradicted)
  └─ Evidence says it's false
  └─ BLOCK the claim
  └─ Ask for reworking
```

---

## Fact-Checking Process

### Step 1: Identify All Claims

In agent output, list every factual claim:

```
Agent output: "NuDay has 50K users, will grow to 100K in 6 months, 
ROI is 8x, costs $500K to scale"

Claims:
1. "NuDay has 50K users" (historical fact)
2. "Will grow to 100K in 6 months" (prediction)
3. "ROI is 8x" (derived fact)
4. "Costs $500K to scale" (cost claim)
```

### Step 2: Classify Each Claim

```
Claim 1: Historical fact → needs data source
Claim 2: Prediction → needs basis (model? assumption?)
Claim 3: Calculation → needs formula verification
Claim 4: Cost estimate → needs breakdown
```

### Step 3: Find Evidence

For each claim, search:
- Git history / commits
- Internal docs / spreadsheets
- Email records
- Previous decisions
- Market data
- Calculations

### Step 4: Assign Status

For each claim:
```
VERIFIED ✅     → Include in output, mark as certain
LIKELY ⚠️       → Include with qualifier: "Likely: ..."
UNCERTAIN ⚠️⚠️  → Include with qualifier: "Estimate: ..."
UNVERIFIED ⚠️⚠️⚠️ → Include with disclaimer: "Unverified claim: ..."
FALSE ❌        → BLOCK claim, ask for revision
```

### Step 5: Flag for Tamir

Mark each claim with confidence:

```
✅ VERIFIED: NuDay has 50K users (from dashboard, 2026-03-20)
⚠️  ESTIMATED: Growth to 100K (based on 15% MoM assumption)
❌ UNVERIFIED: ROI 8x (no data provided)
```

---

## Confidence Scoring Matrix

| Confidence | Definition | Example | Include? |
|---|---|---|---|
| ✅ 100% | Multiple sources, no contradiction | "Launch date is March 2026" | YES, mark VERIFIED |
| ✅ 80% | One good source, no contradiction | "Market size ~$1B" | YES, mark LIKELY |
| ⚠️ 60% | Reasonable assumption, some support | "Timeline 8 weeks" | YES, mark ESTIMATED |
| ⚠️ 40% | Weak evidence, could be wrong | "Success probability 70%" | YES, mark UNCERTAIN |
| ❌ 20% | Contradicted or speculative | "This will definitely work" | NO, ask for revision |
| ❌ 0% | Directly false or impossible | "Will 10x in 2 weeks" | BLOCK |

---

## Red Flags: When to Block a Claim

### 🚫 Block Immediately If:

1. **Contradicts known facts**
   - Agent says: "Cost is $100K"
   - Known: "Budget is $50K"
   - Action: BLOCK, flag contradiction

2. **Impossibly optimistic**
   - Agent says: "Will 10x in 2 weeks"
   - Historical: "Similar projects take 6 months"
   - Action: BLOCK, ask for realistic timeline

3. **No basis provided**
   - Agent says: "This will succeed"
   - No data, no reasoning
   - Action: BLOCK, ask for evidence

4. **Mathematically wrong**
   - Agent says: "5 engineers × 10 weeks = 50 engineer-weeks"
   - Correct: "5 × 10 = 50" ✓ but capacity check needed
   - Action: Check feasibility

5. **Violates constraints**
   - Agent says: "Allocate $200K budget"
   - Constraint: "Max $100K available"
   - Action: BLOCK

6. **Assumes false precondition**
   - Agent says: "If we have 10 engineers..."
   - Reality: "We have 5 engineers"
   - Action: BLOCK, ask for valid scenario

---

## Fact-Checking Template

Use for every claim:

```
CLAIM: [What is the claim?]
CATEGORY: [Historical / Derived / Opinion / Assumption]
SOURCE SEARCH:
  - Git history: [Found / Not found]
  - Internal data: [Found / Not found]
  - Email records: [Found / Not found]
  - Other sources: [Found / Not found]

EVIDENCE:
  [What supports this?]
  [What contradicts this?]

STATUS: [VERIFIED / LIKELY / UNCERTAIN / UNVERIFIED / FALSE]
CONFIDENCE: [%]
ACTION: [Include as-is / Include with qualifier / BLOCK]
NOTES: [Anything important?]
```

---

## How to Mark Claims in Output

### ✅ Verified Claim
```
"NuDay has 50K users" ✅ (VERIFIED from dashboard, 2026-03-20)
```

### ⚠️ Estimated Claim
```
"Growth to 100K users" ⚠️ (ESTIMATED assuming 15% monthly growth)
```

### ⚠️⚠️ Uncertain Claim
```
"ROI will be 8x" ⚠️⚠️ (UNCERTAIN - based on unverified assumptions)
```

### ❌ Unverified / Blocked Claim
```
"This will definitely succeed" ❌ (UNVERIFIED - requires evidence)
```

---

## Sources of Truth (In Order)

When verifying facts, check in this order:

1. **Primary data** (dashboards, real data)
2. **Documentation** (internal docs, specs)
3. **Git history** (previous decisions, changes)
4. **Email records** (previous agreements)
5. **Market data** (public sources)
6. **Expert opinion** (qualified people)
7. **Reasonable assumptions** (if stated)
8. **Speculation** (BLOCK if unverified)

---

## Conflicts: When Sources Disagree

If sources contradict:

```
Agent says: "Cost is $100K"
Previous estimate: "$150K"
Quote from vendor: "$120K"

Action:
1. Flag as CONFLICT
2. Ask agent: "Which source is most recent?"
3. Verify which is correct
4. Present all versions to Tamir:
   "Estimates range $100-150K. Most recent: $120K"
```

---

## Uncertainty & Disclaimers

Never hide uncertainty. Always qualify claims:

❌ **Don't say:** "Cost is $100K"
✅ **Say:** "Cost estimate is $100K ±20% (based on 3 similar projects)"

❌ **Don't say:** "We will grow 10x"
✅ **Say:** "Growth projection: 10x (assuming 20% MoM, strong product-market fit)"

❌ **Don't say:** "This will work"
✅ **Say:** "Probability of success: 70% (based on team experience, market conditions)"

---

## Process: Before Sending to Tamir

Checklist for Facts Checker:

- [ ] Listed all factual claims in output
- [ ] Classified each claim (historical / derived / opinion / assumption)
- [ ] Searched for evidence for each claim
- [ ] Assigned confidence level to each
- [ ] Identified any contradictions with known facts
- [ ] Blocked any unverified critical claims
- [ ] Marked remaining claims with uncertainty level
- [ ] Explained basis for all estimates
- [ ] No impossible/unrealistic claims?
- [ ] Ready to send?

---

## Key Rule

**No claim reaches Tamir without one of these:**
1. ✅ VERIFIED (source confirmed)
2. ⚠️ QUALIFIED (marked with confidence level)
3. ❌ BLOCKED (too uncertain, ask for revision)

There is no "I don't know" that goes unlabeled.

