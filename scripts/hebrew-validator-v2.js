/**
 * HEBREW VALIDATOR v2
 * Comprehensive Hebrew checking with error database
 */

const fs = require('fs');
const path = require('path');

// Load error database
const ERROR_DB = JSON.parse(fs.readFileSync(
  path.join(__dirname, 'hebrew-errors.json'),
  'utf8'
));

class HebrewValidator {
  constructor() {
    this.errors_found = [];
    this.severity_count = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  }

  validate(text) {
    this.errors_found = [];
    this.severity_count = { HIGH: 0, MEDIUM: 0, LOW: 0 };

    // Check 1: Verb binyan errors (from database)
    this._checkVerbBinyan(text);

    // Check 2: Calques (from database)
    this._checkCalques(text);

    // Check 3: Gender agreement (from database)
    this._checkGenderAgreement(text);

    // Check 4: Mixed language (from database)
    this._checkMixedLanguage(text);

    // Check 5: Over-formality (from database)
    this._checkOverFormality(text);

    return this._buildResult(text);
  }

  _checkVerbBinyan(text) {
    for (const [wrong, data] of Object.entries(ERROR_DB.verb_binyan)) {
      if (text.includes(wrong)) {
        this.errors_found.push({
          type: 'verb_binyan',
          found: wrong,
          fix: data.fix,
          reason: data.reason,
          severity: 'MEDIUM'
        });
        this.severity_count.MEDIUM++;
      }
    }
  }

  _checkCalques(text) {
    for (const [wrong, data] of Object.entries(ERROR_DB.calques)) {
      if (text.includes(wrong)) {
        this.errors_found.push({
          type: 'calque',
          found: wrong,
          fix: data.fix,
          reason: data.reason,
          severity: 'MEDIUM'
        });
        this.severity_count.MEDIUM++;
      }
    }
  }

  _checkGenderAgreement(text) {
    for (const [pattern, data] of Object.entries(ERROR_DB.gender_agreement)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(text)) {
        this.errors_found.push({
          type: 'gender_agreement',
          pattern: pattern,
          fix: data.fix,
          reason: data.reason,
          severity: 'MEDIUM'
        });
        this.severity_count.MEDIUM++;
      }
    }
  }

  _checkMixedLanguage(text) {
    for (const [english, data] of Object.entries(ERROR_DB.mixed_language)) {
      // Look for English words in Hebrew context
      const hebrewWords = text.match(/[\u0590-\u05FF]+/g) || [];
      if (hebrewWords.length > 3 && text.includes(english)) {
        this.errors_found.push({
          type: 'mixed_language',
          found: english,
          fix: data.fix,
          reason: data.reason,
          severity: 'HIGH'
        });
        this.severity_count.HIGH++;
      }
    }
  }

  _checkOverFormality(text) {
    for (const [formal, data] of Object.entries(ERROR_DB.over_formality)) {
      if (text.includes(formal)) {
        this.errors_found.push({
          type: 'over_formality',
          found: formal,
          alternative: data.alternative,
          reason: data.reason,
          severity: 'LOW'
        });
        this.severity_count.LOW++;
      }
    }
  }

  _buildResult(text) {
    const has_high = this.severity_count.HIGH > 0;
    const can_send = !has_high;

    return {
      text: text,
      valid: this.errors_found.length === 0,
      can_send: can_send,
      errors: this.errors_found,
      summary: {
        total: this.errors_found.length,
        high: this.severity_count.HIGH,
        medium: this.severity_count.MEDIUM,
        low: this.severity_count.LOW
      },
      report: this._generateReport()
    };
  }

  _generateReport() {
    if (this.errors_found.length === 0) {
      return '✅ VALID - No errors detected';
    }

    let report = '';

    // High severity
    const high_errors = this.errors_found.filter(e => e.severity === 'HIGH');
    if (high_errors.length > 0) {
      report += '🔴 HIGH SEVERITY (MUST FIX):\n';
      high_errors.forEach((e, i) => {
        report += `  ${i + 1}. ${e.found} → ${e.fix} (${e.reason})\n`;
      });
    }

    // Medium severity
    const medium_errors = this.errors_found.filter(e => e.severity === 'MEDIUM');
    if (medium_errors.length > 0) {
      report += '\n🟡 MEDIUM SEVERITY (Review):\n';
      medium_errors.forEach((e, i) => {
        report += `  ${i + 1}. ${e.found} → ${e.fix} (${e.reason})\n`;
      });
    }

    // Low severity
    const low_errors = this.errors_found.filter(e => e.severity === 'LOW');
    if (low_errors.length > 0) {
      report += '\n🟢 LOW SEVERITY (Optional):\n';
      low_errors.forEach((e, i) => {
        report += `  ${i + 1}. ${e.found} → ${e.alternative} (${e.reason})\n`;
      });
    }

    return report;
  }
}

// Test
function test() {
  const validator = new HebrewValidator();

  const testCases = [
    "בניתי את הvalidator וקרא דקה.",
    "לא הבנתי את הבעיה לחלוטין.",
    "ההערכה שלי טובה."
  ];

  console.log('HEBREW VALIDATOR v2 TEST\n');
  
  testCases.forEach((text, i) => {
    const result = validator.validate(text);
    console.log(`Test ${i + 1}: "${text}"`);
    console.log(`Valid: ${result.valid}`);
    console.log(`Can Send: ${result.can_send}`);
    console.log(result.report);
    console.log();
  });
}

module.exports = { HebrewValidator };

if (require.main === module) {
  test();
}
