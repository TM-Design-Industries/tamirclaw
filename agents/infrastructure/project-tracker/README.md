# Project Tracker Agent

## Purpose
Manages project lifecycle from intake through delivery. Tracks status, milestones, deliverables, and timeline.

## Architecture
- **Layer:** Infrastructure (runs 24/7)
- **Decision Level:** 1 (autonomous, no judgment calls)
- **Status:** Ready for production

## Inputs

### Create Project
```javascript
{
  "action": "create",
  "data": {
    "client": "Company Name",
    "brief": "Project description",
    "domain": "automotive|aerospace|marine|etc",
    "deadline": "2026-06-30",
    "budget": 500000
  }
}
```

### Update Status
```javascript
{
  "action": "update_status",
  "data": {
    "project_id": "AUT-1710000000-ABC",
    "status": "planning|design|engineering|testing|delivery|completed"
  }
}
```

### Add Milestone
```javascript
{
  "action": "add_milestone",
  "data": {
    "project_id": "AUT-1710000000-ABC",
    "name": "Design Phase Complete",
    "due_date": "2026-04-15",
    "deliverables": ["CAD files", "renderings"]
  }
}
```

### Get Status
```javascript
{
  "action": "get_status",
  "data": {
    "project_id": "AUT-1710000000-ABC"
  }
}
```

### List All Projects
```javascript
{
  "action": "list"
}
```

## Outputs

All outputs follow this structure:

```javascript
{
  "success": true|false,
  "project_id": "AUT-1710000000-ABC",
  "status": "current_status",
  "data": {...},
  "error": "error message if failed"
}
```

## Status Flow

```
intake → planning → design → engineering → testing → delivery → completed
```

Each status represents a phase in the project lifecycle.

## Milestones

Each project can have multiple milestones:
- Name (required)
- Due date (optional)
- Deliverables list
- Status tracking (pending → in_progress → completed)

## Current Implementation

**Storage:** In-memory Map (for testing)
**Next:** PostgreSQL database for production

## Tests

Run tests:
```bash
node tests.js
```

Expected output:
```
=== PROJECT TRACKER AGENT TESTS ===

TEST 1: Create project
✅ PASS - Project created: AUT-1710000000-ABC

TEST 2: Get project status
✅ PASS - Status retrieved: intake

...

=== TEST SUMMARY ===
Passed: 7
Failed: 0
Total:  7
```

## Integration with Orchestrator

The Orchestrator calls Project Tracker like this:

```javascript
const result = await projectTracker.process({
  action: 'create',
  data: projectBrief
});

if (result.success) {
  // Proceed with specialist assignment
} else {
  // Log error and escalate
}
```

## Future Enhancements

- [ ] PostgreSQL backend
- [ ] Real-time webhooks when status changes
- [ ] Timeline auto-calculation based on domain/complexity
- [ ] Resource allocation tracking
- [ ] Cost tracking per milestone
- [ ] Integration with Invoice Agent for billing
- [ ] Slack notifications for status changes
