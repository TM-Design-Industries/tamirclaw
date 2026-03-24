# Agent Template

## Structure

Every agent follows this structure:

```
/agents/{layer}/{agent-name}/
├── index.js          (main logic)
├── schema.json       (input/output specification)
├── knowledge.json    (domain-specific knowledge)
├── tests.js          (unit tests)
└── README.md         (documentation)
```

## Schema Template

```json
{
  "name": "Agent Name",
  "purpose": "What this agent does",
  "layer": "infrastructure|specialists|execution|orchestrator",
  "inputs": {
    "type": "object",
    "properties": {
      "param1": {"type": "string"}
    }
  },
  "outputs": {
    "type": "object",
    "properties": {
      "result": {"type": "string"}
    }
  },
  "dependencies": ["other-agents"],
  "decision_level": 1-6
}
```

## Implementation Pattern

```javascript
// index.js

class Agent {
  constructor(name, purpose) {
    this.name = name;
    this.purpose = purpose;
  }

  async process(input) {
    // Validate input against schema
    // Execute logic
    // Return structured output
    // Log decision
    return output;
  }

  async validate(data) {
    // Validate against schema
  }
}

module.exports = Agent;
```

## Testing Pattern

```javascript
// tests.js

const test = require('test');
const Agent = require('./index');

test('Agent processes valid input', async () => {
  const agent = new Agent();
  const result = await agent.process({...});
  assert(result.success === true);
});
```

## Documentation Pattern

```markdown
# Agent Name

## Purpose
One sentence describing what this agent does.

## Inputs
- param1 (type): description
- param2 (type): description

## Outputs
- result (type): description

## Dependencies
- Other agents this depends on
- External APIs

## Decision Authority
Level X (see IMPLEMENTATION-ROADMAP for levels)

## Examples
```

