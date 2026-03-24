# Hebrew Writing Process

## Before I send ANYTHING in Hebrew:

1. **Write the message**
2. **Run validator** (hebrew-validator.js)
3. **If HIGH severity issues**: FIX before sending
4. **If MEDIUM issues**: Review and decide
5. **If LOW issues only**: Can send, but review

## Validation Rules

- ✅ Can send if: 0 HIGH severity issues
- ⚠️ Review if: MEDIUM issues exist
- ⚠️ Always review if: Gender, calques, mixed language
- ❌ MUST FIX if: HIGH severity (mixed language in same sentence)

## If I'm uncertain:

**Default to English** (better clear than wrong Hebrew)

Example:
```
אני לא בטוח בעברית בנקודה זו. 
In English: I'm not sure about the Hebrew here.
```

## Enforcement:

Every Hebrew message must pass validator OR have explicit note:
"⚠️ [Hebrew might be rough, validator had issues: X, Y, Z]"
