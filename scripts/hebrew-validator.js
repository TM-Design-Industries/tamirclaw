/**
 * HEBREW VALIDATOR
 * Checks for common AI Hebrew errors before sending
 */

const HEBREW_RULES = {
  // Rule 1: Mixed English-Hebrew in same sentence
  mixedLanguage: {
    pattern: /[\u0590-\u05FF]+\s+[a-zA-Z]+\s+[\u0590-\u05FF]+/g,
    error: "מילים באנגלית בתוך משפט בעברית",
    fix: "החלף מילים באנגלית בעברית או כתוב משפט חדש באנגלית"
  },

  // Rule 2: Common calques
  calques: {
    patterns: {
      "אני לא מבין אותך": { fix: "לא הבנתי אותך", reason: "word order + tense" },
      "בואו נעשה": { fix: "בואו נ-...", reason: "use proper verb" },
      "צודק לחלוטין": { fix: "צודק", reason: "avoid over-formality" },
      "הערכה הנכונה": { fix: "הערכה מדוייקת", reason: "better word choice" },
      "מה המשמעות": { fix: "מה הכוונה", reason: "more natural" }
    }
  },

  // Rule 3: Gender agreement (simplified check)
  commonGenderErrors: {
    patterns: {
      "הערכה.*טוב": "הערכה is feminine → should be 'טובה'",
      "תשובה.*נכון": "תשובה is feminine → should be 'נכונה'",
      "דרך.*קצר": "דרך is feminine → should be 'קצרה'",
      "מודל.*לא יודע": "rephrase - awkward structure"
    }
  },

  // Rule 4: Overly formal
  overFormal: {
    patterns: ["לחלוטין", "כפי שניתן לראות", "בנוסף לכך", "לפי הנתונים"]
  },

  // Rule 5: Common verb binyan errors
  verbErrors: {
    patterns: {
      "בנאתי": { fix: "בניתי", reason: "past tense binyan error" },
      "רצתי": { fix: "הרצתי", reason: "should use hif'il binyan" },
      "שלחתי": { fix: "שלחתי", reason: "correct - keep" },
      "הנתתי": { fix: "נתתי", reason: "no 'ה' prefix" },
      "לא יקרה": { fix: "לא קורה", reason: "present tense, not future" }
    }
  }
};

function validateHebrew(text) {
  const issues = [];
  const fixes = [];

  // Check 1: Mixed language
  const mixedMatches = text.match(HEBREW_RULES.mixedLanguage.pattern);
  if (mixedMatches) {
    issues.push({
      type: "mixed-language",
      matches: mixedMatches,
      error: "English words in Hebrew sentence",
      severity: "HIGH"
    });
  }

  // Check 2: Known calques
  for (const [calque, fix] of Object.entries(HEBREW_RULES.calques.patterns)) {
    if (text.includes(calque)) {
      issues.push({
        type: "calque",
        found: calque,
        suggested: fix.fix,
        reason: fix.reason,
        severity: "MEDIUM"
      });
      fixes.push(`"${calque}" → "${fix.fix}"`);
    }
  }

  // Check 3: Common gender errors
  for (const [pattern, message] of Object.entries(HEBREW_RULES.commonGenderErrors.patterns)) {
    const regex = new RegExp(pattern, "i");
    if (regex.test(text)) {
      issues.push({
        type: "gender",
        pattern: pattern,
        message: message,
        severity: "MEDIUM"
      });
    }
  }

  // Check 4: Over-formal words
  for (const word of HEBREW_RULES.overFormal.patterns) {
    if (text.includes(word)) {
      issues.push({
        type: "formality",
        word: word,
        suggestion: "Use simpler, more casual Hebrew",
        severity: "LOW"
      });
    }
  }

  // Check 5: Verb binyan errors
  for (const [wrong, fix] of Object.entries(HEBREW_RULES.verbErrors.patterns)) {
    if (text.includes(wrong)) {
      issues.push({
        type: "verb",
        found: wrong,
        suggested: fix.fix,
        reason: fix.reason,
        severity: "MEDIUM"
      });
      fixes.push(`"${wrong}" → "${fix.fix}"`);
    }
  }

  return {
    text: text,
    isValid: issues.length === 0,
    issues: issues,
    highSeverityIssues: issues.filter(i => i.severity === "HIGH"),
    canSend: issues.filter(i => i.severity === "HIGH").length === 0,
    summary: {
      total: issues.length,
      high: issues.filter(i => i.severity === "HIGH").length,
      medium: issues.filter(i => i.severity === "MEDIUM").length,
      low: issues.filter(i => i.severity === "LOW").length
    }
  };
}

// Test function
function testValidator() {
  const testCases = [
    {
      text: "אתה צודק לחלוטין. זה pattern matching.",
      expected: "mixed + formal"
    },
    {
      text: "לא הבנתי אותך. צריך שתתן לי יותר מידע.",
      expected: "clean"
    },
    {
      text: "בואו נעשה סדר עם gender agreement.",
      expected: "calque + mixed"
    },
    {
      text: "ההערכה שלי טוב.",
      expected: "gender error"
    }
  ];

  console.log("HEBREW VALIDATOR TEST\n");
  
  for (const testCase of testCases) {
    const result = validateHebrew(testCase.text);
    console.log(`Text: "${testCase.text}"`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Valid: ${result.isValid}`);
    console.log(`Issues: ${result.summary.total} (${result.summary.high} HIGH, ${result.summary.medium} MEDIUM, ${result.summary.low} LOW)`);
    
    if (result.issues.length > 0) {
      for (const issue of result.issues) {
        console.log(`  - ${issue.type}: ${issue.error || issue.message || issue.suggestion}`);
      }
    }
    console.log();
  }
}

module.exports = { validateHebrew, testValidator };

// Run if called directly
if (require.main === module) {
  const { testValidator } = require('./hebrew-validator.js');
  testValidator();
}
