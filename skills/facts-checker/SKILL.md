---
name: facts-checker
description: Systematic fact-checking and claim verification before outputs reach Tamir. Use when: validating agent claims, verifying data accuracy, checking assumptions, assessing confidence levels, detecting misinformation or unverified speculation. Ensures every factual claim in agent outputs is either verified, qualified with uncertainty, or blocked.
---

# Facts Checker Skill - Comprehensive Fact-Checking Protocol

## Problem

Agents make claims. Not all are true. Not all are fully verified.

Bad: Unverified claim reaches Tamir → wrong decision
Better: Claim is checked → Tamir knows confidence level
Best: Fact is systemically verified → zero doubt

---

## Complete Fact-Checking Protocol

This is a comprehensive, executable protocol that checks EVERY claim before it reaches Tamir.

### Step 1: EXTRACT ALL CLAIMS (Nothing Hidden)

**In agent output, find:**
- Direct statements: "NuDay has 50K users"
- Numerical claims: "Cost is $100K", "Timeline 6 months"
- Projections: "Will grow to 100K", "ROI 8x"
- Qualitative claims: "High quality", "Market-ready"
- Assumptions: "Assuming we hire 5 engineers"
- Recommendations: "Should launch now"

**LIST EVERY CLAIM:**

```
Output: "NuDay has 50K users, costs $500K to scale, will break even in 18 months"

Claims extracted:
1. "NuDay has 50K users"
2. "Costs $500K to scale"
3. "Will break even in 18 months"

Each gets verified separately.
```

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

## COMPREHENSIVE VERIFICATION CHECKLIST

For EVERY claim, run through this checklist:

### 1. FIND THE SOURCE OF TRUTH

Check in this order (highest to lowest reliability):

```
LEVEL 1: Primary Data (Most Reliable)
  ☐ Dashboard/system data (live, real-time)
  ☐ Database records (official source)
  ☐ Transaction logs (immutable)
  ☐ Measurement/testing results

LEVEL 2: Official Documentation (Reliable)
  ☐ Internal specification documents
  ☐ Decision records (architectural decisions)
  ☐ Project requirements (signed off)
  ☐ Contract/SLA documents

LEVEL 3: Git History (Time-stamped Evidence)
  ☐ Commit messages (when decision was made)
  ☐ Code changes (what actually happened)
  ☐ PR discussions (why decision was made)
  ☐ Blame/history (who made decision)

LEVEL 4: Email Records (Documented Communication)
  ☐ Email chains (who agreed to what)
  ☐ Meeting notes (decisions made)
  ☐ Slack messages (conversations)
  ☐ Document edit history (tracking changes)

LEVEL 5: Expert Opinion (Qualified Source)
  ☐ Team lead statement (authority in domain)
  ☐ Technical expert analysis (backed by reasoning)
  ☐ Client feedback (external validation)
  ☐ Market data (if industry standard)

LEVEL 6: Calculation/Logic (Derived)
  ☐ Math is correct (verified independently)
  ☐ Assumptions stated (what's being assumed)
  ☐ Model is sound (methodology is valid)
  ☐ Inputs are verified (data going in is good)

LEVEL 7: Reasonable Assumption (Educated Guess)
  ☐ No contradicting evidence
  ☐ Similar situations support it
  ☐ Explicitly stated as assumption
  ☐ Risk acknowledged if wrong

LEVEL 8: Speculation (Unverified)
  ☐ No evidence found
  ☐ Could be true or false
  ☐ Clearly marked as unverified
  ☐ Flag for Tamir
```

### 2. VERIFY BY CATEGORY

For each claim type:

**HISTORICAL FACT** (happened or exists)
```
☐ Search for primary data (database, dashboard)
☐ Look in git history (when did this happen?)
☐ Check email records (who mentioned it?)
☐ Cross-reference with multiple sources
☐ If sources conflict: FLAG as CONFLICT
☐ If all agree: Mark VERIFIED
☐ If no source found: Mark UNVERIFIED
```

**NUMERICAL CLAIM** (cost, count, date)
```
☐ Find original source of number
☐ Verify unit (dollars? euros? thousands?)
☐ Check for rounding/approximation
☐ Look for more recent data (is this old?)
☐ If multiple versions: Which is most current?
☐ If still valid: Mark with source & date
☐ If outdated: Mark as OLD - get new data
```

**DERIVED FACT** (calculated, projected)
```
☐ Get the formula/model (how was this calculated?)
☐ Verify inputs are correct (data going in)
☐ Re-calculate independently (do you get same result?)
☐ Check assumptions (what's being assumed?)
☐ Check sensitivity (what if assumptions are wrong?)
☐ If math is right but assumptions wrong: FLAG assumptions
☐ Mark confidence based on input quality
```

**OPINION/JUDGMENT** (feasible, good, risky)
```
☐ Who is the expert? (are they qualified?)
☐ What's their track record? (have they been right before?)
☐ What's their reasoning? (why do they think this?)
☐ Do other experts agree? (is this consensus?)
☐ What's at stake if wrong? (how risky?)
☐ Mark as OPINION with qualifier (1 expert, 3 experts, consensus)
```

**ASSUMPTION** (if X happens, if we have Y)
```
☐ Is assumption stated clearly? (do we know what's being assumed?)
☐ Is it realistic? (is this reasonable?)
☐ What if it's wrong? (what's the fallback?)
☐ Are there alternatives? (what if we assume Z instead?)
☐ Mark as ASSUMPTION: [what], [confidence], [fallback]
```

### 3. CONFLICT DETECTION

If you find contradicting information:

```
EXAMPLE:
Agent says: "Project cost is $100K"
Git history: "Initial estimate was $150K"
Email: "Final quote from vendor is $120K"

ACTION:
☐ Note all versions
☐ Find most recent date
☐ Ask: Why did it change?
☐ Determine which is current
☐ REPORT TO TAMIR: 
  "Estimates vary: Initial $150K → Vendor quote $120K → Agent says $100K"
  "Status: CONFLICTING. Need clarification on which is current."
```

### 4. RED FLAG SCAN

For each claim, check for red flags:

```
☐ Impossibly optimistic? ("10x in 2 weeks")
☐ No basis provided? (claim with no source)
☐ Contradicts known facts? (conflicts with database)
☐ Missing critical context? (leaves out important detail)
☐ Uses weasel words? ("should", "might", "probably means")
☐ Over-confident language? ("definitely", "100% sure")
☐ Unqualified person claiming expertise? (non-expert authority)
☐ Motivation to exaggerate? (does agent benefit from this claim?)
☐ Cherry-picked data? (ignoring contradicting data)
☐ Extrapolating too far? (basing prediction on limited data)

If 2+ red flags: FLAG for review
If 3+ red flags: BLOCK until clarified
```

### 5. CONFIDENCE ASSIGNMENT

Based on evidence:

```
☐ VERIFIED (100%) 
     Multiple sources confirm, no contradiction
     Example: Dashboard shows 50K users (live data)

☐ LIKELY (75-90%)
     Primary source available, recent, no contradiction
     Example: Project cost from latest vendor quote

☐ PROBABLE (60-75%)
     Reasonable basis, some supporting evidence
     Example: Timeline based on team experience

☐ UNCERTAIN (40-60%)
     Educated guess, some support but could be wrong
     Example: Market growth estimate assuming 20% MoM

☐ UNVERIFIED (20-40%)
     No source found but not contradicted
     Example: "Will be market-ready by Q2" (not verified)

☐ UNLIKELY (<20%)
     Evidence suggests it's false or unrealistic
     Example: "Will 10x in 6 weeks" (contradicts historical data)

☐ FALSE (0%)
     Directly contradicted by verified fact
     Example: "Budget is $100K" when budget is actually $50K
```

### 6. DOCUMENT FINDINGS

For EVERY claim, create verification record:

```
CLAIM: [exact text of claim]
CATEGORY: [Historical / Numerical / Derived / Opinion / Assumption]
SOURCES CHECKED:
  ☐ Primary data: [found/not found] → [what was found]
  ☐ Git history: [found/not found] → [commit, date]
  ☐ Email: [found/not found] → [date, who said it]
  ☐ Documentation: [found/not found] → [file, section]
  ☐ Expert opinion: [found/not found] → [who, when]

EVIDENCE:
  [What supports this claim?]
  [What contradicts this claim?]

CONFIDENCE LEVEL: [100% / 75% / 60% / 40% / 20% / 0%]

STATUS: [VERIFIED / LIKELY / PROBABLE / UNCERTAIN / UNVERIFIED / FALSE]

RED FLAGS: [None / List any red flags found]

CONFLICTS: [None / Describe any contradictions]

ASSUMPTION ANALYSIS:
  If derived: [Assumptions → Risk if wrong → Fallback]

RECOMMENDATION:
  [Include as-is / Include with qualifier / Ask for source / BLOCK]

NOTES: [Anything important for Tamir to know?]
```

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

## FINAL PROCESS: Before Sending to Tamir

### Complete Pre-Send Checklist

**FOR EVERY SINGLE CLAIM in agent output:**

```
CLAIM VERIFICATION WORKFLOW:

Step 1: EXTRACT
  ☐ Is this a factual claim? (not opinion/style)
  ☐ Noted exact wording

Step 2: CATEGORIZE
  ☐ Type: [Historical / Numerical / Derived / Opinion / Assumption]
  ☐ Criticality: [Normal / Important / Critical]

Step 3: SEARCH FOR EVIDENCE
  ☐ Level 1: Primary data checked
  ☐ Level 2: Official docs checked
  ☐ Level 3: Git history checked
  ☐ Level 4: Email records checked
  ☐ Level 5: Expert opinion checked
  ☐ Level 6: Calculation verified (if derived)
  ☐ Level 7: Assumptions stated (if assumption)

Step 4: ASSESS CONFLICTS
  ☐ Does this contradict any known fact? YES/NO
  ☐ If YES: Document both versions, note dates
  ☐ If NO: Continue

Step 5: RED FLAG SCAN
  ☐ Found any red flags? YES/NO
  ☐ If YES: How many? Count them.

Step 6: ASSIGN CONFIDENCE
  ☐ Confidence level: [100% / 75% / 60% / 40% / 20% / 0%]
  ☐ Based on: [evidence found]

Step 7: DETERMINE STATUS
  ☐ Status: [VERIFIED / LIKELY / PROBABLE / UNCERTAIN / UNVERIFIED / FALSE]

Step 8: DECIDE ACTION
  ☐ If VERIFIED: Include as-is, note source
  ☐ If LIKELY/PROBABLE: Include with qualifier
  ☐ If UNCERTAIN: Include with "estimate/approximately"
  ☐ If UNVERIFIED: Flag for Tamir, ask for source
  ☐ If FALSE: BLOCK, ask for revision
```

**MASTER CHECKLIST:**

```
After running above 8 steps for ALL claims:

☐ No claims are FALSE/blocked (unless asked for revision)
☐ All VERIFIED claims include source reference
☐ All LIKELY/PROBABLE claims marked with confidence level
☐ All UNCERTAIN claims marked as estimate/assumption
☐ All UNVERIFIED claims flagged with "unverified" label
☐ All red flags documented
☐ All conflicts documented
☐ Critical claims are at least LIKELY (not UNVERIFIED)
☐ Assumptions explicitly stated where present
☐ No hidden uncertainty (everything is labeled)
☐ Tamir can see exactly what's verified and what's not

FINAL QUESTION: 
"If I read only the confidence labels, would I know which claims to trust?"

If YES → Ready to send
If NO → More labeling needed
```

---

## Key Rules

### Rule 1: Every Claim Gets a Label
```
No unlabeled claims reach Tamir.
Every claim is marked:
  ✅ VERIFIED (100% - source documented)
  ⚠️ LIKELY (75% - good evidence)
  ⚠️ PROBABLE (60% - reasonable basis)
  ⚠️ UNCERTAIN (40% - educated guess)
  ⚠️⚠️ UNVERIFIED (20% - no evidence found)
  ❌ BLOCKED (0% - contradicted or unrealistic)

No exceptions. No unlabeled claims.
```

### Rule 2: Critical Claims Have Higher Bar
```
Critical claims (project approval, go/kill, budget allocation):
  Must be at least LIKELY (75%+)
  Cannot be UNVERIFIED
  Cannot be UNCERTAIN
  
If critical claim is less than LIKELY:
  → ASK FOR MORE EVIDENCE
  → Or BLOCK until verified
```

### Rule 3: Transparency Over Certainty
```
Better: "Cost estimate: $100K ±20% (based on 3 similar projects)"
Worse: "Cost is $100K"

Better: "Timeline 6 months (assuming we hire 5 engineers)"
Worse: "Timeline is 6 months"

Better: "Market size ~$1B (UNVERIFIED - based on Gartner forecast)"
Worse: "Market is $1B"

Tamir makes better decisions with honest uncertainty
than with fake certainty.
```

### Rule 4: Chain of Evidence
```
Every claim links back to source:
  "NuDay has 50K users ✅ (VERIFIED, dashboard 2026-03-24)"
  
Not: "NuDay has 50K users ✅"

Include:
  - What is verified
  - Where it came from
  - When it was checked
  - Who confirmed it
```

### Rule 5: Conflict Resolution
```
If sources disagree:
  1. List all versions
  2. Note dates/sources
  3. Mark as CONFLICT
  4. Tell Tamir which is most recent
  5. Ask which to use

Example:
"Cost estimate: CONFLICT
  - Initial (2026-01-15): $150K
  - Vendor quote (2026-03-10): $120K
  - Agent claim (2026-03-24): $100K
Status: Unclear which is current. Need clarification."
```

### Rule 6: Zero Tolerance for Red Flags on Critical Claims
```
If claim is critical AND has red flags:
  Count red flags
  
  1 red flag → Mark as WARNING, ask for clarification
  2+ red flags → BLOCK, ask for revision
  
No critical claims go to Tamir with red flags.
```

---

## Summary

**Before any claim reaches Tamir:**

1. ✅ EXTRACT it from agent output
2. ✅ CATEGORIZE it (historical/numerical/derived/opinion/assumption)
3. ✅ VERIFY it (search all 7 levels of evidence)
4. ✅ CONFLICT check (does it contradict anything?)
5. ✅ RED FLAG scan (is something suspicious?)
6. ✅ ASSIGN confidence (100% / 75% / 60% / 40% / 20% / 0%)
7. ✅ LABEL it clearly (with source, date, confidence)
8. ✅ DOCUMENT findings (so Tamir can verify)

**Zero unlabeled claims.**
**Zero hidden uncertainty.**
**Zero red flags on critical claims.**

