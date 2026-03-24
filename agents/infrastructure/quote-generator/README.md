# Quote Generator Agent

## Purpose
Generate professional proposals with accurate cost estimates based on project domain, complexity, and timeline.

## Architecture
- **Layer:** Infrastructure
- **Decision Level:** 1 (pure calculation, no judgment)
- **Status:** Ready for production

## Features

### 1. Estimate Cost
Calculates project cost based on:
- **Domain:** automotive, aerospace, marine, architecture, industrial
- **Complexity:** simple, moderate, complex
- **Timeline:** Rush timeline (< 8 weeks) adds 20% fee
- **Client Type:** startup (25% markup), SMB (35%), enterprise (45%)

**Input:**
```javascript
{
  "action": "estimate_cost",
  "data": {
    "domain": "automotive",
    "complexity": "complex",
    "timeline_weeks": 12,
    "client_type": "enterprise"
  }
}
```

**Output:**
```javascript
{
  "success": true,
  "cost_estimate": 547500,
  "breakdown": {
    "labor": 300000,
    "materials": 45000,
    "overhead": 60000,
    "subtotal": 405000,
    "markup": 142500,
    "markup_rate": "45%"
  },
  "estimated_hours": 1200,
  "timeline_adjustment": "Standard timeline"
}
```

### 2. Generate Quote
Creates professional proposal document with:
- Quote ID
- Cost breakdown
- Deliverables list
- Payment terms (50/50 split)
- Timeline
- Validity (30 days)

**Input:**
```javascript
{
  "action": "generate_quote",
  "data": {
    "client": "Audi AG",
    "project_name": "Interior Redesign",
    "domain": "automotive",
    "complexity": "complex",
    "timeline_weeks": 12,
    "client_type": "enterprise",
    "description": "Complete interior redesign...",
    "deliverables": ["CAD models", "Specs", "Documentation"]
  }
}
```

### 3. Update Quote Status
Track quote through workflow:
- **draft** → **sent** → **accepted** / **rejected**

## Pricing Matrix

### Automotive
- Base rate: $150/hour
- Simple: 100 hours × 1.0 = 100 hours
- Moderate: 300 hours × 1.5 = 450 hours
- Complex: 800 hours × 2.5 = 2000 hours

### Aerospace
- Base rate: $200/hour (higher due to complexity)
- Simple: 150 hours × 1.2
- Moderate: 500 hours × 2.0
- Complex: 1500 hours × 3.5

### Marine
- Base rate: $140/hour
- Similar complexity multipliers

### Architecture
- Base rate: $130/hour (lower complexity)
- Reduced complexity multipliers

### Industrial
- Base rate: $120/hour
- Standard multipliers

## Cost Formula

```
Estimated Hours = Base Hours × Complexity Multiplier
Labor Cost = Estimated Hours × Base Rate × Timeline Multiplier
Materials = Labor × 15%
Overhead = Labor × 20%
Subtotal = Labor + Materials + Overhead
Markup = Subtotal × Client Markup Rate
Total = Subtotal + Markup
```

## Timeline Adjustment
- **< 8 weeks:** +20% rush fee
- **8-12 weeks:** Standard (1.0x)
- **> 12 weeks:** Could add discount (not implemented yet)

## Client Markup Rates
- **Startup:** 25% (building partnership)
- **SMB:** 35% (standard rate)
- **Enterprise:** 45% (premium services)

## Payment Terms
- 50% upfront (secures timeline and materials)
- 50% upon completion (ensures delivery)
- Valid for 30 days from quote date

## Tests
```bash
node tests.js
```

Expected: 7/7 passing

Test coverage:
- Cost estimation
- Full proposal generation
- Rush timeline penalties
- Client type markup differences
- Quote status updates
- All 5 domains
- Invalid input handling

## Integration with Other Agents

### With Email Manager
```javascript
// Email routed to quote_generator
const quoteResult = await quoteGen.process({
  action: 'generate_quote',
  data: extractProjectBriefFromEmail(email)
});
```

### With Project Tracker
```javascript
// Store quote ID with project
await projectTracker.updateProject({
  project_id,
  quote_id: quoteResult.quote_id,
  estimated_cost: quoteResult.cost
});
```

## Future Enhancements
- [ ] Machine learning cost adjustment (learn from actual costs)
- [ ] Multi-stage quote (design phase, engineering phase)
- [ ] Currency support (EUR, GBP, JPY, CNY)
- [ ] Discount codes
- [ ] Recurring/retainer pricing
- [ ] Invoice generation from approved quotes
