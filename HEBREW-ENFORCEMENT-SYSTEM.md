# Hebrew Enforcement System - Complete

## Problem Solved

Previously: I wrote Hebrew with ~10% error rate (mixed language, verb binyan, gender)

Now: Automated validation before sending

---

## System Components

### 1. Error Database (`scripts/hebrew-errors.json`)

Comprehensive database of:
- Verb binyan errors (with fixes)
- Calques from English
- Gender agreement rules
- Mixed language terms
- Over-formality patterns

**How to update:**
```json
{
  "verb_binyan": {
    "new_wrong_verb": { "fix": "correct_form", "reason": "explanation" }
  }
}
```

### 2. Validator v2 (`scripts/hebrew-validator-v2.js`)

Checks against error database:
- Returns severity levels (HIGH/MEDIUM/LOW)
- Provides fixes for each error
- Generates readable report

```javascript
const validator = new HebrewValidator();
const result = validator.validate("טקסט בעברית");
// result.can_send = true/false based on HIGH severity errors
```

### 3. Enforcement CLI (`scripts/enforce-hebrew.js`)

Command-line tool:
```bash
node scripts/enforce-hebrew.js "text to check"
```

Exit codes:
- 0 = Can send (no HIGH severity)
- 1 = Cannot send (HIGH severity found)

### 4. SKILL Documentation (`skills/hebrew-writing/SKILL.md`)

Tells me:
- When to use enforcement
- How to use validator
- Process before sending
- Database of errors

---

## How It Works

### Scenario: I write in Hebrew

```
1. Write text
2. Run: node scripts/enforce-hebrew.js "my hebrew text"
3. Validator checks against hebrew-errors.json
4. If HIGH severity: Shows errors, exit code 1
5. If MEDIUM/LOW: Shows warnings, exit code 0
6. I fix errors if needed
7. Validator passes → Send
```

### Example Flow

```
Text: "בנאתי את הvalidator"

validator.validate()
├─ Check verb binyan → finds "בנאתי" (wrong)
├─ Maps to error DB → suggests "בניתי"
├─ Severity: MEDIUM
└─ can_send: true (no HIGH)

Output: "⚠️ MEDIUM issues - can send after review"
```

---

## Enforcement Rules

| Rule | Enforcement |
|---|---|
| HIGH severity = stop | Exit code 1, don't send |
| MEDIUM severity = review | Exit code 0, send with warning |
| LOW severity = optional | Exit code 0, send |
| No errors = proceed | Exit code 0, full send |

---

## Adding New Errors (When Tamir Corrects)

When Tamir points out an error:

```
1. Note what was wrong
2. Note what's correct
3. Categorize (verb/calque/gender/etc)
4. Add to hebrew-errors.json
5. Re-test validator
```

Example:
```bash
# Tamir says: "בנאתי should be בניתי"
# Action: Add to hebrew-errors.json under verb_binyan
# Test: node scripts/enforce-hebrew.js "בנאתי"
# Result: Validator catches it
```

---

## Why This Works

✅ **Automated** - No manual memory, database-driven
✅ **Scalable** - Add errors as we find them
✅ **Consistent** - Same rules every time
✅ **Enforceable** - Can't send until fixed (if HIGH)
✅ **Learning** - Each correction improves system

---

## Success Criteria

System is working when:
1. ✅ Every Hebrew message passes validator before send
2. ✅ HIGH severity errors are always caught
3. ✅ Error database grows with corrections
4. ✅ No repeated errors (because they're in database)

---

## Commands Summary

```bash
# Check Hebrew text
node scripts/enforce-hebrew.js "text here"

# Run validator tests
node scripts/hebrew-validator-v2.js

# View error database
cat scripts/hebrew-errors.json

# Read SKILL
cat skills/hebrew-writing/SKILL.md
```

---

## Next Step

Every time Tamir corrects Hebrew, I:
1. Add to hebrew-errors.json
2. Re-test validator
3. Confirm it catches the error
4. Never make that mistake again

