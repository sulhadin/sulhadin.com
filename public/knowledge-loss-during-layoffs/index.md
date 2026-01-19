---
title: The Day We Lost The Guy Who Knew How Billing Worked
date: '2026-01-2'
spoiler: What I learned about preserving knowledge when half your team disappears overnight
cta: 'react'
---

It was a Tuesday morning when I got the Slack message: "Can you help debug the billing system? Marcus was let go yesterday and we have a critical bug."

Marcus had been with us for four years. He'd built the entire billing pipeline. He knew every edge case, every quirk, every workaround. He'd fixed the "ghost charges" bug three times. He knew which customer IDs were test accounts. He knew why we couldn't migrate to the new payment provider.

Marcus was gone. And with him, four years of knowledge vanished overnight.

We spent the next two weeks piecing together how billing actually worked. We found comments like `// TODO: refactor this hack` from 2018. We found configuration files nobody understood. We found a Slack thread from 2019 where Marcus explained a critical detail, but the thread was archived and we didn't know to look for it.

That was the first wave of layoffs. We lost 30% of engineering. It hurt, but we survived.

That was the first round of departures. Six months later, a second round hit. We lost three more engineers who were the sole experts in their domains. This time, we weren't prepared. Features took three times longer to ship. We broke things we didn't know could break. We spent more time archaeology than engineering.

I learned something important: **Layoffs don't just reduce headcount. They erase institutional memory.**

This is what I wish we'd done differently.

## The Problem Nobody Talks About

When someone leaves a company voluntarily, there's usually time for knowledge transfer. They train their replacement. They document their work. They stick around for questions during a transition period.

Layoffs aren't like that. People disappear instantly. One day they're in standups, the next day their Slack is deactivated. There's no transition period. There's no time for "just one more question."

And here's what makes it worse: **layoffs are strategic.** Companies don't lay off randomly. They lay off based on business priorities, team restructuring, cost optimization.

Which means the knowledge that gets lost is often the knowledge about systems that are "working well enough" but not actively being developed. The stable stuff. The boring stuff. The stuff nobody thinks about until it breaks.

Marcus's billing system worked perfectly. For four years, it just ran. Nobody touched it. Nobody documented it. Nobody needed to understand it.

Until Marcus was gone.

## What We Did Wrong (And You Probably Are Too)

### Mistake 1: We Treated Documentation as a Chore

We had a wiki. It was outdated. Most pages were last edited 2-3 years ago. We had a "Documentation Sprint" once per quarter where we'd spend a day updating docs.

But here's the thing: **documentation written during a "sprint" is documentation that's already obsolete.**

Real documentation happens continuously. It happens when you fix a bug and write down what you learned. It happens when you onboard someone and they ask "why does this work this way?" It happens when you solve a tricky problem and think "I never want to debug this again."

Our docs were an obligation, not a habit. When the layoffs happened, we had a beautiful wiki that explained how the system worked two years ago, not how it works today.

### Mistake 2: We Had "The Person Who Knows X"

Every team has them:
- The person who knows how deployments work
- The person who knows the database schema
- The person who knows which customers have special configurations
- The person who knows the legacy API contracts

We called them "domain experts." We relied on them. When we needed to touch their area, we'd ask them. They became bottlenecks, but that was okay because they were fast.

Then they got laid off, and we realized: **having an expert is a single point of failure.**

We should have been spreading that knowledge. We should have had multiple people who understood billing, multiple people who understood deployments, multiple people who understood the caching layer.

Instead, we optimized for short-term efficiency and created long-term fragility.

### Mistake 3: Our Tasks Were Temporary Artifacts

We used Jira. Tasks looked like this:

```
Title: Fix billing bug
Description: Users reporting duplicate charges
Assignee: Marcus
Status: Done
```

When the task was done, we closed it and moved on. The ticket didn't capture:
- What was the root cause?
- What did we learn?
- What are the edge cases to watch for?
- What would we do differently next time?

Tasks were about **tracking work**, not **preserving knowledge.**

After Marcus left, we'd search Jira for "billing" and find 400 closed tickets titled "Fix billing bug." None of them explained what actually happened.

### Mistake 4: We Had No End-to-End Scenarios

We had unit tests. We had integration tests. We had good code coverage.

But we didn't have **scenario documentation.**

What happens when a customer upgrades their plan mid-month? What happens when they downgrade? What happens if their payment fails? What happens if they're on a grandfathered plan from 2020?

Marcus knew all of this. He'd handled every scenario. But there was no document that said "Here's how billing works end-to-end."

When he left, we had to rediscover these scenarios through customer support tickets and production incidents.

### Mistake 5: Code Review Was About Finding Bugs, Not Sharing Knowledge

Our code reviews looked like this:

```
Reviewer: "LGTM"
Reviewer: "Can you add a test for the error case?"
Reviewer: "Nit: use const instead of let"
```

Reviews were about **code quality**, not **knowledge transfer.**

Nobody asked:
- "Can you explain why you chose this approach?"
- "What are the alternatives you considered?"
- "What happens if X fails?"
- "Can you add comments explaining the non-obvious parts?"

When Marcus submitted PRs for the billing system, we'd approve them because the code looked fine. We never learned **why** the code was structured that way.

After he left, we'd look at his code and think "this is elegant, but I have no idea why it works this way."

## What We Should Have Done (And What You Should Do)

### 1. Make Documentation Part of the Work, Not After It

**Bad approach:**
```
Week 1-2: Build feature
Week 3: Write documentation
```

**Good approach:**
```
Task checklist:
☐ Write design doc (before coding)
☐ Implement feature
☐ Update architecture docs
☐ Write end-to-end scenario docs
☐ Record decision rationale
```

Make documentation a **required step** before marking a task as done.

We started doing this after the second layoff. New rule: No PR gets merged without:
- Updated README if behavior changed
- Updated architecture docs if structure changed
- Comments explaining non-obvious decisions

It slowed us down by maybe 10%. But when the next person left, we didn't lose everything.

### 2. Create "Domain Guides" Not Just API Docs

**Bad documentation:**
```markdown
# Billing API

## createCharge(customerId, amount)
Creates a new charge for the customer.

Parameters:
- customerId: string
- amount: number

Returns: Charge object
```

**Good documentation:**
```markdown
# How Billing Works: A Complete Guide

## Overview
Our billing system handles subscription charges, one-time payments, 
and refunds. This guide explains how everything fits together.

## Key Concepts
- **Billing Cycle**: Charges happen on the 1st of each month
- **Prorated Charges**: If a user upgrades mid-month, we calculate...
- **Failed Payments**: We retry 3 times with exponential backoff...

## Common Scenarios

### Scenario 1: User upgrades from Basic to Pro mid-month
1. System calculates prorated amount
2. Creates immediate charge for difference
3. Next billing cycle charges full Pro amount
4. Edge case: If upgrade happens on the 31st...

### Scenario 2: Payment fails
1. System retries after 24 hours
2. If fails again, retries after 3 days
3. If still fails, downgrades to Free plan
4. Sends email notification at each step

## Why Things Are This Way

### Why we can't migrate to Stripe immediately
We have 1,200 customers on a legacy pricing structure that doesn't 
map to Stripe's model. Migration requires manual intervention for 
each one.

### Why we still support the old API
Customer IDs 1000-1500 are enterprise customers who integrated 
directly with our v1 API. Their contracts guarantee API stability 
until 2025.

## Where Things Can Go Wrong
- Ghost charges happen when... (see incident report #423)
- Timezone handling is tricky because... (see PR #892)
- Test account IDs are: 1, 2, 99, 100, 999, 1000
```

This is the documentation we wrote **after** Marcus left. We reconstructed it from Slack threads, old PRs, support tickets, and guesswork.

We should have written it while Marcus was still here.

### 3. Make Tasks an Archive of Decisions

**Bad task:**
```
Title: Implement caching for user profiles
Status: Done
```

**Good task:**
```
Title: Implement caching for user profiles

## Problem
Dashboard loads are slow (3.2s average). Profiling shows 80% of 
time is spent fetching user profile data from the database.

## Solution Considered
1. Database query optimization - tried this, only improved 10%
2. Add Redis caching - chose this approach
3. Move to GraphQL with DataLoader - too big of a migration

## Why We Chose Redis
- Fastest to implement (2 days vs 2 weeks for GraphQL)
- Works with existing architecture
- Easy to rollback if issues

## Implementation Details
- Cache TTL: 5 minutes (based on how often profiles change)
- Cache invalidation: on profile update and user logout
- Fallback: if Redis is down, go straight to DB (graceful degradation)

## Edge Cases
- User updates profile → cache invalidated immediately
- User logs out → cache invalidated for security
- Redis goes down → app still works, just slower

## Metrics After Deploy
- Average load time: 3.2s → 0.4s
- Database load: -70%
- Redis memory usage: 200MB (acceptable)

## Related PRs
- #892: Initial implementation
- #903: Fix cache invalidation bug
- #912: Add monitoring

## Future Improvements
- Consider migrating to GraphQL with DataLoader (Q3 2025)
- Add cache warming for popular profiles
```

This task is now **documentation.** Six months later, when someone asks "why do we cache for 5 minutes?", the answer is in the task.

### 4. Document End-to-End Scenarios as Tests

We started writing scenario docs as executable tests:

```javascript
describe('Billing Scenarios', () => {
  describe('User upgrades mid-month', () => {
    it('charges prorated amount immediately', async () => {
      // Given: User on Basic plan ($10/month) on day 15
      const user = await createUser({ plan: 'basic', billingDate: 1 });
      await setCurrentDate(15);
      
      // When: User upgrades to Pro ($30/month)
      await upgradeUserPlan(user.id, 'pro');
      
      // Then: Immediate charge of $10 (half of $20 difference)
      const charge = await getLatestCharge(user.id);
      expect(charge.amount).toBe(10);
      expect(charge.reason).toBe('prorated_upgrade');
      
      // And: Next month charges full $30
      await setCurrentDate(45); // Next billing cycle
      await runBillingCron();
      const nextCharge = await getLatestCharge(user.id);
      expect(nextCharge.amount).toBe(30);
    });
    
    it('handles edge case: upgrade on the 31st', async () => {
      // This is the edge case Marcus knew about.
      // February doesn't have a 31st, so we bill on the 28th.
      // ...
    });
  });
  
  describe('Payment fails', () => {
    it('retries 3 times then downgrades', async () => {
      // ...
    });
  });
});
```

These tests do two things:
1. Verify the system works correctly
2. **Document how the system is supposed to work**

When someone asks "what happens if payment fails?", the answer is in the test.

### 5. Prevent Single Points of Failure Through Rotation

After the layoffs, we instituted a new policy: **No single owner for any system.**

**Rotation schedule:**
- Every quarter, someone new becomes the "secondary" for a system
- They shadow the primary for 2 weeks
- They handle the next 3 production incidents for that system
- They pair program on the next 2 features
- After 3 months, they become the primary, and someone else becomes secondary

This felt inefficient. The expert could have solved problems faster than training someone else.

But when the next person left, we didn't lose everything. Someone else already knew 80% of what they knew.

### 6. Make Code Review a Teaching Moment

We changed our review culture:

**Old way:**
```
Reviewer: "LGTM"
```

**New way:**
```
Reviewer: "This looks good, but I don't understand why you're 
using X instead of Y. Can you add a comment explaining the 
trade-offs?"

Author: "Sure! The reason is..."
[adds comment to code]

Reviewer: "Got it. Also, what happens if Z fails here?"

Author: "Good question. Let me add error handling for that case."
```

Reviews became **knowledge transfer sessions**, not just quality gates.

We also started doing "code reading sessions" once a week. Someone would present a part of the codebase (not their own), explain how it works, and answer questions.

This was uncomfortable at first. Nobody wanted to admit they didn't understand code written by their colleagues. But it was the fastest way to spread knowledge.

## What Actually Saved Us

After the second layoff, we made a list of every critical system:
- Billing
- Authentication
- Deployment pipeline
- Data exports
- Admin dashboard
- Email sending
- Webhook processing

For each system, we did a "knowledge audit":
1. Who understands this system? (1-2 people = danger)
2. Is there documentation? (no = danger)
3. Are there end-to-end scenario docs? (no = danger)
4. When was the last time someone other than the expert touched it? (>6 months = danger)

Systems that failed multiple checks became "knowledge emergency" priorities.

We spent one sprint doing nothing but:
- Writing domain guides for at-risk systems
- Pair programming to spread knowledge
- Documenting end-to-end scenarios
- Having experts record video walkthroughs

It felt like a waste of time. We weren't shipping features. We were just writing docs and teaching each other.

But three months later, we lost two more people. And this time, we were fine. The knowledge didn't leave with them.

## The Checklist I Use Now

Before someone leaves (voluntarily or not), I make sure:

**☐ Critical systems have docs**
- Domain guide explaining how it works
- Architecture diagram
- End-to-end scenarios
- "Why things are this way" section

**☐ Tasks are archives**
- Closed tasks explain decisions, not just outcomes
- Trade-offs are documented
- Future improvements are noted

**☐ Knowledge is spread**
- At least 2 people understand each critical system
- Recent pair programming sessions happened
- Code reading sessions covered the area

**☐ Tests document behavior**
- End-to-end scenario tests exist
- Edge cases are captured in tests
- Tests explain the "why" in comments

**☐ No tribal knowledge**
- Undocumented assumptions are captured
- Edge cases are written down
- "Everyone knows" facts are actually documented

## The Uncomfortable Truth

Here's what I learned: **Making your team resilient to layoffs requires assuming your best people will leave.**

That feels pessimistic. It feels like you're not trusting your team. It feels like you're planning for failure.

But it's not about pessimism. It's about sustainability.

When Marcus left, we had two options:
1. Scramble to reconstruct years of knowledge
2. Open the docs and continue working

We chose option 1 because we hadn't prepared for option 2.

## What I'd Tell My Past Self

If I could go back to before the first layoff, I'd say:

**Stop optimizing for short-term efficiency. Start optimizing for knowledge retention.**

- Yes, it's faster to have Marcus fix billing bugs alone
- Yes, writing docs slows down feature development
- Yes, pair programming feels less productive

But when Marcus leaves (and he will, someday), you'll wish you'd invested in making his knowledge transferable.

**Document continuously, not in sprints.**

Every bug fix, every feature, every decision is a chance to write down what you learned. Don't wait for a "documentation sprint."

**Make code review about learning, not just quality.**

The goal isn't just to catch bugs. It's to make sure more than one person understands the code.

**Assume every "expert" will be gone tomorrow.**

Not because they're bad employees or because you're planning layoffs. But because life happens. People leave. People get hit by buses. People win the lottery.

Make your team resilient to that reality.

## What Different Company Sizes Actually Do

After going through this twice, I got curious: how do other companies handle this? I talked to friends at companies ranging from 10-person startups to Big Tech. The patterns were striking.

### What Big Tech Does (And Why It Works)

**Google, Meta, Amazon** - they have massive layoffs but don't lose critical knowledge. Here's what they do:

**1. Forced Documentation Culture**

At Google, you can't launch anything without design docs. Not "nice to have" docs - mandatory, peer-reviewed design documents that explain:
- What problem you're solving
- What alternatives you considered
- Why you chose this approach
- What the trade-offs are

When someone leaves, the docs remain. New people can read the rationale behind decisions made three years ago.

**2. Oncall Rotation as Knowledge Spreading**

Big Tech rotates oncall duties across the entire team. You can't just be an expert in "your" area. Every engineer has to handle production incidents for the entire system.

This forces knowledge spread. You **have** to understand how billing works when you're oncall and billing breaks at 3am.

**3. Internal Tools for Everything**

They build internal tools that codify knowledge:
- Deployment dashboards that show system dependencies
- Configuration management UIs that explain what each setting does
- Runbooks that are automatically kept up-to-date
- Internal wikis with strict quality standards

When I worked at a Big Tech company, we had a tool called "Code Search" where you could find every place a function was used, who wrote it, why they wrote it, and related docs. The knowledge was embedded in the infrastructure.

**4. Layers of Redundancy**

Big Tech can afford to have 3-4 people who understand each critical system. When layoffs happen, they lose one expert, but two others remain.

This is expensive. A startup can't afford this. But it works.

### What Mid-Size Companies Try (50-200 People)

Mid-size companies want Big Tech practices but don't have the resources. Here's what I've seen work:

**1. "Tech Lead Rotation" Programs**

Every quarter, a different engineer becomes the "tech lead" for a system they don't own. They:
- Shadow the current expert for 2 weeks
- Pair program on 2-3 features
- Handle the next production incident
- Update the documentation

After 3 months, they know 70% of what the expert knows. Good enough.

**2. Monthly "System Deep Dives"**

One Friday per month, someone presents a deep dive on a critical system:
- How it works
- Why it was built this way
- Common failure modes
- How to debug it

These become recorded and archived. New hires watch them during onboarding.

**3. "Bus Factor" Audits**

Every quarter, they do a "bus factor" audit:
- List all critical systems
- Count how many people understand each one
- If the answer is "1", that system becomes a knowledge-sharing priority

They track this as a metric, like test coverage or deployment frequency.

**4. Documentation Budget**

They allocate 10-15% of engineering time to documentation. Not as a separate task, but built into every sprint:
- Each feature requires updated docs
- Each bug fix requires a postmortem
- Each architectural decision requires a decision record (ADR)

It's not optional. It's in the definition of "done."

### What Startups Do Wrong (And What They Should Do Instead)

Startups are where I've seen the most knowledge loss. The mentality is "move fast, document later." Then layoffs happen and "later" never comes.

**What startups typically do:**

❌ "We're too small to need documentation"
❌ "Everyone knows how everything works"  
❌ "We'll document when we're bigger"
❌ "Documentation slows us down"

Then the founding engineer leaves and nobody knows how authentication works.

**What startups should actually do:**

**1. Document as You Build (Not After)**

You're writing code anyway. Add comments explaining why:

```javascript
// We retry 3 times because Stripe sometimes returns 500 errors
// that resolve within 10 seconds. More than 3 retries causes
// timeout issues for the user (see incident #42)
const MAX_RETRIES = 3;
```

This takes 30 seconds. But when someone leaves, it's invaluable.

**2. Make README Files Sacred**

Every repository should have a README that answers:
- What does this do?
- How do I run it locally?
- How do I deploy it?
- What are the gotchas?
- Who do I ask if I'm stuck?

Update it every time something changes. Treat it like production code.

**3. Use Async Communication (Slack/Discord) Wisely**

Startups live in Slack. Which means all knowledge is in Slack threads.

Make a rule: **Important decisions get documented outside of Slack.**

When someone figures out a tricky problem in Slack:
```
"Hey, this was tricky. Can you add this to the docs? 
Here's a link to this thread for context."
```

Slack is searchable but not structured. Documentation is.

**4. Do "Knowledge Pairing" Once a Week**

Pick two people who work in different areas. Have them spend 2 hours:
- Person A explains their system to Person B
- Person B asks questions
- They update the docs together

This is "expensive" for a startup. But it's cheaper than losing all knowledge when someone leaves.

**5. Make Your "Expert" Document Their Expertise**

You have someone who knows the legacy codebase inside out? Great. Make them spend 2 hours per week writing it down:
- Week 1: Architecture overview
- Week 2: How authentication works
- Week 3: How billing works  
- Week 4: Common bugs and how to fix them

In 8 weeks, you have a complete knowledge base. When they leave (and they will), it's not catastrophic.

### What Small Companies (10-50 People) Should Focus On

Small companies are in a weird spot. Too big to have everyone know everything. Too small to have redundancy.

Here's what I recommend:

**Priority 1: Identify Your "Single Points of Failure"**

List every system. For each one, ask:
- How many people can fix a production bug in this system?
- If that person left tomorrow, could we still operate?

If the answers are "1" and "no", you have a problem.

**Priority 2: Create "System Owners" and "System Understanders"**

For each critical system:
- **Owner**: The expert (1 person)
- **Understander**: Someone who knows 70% of what the owner knows (1-2 people)

Owner's job: Build features, handle complex issues
Understander's job: Handle simple issues, ask lots of questions, update docs

When the owner leaves, the understander becomes the owner. Someone else becomes the new understander.

**Priority 3: Make Docs Part of Code Review**

Add a checklist to every PR template:
```
- [ ] Code works
- [ ] Tests added
- [ ] README updated (if needed)
- [ ] Comments explain "why" not just "what"
- [ ] If this changes behavior, docs are updated
```

Don't merge until all boxes are checked.

**Priority 4: Do Monthly "What If" Scenarios**

Once a month, pick a person and ask:
"If [person] left tomorrow, what would break?"

Make a list. Fix the top 3 risks.

Next month, pick a different person.

### The Brutal Truth About Small Companies and Layoffs

Here's what nobody says out loud: **Small companies can't afford redundancy.**

You have 15 engineers. One person owns billing. One person owns infrastructure. One person owns the API.

You can't afford to have two people who know billing. You're too small.

So when layoffs happen, you **will** lose critical knowledge. It's unavoidable.

But you can minimize the damage:

**Before layoffs:**
- Document everything obsessively
- Make knowledge sharing a weekly habit
- Ensure docs are up-to-date

**During layoffs:**
- If possible, give notice period for knowledge transfer
- Record video walkthroughs from departing employees
- Extract knowledge from Slack/email/PRs before access is revoked

**After layoffs:**
- Do immediate knowledge assessment
- Identify gaps
- Prioritize learning the highest-risk areas

### The Hard Decision: When to Invest in Knowledge Preservation

Every company asks: "How much should we invest in documentation and knowledge sharing?"

**Big Tech answer:** 20-30% of engineering time
- They can afford it
- They're optimizing for scale and longevity
- They have institutional knowledge spanning decades

**Mid-size company answer:** 10-15% of engineering time
- Balance between speed and sustainability
- They're old enough to have learned the hard way
- They're growing and need to scale knowledge

**Startup answer:** 5-10% of engineering time (but they often do 0%)
- They're optimizing for speed and survival
- They're betting they'll still exist to document later
- This is often a mistake

**My recommendation for small companies:**

Start at 5% and increase gradually:
- **Month 1-3:** READMEs and basic docs (5%)
- **Month 4-6:** Add knowledge sharing sessions (7%)
- **Month 7-9:** Start system deep dives (10%)
- **Month 10+:** Full documentation culture (10-15%)

This doesn't slow you down catastrophically, but it protects you from knowledge loss.

### What I Learned from Watching Different Companies

**The pattern is clear:**

Companies that survive knowledge loss have **systems for preserving knowledge**, not just policies.

- Big Tech has code search tools, mandatory design docs, and oncall rotation
- Mid-size companies have documentation budgets, tech lead rotations, and bus factor audits
- Successful startups treat documentation like production code

**The companies that struggle:**

- Rely on "tribal knowledge" and hallway conversations
- Treat documentation as a chore, not a habit
- Assume "everyone knows" without verifying
- Wait until after layoffs to start documenting

### The Scale Paradox

Here's the irony: **The smaller you are, the more critical documentation becomes.**

Big Tech can lose 10 people and barely notice. A startup loses 2 people and critical systems become mysteries.

But startups resist documentation the most because "we're too fast-moving to document."

This is exactly backwards.

If you're small and fast-moving, you **need** documentation because:
- People context-switch constantly
- Everyone wears multiple hats  
- There's no redundancy
- Losing one person is catastrophic

**The uncomfortable truth:** Small companies should document **more aggressively** than large companies, not less.

### A Reality Check for Founders and CTOs

If you're running a small engineering team, here's a test:

Pick your most critical system. Now imagine the person who built it gets hit by a bus tomorrow.

Ask yourself:
- Could your team deploy a bug fix?
- Could they add a new feature?
- Could they explain to a customer how it works?

If the answer is "no" or "probably not", you have a single point of failure.

You might think: "We can't afford to fix this now. We're too busy shipping features."

But here's the thing: **You can't afford NOT to fix it.**

Because when that person leaves (and they will - through layoffs, voluntary departure, or yes, getting hit by a bus), you'll spend 10x the time reconstructing knowledge that you could have preserved.

I've seen it happen. Multiple times. The pattern is always the same:

1. "We're too busy to document"
2. Expert leaves
3. Spend weeks reconstructing their knowledge
4. "We should have documented this"
5. Go back to "too busy to document"

Break the cycle. Start small. But start.

## In Closing

Have you experienced knowledge loss during layoffs or turnover? How did your team handle it? What would you do differently? I'd love to hear your stories.