---
name: output-verification
description: Complete output verification before system claims reach Tamir. Applies to EVERY agent output, EVERY decision, EVERY claim. Use this skill to implement the 7-gate hallucination prevention system. Executes full verification workflow: extract claims → categorize → verify sources → check confidence → detect contradictions → scan red flags → test falsifiability. Zero hallucinations policy.
---

# Output Verification Skill

## When to Use This

**Apply this to EVERY output before it reaches Tamir:**
- ✅ Agent recommendations
- ✅ Venture decisions
- ✅ Cost estimates
- ✅ Timeline projections
- ✅ Performance claims
- ✅ Market analysis
- ✅ Technical assessments
- ✅ Risk evaluations

**No exceptions. Every output through all 7 gates.**

---

## Quick Reference: The 7 Gates

| Gate | Check | Pass = | Fail = |
|------|-------|--------|--------|
| 1 | Source? | Claim has source | Mark UNVERIFIED |
| 2 | Confidence aligned? | Confidence ≤ Evidence | Downgrade confidence |
| 3 | No contradictions? | No conflicts with known facts | FLAG contradiction |
| 4 | Assumptions explicit? | All assumptions listed | Add assumptions |
| 5 | Internally consistent? | No logical contradictions | Note tension |
| 6 | Data not cherry-picked? | Full picture shown | Show all data |
| 7 | Falsifiable? | Specific, measurable | Make specific |

---

## Complete Verification Workflow

### STEP 1: EXTRACT ALL CLAIMS

Read agent output. List EVERY factual claim:

```
Agent output: "NuDay has strong market traction. 50K users currently, 
will reach 100K in 6 months. ROI is 8x. Costs $500K to scale. 
Team can execute."

CLAIMS EXTRACTED:
1. "Strong market traction"
2. "50K users currently"
3. "Will reach 100K in 6 months"
4. "ROI is 8x"
5. "Costs $500K to scale"
6. "Team can execute"
```

**Nothing hidden. Every claim on the list.**

---

### STEP 2: RUN EACH CLAIM THROUGH ALL 7 GATES

For each claim, run this gate sequence:

```
CLAIM: "50K users currently"

═══════════════════════════════════════

GATE 1: SOURCE REQUIREMENT
Question: Where does this number come from?
Check:
  ☐ Dashboard/database? (live data)
  ☐ Git history? (commit message)
  ☐ Email/meeting notes? (documented)
  ☐ Someone told me? (who? when? source?)
  ☐ I calculated it? (show math)
  ☐ No source found? → UNVERIFIED

Source found: Dashboard, 2026-03-24
Status: ✅ GATE 1 PASS

═══════════════════════════════════════

GATE 2: CONFIDENCE ALIGNMENT
Question: How confident am I? Does that match the evidence?
Evidence strength:
  ☐ Weak evidence (1 source, old data, unclear) → 0-40% confidence
  ☐ Medium evidence (recent, one good source) → 40-75% confidence
  ☐ Strong evidence (multiple sources, verified) → 75-100% confidence

Claimed confidence: "50K users" (stated as fact = 100%)
Evidence strength: Dashboard is current, one source = 75%
Issue: Over-confident by 25%

Fix: Say "approximately 50K users" or "~50K users ±10%"
Status: ⚠️ GATE 2 NEEDS ADJUSTMENT

═══════════════════════════════════════

GATE 3: CONTRADICTION CHECK
Question: Does this contradict any known fact?
Check:
  ☐ Database says 45K users? → CONTRADICTION
  ☐ Previous report said 70K? → CONFLICT (which is current?)
  ☐ No contradictions? → PASS

Result: No contradictions found
Status: ✅ GATE 3 PASS

═══════════════════════════════════════

GATE 4: ASSUMPTION DISCLOSURE
Question: What am I assuming?
Hidden assumptions:
  ☐ Assumes dashboard is accurate
  ☐ Assumes "users" means daily active users (not registered)
  ☐ Assumes measurement was today (not old data)

Action: Add assumptions:
"~50K users (assumptions: daily active, dashboard accurate as of 2026-03-24)"
Status: ⚠️ GATE 4 NEEDS CLARIFICATION

═══════════════════════════════════════

GATE 5: CONSISTENCY CHECK
Question: Is this consistent with other claims?
Other claims:
  • "Strong market traction" ← 50K users is consistent with this ✓
  • "Will reach 100K in 6 months" ← Means 50% growth, consistent ✓
  
Result: No logical contradictions
Status: ✅ GATE 5 PASS

═══════════════════════════════════════

GATE 6: DATA INTEGRITY CHECK
Question: Is full picture shown or is data cherry-picked?
Complete picture:
  ☐ What's the growth trend? (was 40K last month?)
  ☐ What's churn? (losing users too?)
  ☐ What's retention? (are they active?)
  ☐ Any downsides mentioned? (no)

Action: Add context:
"~50K users (monthly growth: +5K/month, retention: 85%)"
Status: ⚠️ GATE 6 NEEDS CONTEXT

═══════════════════════════════════════

GATE 7: FALSIFIABILITY TEST
Question: Is this testable/measurable?
"50K users" - Measurable? YES ✓
  (Can count users on dashboard, verify in 1 minute)
  
Result: Falsifiable
Status: ✅ GATE 7 PASS

═══════════════════════════════════════

SUMMARY FOR CLAIM: "50K users currently"

Gates passed: 4/7 (1, 3, 5, 7)
Gates need work: 3/7 (2, 4, 6)

CLEANED VERSION:
"~50K daily active users (from dashboard 2026-03-24)
 Assumptions: Dashboard is current, counts active users
 Context: +5K/month growth, 85% retention
 Confidence: HIGH (80%, verified data source)"
```

---

### STEP 3: PROCESS ALL CLAIMS, BUILD CLEAN OUTPUT

Do above for EVERY claim in agent output:

```
Claim 1: "Strong market traction"
  Status: VAGUE (not falsifiable)
  Fix: Remove or make specific: "Growing 5K users/month = strong traction"

Claim 2: "50K users currently"
  Status: MEDIUM (4/7 gates)
  Fix: Add confidence, assumptions, context (see above)

Claim 3: "Will reach 100K in 6 months"
  Status: UNVERIFIED (prediction, no basis)
  Fix: "Projected 100K users (assuming 5K/month growth = current trend)"
       "Confidence: MEDIUM (50%) - depends on sustained growth"
       "Risk: If churn increases or growth slows, will miss target"

Claim 4: "ROI is 8x"
  Status: NO SOURCE (where did 8x come from?)
  Fix: Ask for calculation, then mark "ROI estimated 8x (based on...)"

Claim 5: "Costs $500K to scale"
  Status: UNVERIFIED (no breakdown)
  Fix: Get cost breakdown, verify each component

Claim 6: "Team can execute"
  Status: OPINION (not falsifiable)
  Fix: Make falsifiable: "Team has shipped 3 similar projects in past 2 years"
       "Average delivery time: 4 months"
       "Track record: 2 successful, 1 over budget 20%"
```

---

## Red Flag Scan (Quick Check)

If output contains ANY of these → HALLUCINATION LIKELY:

### Red Flag Type 1: Confident False Memory
```
❌ "We tried this before and it worked great"
   But: No git history, no emails, no records

Action: Remove or mark "UNVERIFIED claim: Previous attempt unknown"
```

### Red Flag Type 2: Over-Generalization
```
❌ "All customers want this" (surveyed 2 people)
❌ "95% success rate" (1 success, 1 failure)

Action: Show actual numbers: "2 of customers surveyed want this (sample: 5)"
```

### Red Flag Type 3: Invented Consensus
```
❌ "Everyone agrees this is best"
   But: Only asked 2 people, didn't ask others

Action: "2 of 3 team leads agree" or "Consensus not reached"
```

### Red Flag Type 4: Future Telling
```
❌ "Will definitely succeed 100%"
❌ "Cannot fail"

Action: Add probability, risks: "Likely to succeed (70%), risks: X, Y, Z"
```

### Red Flag Type 5: Confident Approximation
```
❌ "Market size is $5B" (no source, no range)

Action: "Market size estimated $5B (source: Gartner forecast, range: $3-7B)"
```

### Red Flag Type 6: Hidden Assumptions
```
❌ "Timeline 6 weeks" (assumes fixed scope, assumes 5 engineers)

Action: "Timeline 6 weeks (assuming: fixed scope, 5 engineers, no external dependencies)"
```

### Red Flag Type 7: Contradicting Self
```
❌ "Complex project" + "Can do in 1 week" + "High quality required"
   (These are contradictory)

Action: Resolve contradiction or flag: "TENSION: Complex project but short timeline"
```

### Red Flag Type 8: Cherry-Picked Data
```
❌ Shows 1 success, ignores 3 failures
❌ Shows best case, hides worst case

Action: "Success rate: 1/4 (25%), not 100%"
        "Best case: 1 month. Worst case: 4 months. Likely: 2-3 months"
```

### Red Flag Type 9: Vague Claims
```
❌ "Good quality"
❌ "Will disrupt market"
❌ "Have strong team"

Action: Make specific: 
  "Quality score: 8/10 on 8-dimension matrix"
  "Market share goal: 10% in 24 months"
  "Team: 3 founders with 15+ years avg experience in domain"
```

### Red Flag Type 10: Unsourced Specificity
```
❌ "Costs $237,500" (so specific, but where from?)

Action: "Cost estimate: $237.5K ±15% (based on vendor quote from X)"
```

---

## Decision Rules

### If Claim PASSES All 7 Gates:
✅ Include in output to Tamir as-is
✅ Mark with source and confidence level
✅ Example: "50K users ✅ VERIFIED (dashboard 2026-03-24, 80% confidence)"

### If Claim FAILS 1-2 Gates:
⚠️ Include in output but with WARNING
⚠️ Explain what's uncertain
⚠️ Example: "ROI ~8x ⚠️ ESTIMATED (±20%, based on similar projects)"

### If Claim FAILS 3+ Gates or Has Red Flags:
🚫 FLAG for review
🚫 Ask agent to revise
🚫 Do NOT send to Tamir until fixed

### If Claim is FALSE or CONTRADICTS Known Fact:
❌ BLOCK immediately
❌ Ask agent to revise
❌ Never send false information

---

## Output Template

Use this format to send verified output to Tamir:

```
VERIFIED CLAIMS (Gates 4-7 passed, no red flags):
═════════════════════════════════════
• Claim A ✅ [source] [confidence level]
• Claim B ✅ [source] [confidence level]

QUALIFIED CLAIMS (Gates 1-3 passed, some uncertainty):
═════════════════════════════════════
• Claim C ⚠️ [confidence level] [assumptions] [data]
• Claim D ⚠️ [confidence level] [where uncertain]

FLAGGED CLAIMS (Needs revision):
═════════════════════════════════════
• Claim E 🚫 Why: [reason] Action: [fix needed]
• Claim F 🚫 Why: [reason] Action: [fix needed]

RECOMMENDATION:
═════════════════════════════════════
[Final recommendation based on verified claims only]
```

---

## Common Fixes

When gates fail, here's how to fix:

| Problem | Fix |
|---------|-----|
| No source | Find source or mark UNVERIFIED |
| Over-confident | Downgrade confidence to match evidence |
| Contradicts fact | Resolve contradiction or note conflict |
| Hidden assumption | Add assumption to claim |
| Inconsistent | Resolve contradiction in claims |
| Cherry-picked | Show complete data |
| Vague | Make specific and measurable |

---

## Enforcement Rules

1. **Every output through all 7 gates** - No shortcuts
2. **No unlabeled claims** - All marked with confidence/status
3. **No false information** - Contradictions blocked
4. **No hidden assumptions** - All stated explicitly
5. **No unfalsifiable claims** - Make testable
6. **No red flags on critical claims** - High bar for important decisions
7. **Full transparency** - Tamir sees uncertainty, sources, and reasoning

---

## Implementation Checklist

Before ANY output to Tamir:

```
☐ Listed all claims in agent output
☐ Ran each claim through all 7 gates
☐ Resolved failing gates (fixed, dropped, or flagged)
☐ Scanned for red flags (found any? Fix them)
☐ Built cleaned output with confidence levels
☐ Included sources for all verified claims
☐ Included assumptions for all uncertain claims
☐ No false or contradictory information?
☐ No unfalsifiable claims?
☐ No hidden uncertainty?
☐ Ready to send?

If any ☐ unchecked: Not ready yet
If all ☐ checked: Send to Tamir
```

---

## Golden Rule

**DOUBT > CONFIDENCE**

When unsure:
- ❌ Don't hide uncertainty, make it sound certain
- ✅ Do mark as uncertain, explain why

Example:
```
❌ "Market is $1B"
✅ "Market estimated $1B (source: Gartner 2025, range: $750M-$1.2B, confidence: MEDIUM)"

❌ "Will definitely work"
✅ "Success probability: 70% (team experienced, market timing good, funding available)"

❌ "Can do it in 6 weeks"
✅ "Timeline: 6 weeks (assuming: fixed scope, 5 engineers, no dependencies). Confidence: MEDIUM. Risk: If scope grows, add 1-2 weeks."
```

---

## What This Prevents

✅ Confident false memory ("we tried this before")
✅ Over-generalization ("1 sample = all cases")
✅ Invented consensus ("everyone agrees")
✅ Future telling ("will definitely work")
✅ Hidden assumptions ("timeline 6 weeks" without context)
✅ Cherry-picked data (showing good, hiding bad)
✅ Contradictions (conflicting claims)
✅ Vague claims (unmeasurable, unfalsifiable)
✅ Unsourced numbers (pulled from thin air)
✅ False confidence (guessing with certainty)

---

## Remember

**Zero hallucinations reach Tamir.**

Every claim either:
1. ✅ Verified (sourced, confident)
2. ⚠️ Qualified (uncertain, marked)
3. ❌ Blocked (false or too uncertain)

No in-between.

