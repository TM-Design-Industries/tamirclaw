---
name: hallucination-prevention
description: Comprehensive system to prevent AI hallucinations, false claims, and unfounded speculation. Use before ANY output reaches Tamir. Implements 7 gates that catch: fabricated facts, unverified claims, confident false statements, contradiction of known facts, cherry-picked data, unsupported assumptions, and confidence without evidence. This is the final quality gate before system output.
---

# Hallucination Prevention System

## What is an AI Hallucination?

**Hallucination** = AI confidently stating something false or unsupported as if it's true.

Examples:
- ❌ "Market size is $1B" (no data)
- ❌ "Will succeed with 99% probability" (no basis)
- ❌ "Similar project cost $50K" (actually cost $200K, AI forgot)
- ❌ "Customers want this" (no customer feedback)

**Cost of hallucination:** Tamir makes wrong decision based on false information.

**Prevention:** 7 gates catch hallucinations before they reach Tamir.

---

## The 7 Hallucination Prevention Gates

### GATE 1: Source Requirement

**Rule:** No claim without source.

**Test for every claim:**
```
Claim: "NuDay has 50K users"

Questions:
☐ Where did this come from?
☐ Is there a data source?
☐ Was it measured/counted?
☐ When was it measured (date)?

If no source found:
  → Mark as UNVERIFIED
  → Ask agent: "Where is this from?"
  → Do NOT send to Tamir without source

If source found:
  → Note the source
  → Include in output with source attribution
```

**Red flag:** Agent makes specific number without source → HALLUCINATION

---

### GATE 2: Confidence Alignment

**Rule:** Confidence must match evidence strength.

**Test:**
```
Claim: "Project will succeed"
Confidence stated: "100% certain"

Check:
☐ Is there evidence? (Research? Data? Track record?)
☐ How strong is evidence? (One opinion? Multiple sources?)
☐ What could go wrong? (List risks)
☐ Is 100% justified?

Red flags:
  ❌ 100% confident + weak evidence = HALLUCINATION
  ❌ "Definitely will work" + no data = HALLUCINATION
  ❌ "Guaranteed success" + unproven approach = HALLUCINATION

Fix:
  Instead of: "Will succeed 100%"
  Say: "Likely to succeed (75% confidence) based on team track record"
```

**Golden rule:** Confidence level ≤ Evidence strength

---

### GATE 3: Contradiction Check

**Rule:** Cannot contradict known facts.

**Test:**
```
Claim: "Budget is $100K"
Known fact: "Budget limit is $50K"

Check:
☐ Does this claim contradict any known fact?
☐ Is there a version conflict? (old vs new)
☐ Am I misremembering?

If contradiction found:
  → STOP
  → Resolve contradiction
  → Ask: "Which is correct and why?"
  → Do NOT send both versions without explanation

Example:
  Instead of: "Cost $100K" (ignoring $50K budget)
  Say: "Cost estimate $100K exceeds $50K budget by 2x - need approval"
```

**Red flag:** Stating fact that contradicts reality → HALLUCINATION

---

### GATE 4: Assumption Disclosure

**Rule:** Every assumption must be explicit.

**Test:**
```
Claim: "Timeline is 8 weeks"

Hidden assumptions:
  • Assume we have 5 engineers
  • Assume no scope changes
  • Assume no dependencies
  • Assume standard tools available

Check:
☐ What assumptions underlie this claim?
☐ Are assumptions reasonable?
☐ What if assumptions are wrong?
☐ Are assumptions stated clearly?

Fix:
  Instead of: "Timeline is 8 weeks"
  Say: "Timeline is 8 weeks (assuming: 5 engineers, fixed scope, no external dependencies)"
  
  Also add: "If scope changes, add 2-3 weeks per change"
```

**Red flag:** Making claim that depends on hidden assumptions → HALLUCINATION

---

### GATE 5: Consistency Check

**Rule:** Agent's claims must be internally consistent.

**Test:**
```
Agent claims:
  1. "Project is complex"
  2. "Can be done in 1 week"
  3. "High quality required"
  4. "5 engineers assigned"

Check for contradictions:
  ☐ Complex project + 1 week = realistic? NO
  ☐ High quality + 1 week = possible? NO
  ☐ 5 engineers + 1 week = enough time for complex work? NO

Red flag: Internally contradictory claims → HALLUCINATION

Fix: Make claims consistent, or explicitly note the tension:
  "Project is complex (3-month effort) but stakeholders want 1-week MVP.
   RISK: Quality will suffer if timeline is forced."
```

**Golden rule:** All claims in one output must be logically consistent.

---

### GATE 6: Data Integrity Check

**Rule:** Cannot cherry-pick data to support false narrative.

**Test:**
```
Agent says: "This approach has 95% success rate"

Check:
☐ What's the data source?
☐ How many cases in sample? (1 case ≠ 95%)
☐ Are there failures being hidden?
☐ Time period? (old data?)
☐ Context? (similar situation?)

Red flags:
  ❌ One success = "95% success rate" → HALLUCINATION
  ❌ Ignoring 3 failures to claim 1 success = 100% → HALLUCINATION
  ❌ "Most customers like it" (surveyed 2 people) → HALLUCINATION
```

**Fix:**
  Instead of: "Has 95% success rate"
  Say: "In 20 similar projects, 19 succeeded (95%), 1 failed. Sample size: 20."
       "Most recent project: Succeeded. Track record: Mixed."

---

### GATE 7: Falsifiability Test

**Rule:** Claims must be checkable against reality.

**Test:**
```
Claim: "Team can execute this"

Falsifiable?
  ✅ "Team has shipped 5 products of similar complexity in past 2 years"
     (can verify: check their GitHub)
  ❌ "Team is great" (vague, unfalsifiable)

Claim: "Will disrupt the market"

Falsifiable?
  ❌ "Will disrupt market" (too vague)
  ✅ "Will capture 10% market share within 2 years"
     (can measure: check sales data in 2 years)
```

**Red flag:** Unfalsifiable claims (cannot be proven true or false) → HALLUCINATION

**Fix:** Make claims specific enough to verify:
  Instead of: "Will succeed"
  Say: "Will reach 10K users in 6 months" (measurable)

---

## Full Prevention Workflow

Before ANY claim reaches Tamir, run:

```
For EVERY claim in agent output:

1. GATE 1: Source?
   ☐ Found source
   ☐ No source → mark UNVERIFIED

2. GATE 2: Confidence aligned?
   ☐ Confidence matches evidence
   ☐ Over-confident → downgrade confidence

3. GATE 3: No contradictions?
   ☐ No contradictions found
   ☐ Contradiction found → FLAG

4. GATE 4: Assumptions explicit?
   ☐ Assumptions listed
   ☐ Hidden assumptions → add them

5. GATE 5: Internally consistent?
   ☐ All claims align
   ☐ Contradiction → note tension

6. GATE 6: Data not cherry-picked?
   ☐ Full context provided
   ☐ Cherry-picked → show complete data

7. GATE 7: Falsifiable?
   ☐ Specific, measurable
   ☐ Vague → make specific

Result: CLEANED OUTPUT (hallucination-free)
```

---

## Common Hallucination Patterns

### Pattern 1: Confident False Memory
```
AI: "We tried this before and it worked great"
Reality: No record of trying this

Prevention:
  ☐ Search git history, email, project records
  ☐ If not found: "No record of this being attempted"
  ☐ Do NOT assert memory without evidence
```

### Pattern 2: Extrapolation Overreach
```
AI: "One customer loved this, so all customers will"
Reality: Survey of 1 ≠ market validation

Prevention:
  ☐ Sample size check: Is N large enough?
  ☐ Never generalize from 1-5 samples
  ☐ Qualify: "Positive feedback from X of Y surveyed"
```

### Pattern 3: Inventing Consensus
```
AI: "Everyone agrees this is the best approach"
Reality: Only 2 people were asked

Prevention:
  ☐ Who exactly agrees? (list them)
  ☐ How many? (actual count)
  ☐ Any disagreement? (acknowledge it)
  ☐ Instead: "2 of 3 experts agree..." (not "everyone")
```

### Pattern 4: Future Telling
```
AI: "This will definitely work because..."
Reality: Future is unknowable

Prevention:
  ☐ Change "will" to "might" or "estimated to"
  ☐ List risks and fallback plans
  ☐ Instead: "Likely to work (70% confidence) because... Risk if wrong: ..."
```

### Pattern 5: Confident Approximation
```
AI: "Market size is $5B"
Reality: Estimate, not measured fact

Prevention:
  ☐ Mark estimates clearly: "Estimated at $5B ±30%"
  ☐ Show source: "Based on Gartner forecast"
  ☐ Acknowledge uncertainty: "Could be $3.5B - $6.5B"
```

---

## Hallucination Detection Checklist

If output contains ANY of these patterns → HALLUCINATION likely:

- [ ] Specific number without source ("50K users")
- [ ] 100% confident claim with weak evidence
- [ ] Contradicts known facts (ignored)
- [ ] Hidden assumptions (not stated)
- [ ] Logically inconsistent claims
- [ ] Cherry-picked data (ignored contrary data)
- [ ] Vague/unfalsifiable claims ("will disrupt")
- [ ] False memory ("we tried this before" without evidence)
- [ ] Generalization from tiny sample ("1 customer = everyone wants it")
- [ ] Invented consensus ("everyone agrees")
- [ ] Future prediction as certainty ("will definitely work")

**If 2+ boxes checked:** BLOCK output, ask for revision

---

## The Golden Rule

**DOUBT > CONFIDENCE**

When uncertain:
- ❌ Don't: Hide uncertainty, make it sound certain
- ✅ Do: Mark as uncertain, explain why

Example:
```
❌ "NuDay will scale to 100K users in 6 months"
✅ "NuDay growth projection: 100K users (ESTIMATE, assumes 15% MoM)
    Confidence: MEDIUM (50%)
    Risk: If retention < 15%, actual number will be lower
    Source: Based on 3 similar health apps (avg growth rate)"
```

---

## What to Tell Tamir

**Instead of:** "Market size is $1B"
**Say:** "Market size estimated at $1B (source: Gartner 2025 forecast, ±20% confidence range)"

**Instead of:** "Will definitely succeed"
**Say:** "Success probability: 70% (based on team experience + market timing + funding available)"

**Instead of:** "Team can do it"
**Say:** "Team has shipped 3 products of similar scope in past 18 months. Average timeline: 4 months. This project: 6 months estimated."

**Instead of:** "Everyone wants this"
**Say:** "Customer feedback: 8/10 surveyed are interested (source: interviews last week)"

---

## Implementation

This SKILL must be applied by:
1. **Fact Checker** - before claims reach Tamir
2. **Agent Validator** - before agent outputs are sent
3. **Quality Gates** - final check before approval
4. Every agent internally - before generating claims

**No output can bypass these 7 gates.**

---

## Enforcement

- [ ] Every output logged through all 7 gates
- [ ] Failed gates trigger revision request
- [ ] No exceptions (not even for "quick" outputs)
- [ ] Audit trail: which gates passed, which failed
- [ ] Report to Tamir: which outputs had which issues

**Zero hallucinations reach Tamir.**

