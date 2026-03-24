# Orchestrator Agent

## Purpose
Central coordination system that:
- Routes incoming projects
- Assigns specialized agents by domain
- Manages work queue and priority
- Detects issues and escalates to Tamir
- Coordinates multi-phase workflows

## Architecture
- **Layer:** Core
- **Decision Level:** 3 (coordinates decisions across agents)
- **Status:** Ready for production

## Key Functions

### 1. Intake Project
When a new project arrives, automatically assign initial agents.

**Input:**
```javascript
{
  "action": "intake_project",
  "data": {
    "client": "Audi AG",
    "brief": "Interior redesign for A8",
    "domain": "automotive",
    "budget": 500000,
    "deadline": "2026-06-30"
  }
}
```

**Automatically assigns:**
- Project Tracker (create project record)
- Domain Specialist (provide domain context)
- Quote Generator (estimate cost)

### 2. Assign Agents
For each phase of work, assign appropriate execution agents.

**Phases:**
- **Design:** design_expert, dfm_specialist
- **Engineering:** mechanical_engineer, dfm_specialist
- **Review:** design_expert, mechanical_engineer

### 3. Check Status
Get current status of any project and all assigned agents.

### 4. Escalate
When something needs Tamir's attention, create escalation.

**Severities:** low, medium, high, critical

### 5. Get Queue
View all projects in work queue.

## Workflow Example

1. **Email arrives** → Email Manager parses it
2. **Email contains brief** → Routed to Orchestrator
3. **Orchestrator intakes** → Project Tracker + Specialist + Quote Generator assigned
4. **Specialist analyzes** → Domain context provided
5. **Quote generated** → Cost estimate returned
6. **Orchestrator routes** → Sends to appropriate design/engineering agents
7. **Work proceeds** → Orchestrator monitors progress
8. **Issue found** → Escalate to Tamir

## Agent Assignment by Domain

| Domain | Specialist | Sub-agents |
|--------|-----------|-----------|
| Automotive | vehicle_specialist | mechanical_engineer, dfm_specialist |
| Aerospace | aircraft_specialist | mechanical_engineer, dfm_specialist |
| Marine | marine_specialist | mechanical_engineer, dfm_specialist |

## Queue Management

- **Priority levels:** low, medium, high, critical
- **FIFO with priority** (higher priority moves forward)
- **Concurrent projects:** Can handle 50+ simultaneously
- **Status tracking:** Every project tracked from intake to delivery

## Escalation Reasons

- **Budget exceeded:** > 10% over estimate
- **Timeline at risk:** Slipping deadline
- **Technical blocker:** Agent can't proceed
- **Quality issue:** < 7/10 on any dimension
- **Client request:** Strategic decision needed
- **Resource shortage:** Can't get required specialist

## Integration Points

**With Project Tracker:**
- Create project records
- Update status at phase changes

**With Email Manager:**
- Receive project briefs from emails
- Route quotes back to sender

**With Domain Specialists:**
- Get domain analysis
- Understand market/regulatory constraints

**With Execution Agents:**
- Assign work to engineers/designers
- Monitor progress
- Collect deliverables

**With Tamir:**
- Escalate decisions
- Report status
- Request strategic guidance

## Tests
```bash
node tests.js
```

Expected: 7/7 passing

Test coverage:
- Project intake
- Status checking
- Agent assignment by phase
- Escalation creation
- Queue management
- Multiple concurrent projects
- Correct specialist by domain

## Future Enhancements
- [ ] Conflict detection (when agents disagree)
- [ ] Automatic conflict resolution (apply authority matrix)
- [ ] Load balancing (distribute work to available agents)
- [ ] Predictive capability (forecast bottlenecks)
- [ ] Smart prioritization (machine learning-based queue)
- [ ] Integration with knowledge base (pull past solutions)
