# Email Manager Agent

## Purpose
Automatically parse, prioritize, and route incoming emails to appropriate agents.

## Architecture
- **Layer:** Infrastructure (runs 24/7, monitors incoming mail)
- **Decision Level:** 1 (autonomous, pure pattern matching)
- **Status:** Ready for production

## Features

### 1. Parse Email
Extracts sender, subject, body, and attachments into structured format.

**Input:**
```javascript
{
  "action": "parse",
  "data": {
    "from": "client@audi.com",
    "to": "tamir@tmd.local",
    "subject": "URGENT: Quote Needed",
    "body": "We need a quote for...",
    "attachments": ["specs.pdf"]
  }
}
```

### 2. Prioritize Email
Scores email based on:
- **Urgent keywords:** (urgent, asap, critical, deadline, etc.) = +5 points
- **Project keywords:** (project, design, proposal, specs, etc.) = +2 points
- **Client importance:** (Audi, Tesla, Airbus = high/critical) = +7-10 points

**Result:** `critical` (15+), `high` (10-14), `medium` (5-9), `low` (<5)

### 3. Route Email
Suggests which agent should handle the email:
- **quote** → Quote Generator
- **invoice/bill** → Accounting Agent
- **schedule/meeting** → Scheduler
- **contract/legal** → Legal Agent
- **vendor/supplier** → Vendor Manager
- **project/brief** → Project Tracker
- **high priority** → Orchestrator (for human review)

### 4. Archive Email
Marks as read and moves to archive.

### 5. List Unread
Returns all unread emails sorted by priority.

## Database
- **Storage:** In-memory Map (for testing)
- **Next:** PostgreSQL integration

## Client Database
Pre-configured VIP clients:
- Audi (automotive, high importance)
- BMW (automotive, high importance)
- Tesla (automotive, high importance)
- Airbus (aerospace, critical importance)
- Bombardier (aerospace, high importance)
- Rolls Royce (aerospace, high importance)

## Tests
```bash
node tests.js
```

Expected: 8/8 passing

## Integration
With Orchestrator:
```javascript
// Email arrives
const parseResult = await emailManager.process({
  action: 'parse',
  data: emailData
});

// Prioritize
const priorityResult = await emailManager.process({
  action: 'prioritize',
  data: {email_id: parseResult.email_id}
});

// Route
const routeResult = await emailManager.process({
  action: 'route',
  data: {email_id: parseResult.email_id}
});

// If routed to Project Tracker, call:
const projectResult = await projectTracker.process({
  action: 'create',
  data: extractProjectBrief(email)
});
```

## Future Enhancements
- [ ] Gmail API integration (real email)
- [ ] Slack integration (notify Tamir of critical emails)
- [ ] Attachment parsing (extract text from PDFs)
- [ ] Machine learning priority scoring (learn from Tamir's actions)
- [ ] Reply suggestions (draft responses)
- [ ] Calendar integration (auto-schedule meetings)
- [ ] Expense extraction (parse invoices)
