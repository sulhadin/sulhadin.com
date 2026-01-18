---
title: Code Review - How to Give Feedback That Actually Helps
date: '2025-01-19'
spoiler: What I learned from giving 2,000+ code reviews (and getting plenty wrong)
cta: 'react'
---

I've given over 2,000 code reviews in my career. I've also received hundreds. Some made me a better engineer. Others made me want to quit programming and become a gardener.

The difference wasn't technical accuracy—the most technically correct review I ever received was also the most demoralizing. It was a wall of 47 comments, each pointing out something "wrong" with my code. The reviewer was right about every single point. I merged nothing and rewrote the entire PR in anger.

The best review I ever received had three comments. Two asked questions about my approach. One suggested an alternative I hadn't considered. I learned something, improved the code, and felt good about it.

Code review isn't about finding mistakes. It's about helping someone improve their code while respecting that they're a human being who's probably spent hours on this work and is emotionally invested in it.

This is what I've learned about giving feedback that actually helps.

## The Reviews I'm Not Proud Of

Let me start with my failures because I've made every mistake in the book.

**Mistake 1: The "Well Actually" Review**

```typescript
// Author's code
function getUserById(id) {
  return users.find(u => u.id === id);
}

// My comment (2018, cringe warning):
"Actually, this is O(n) complexity. You should use a Map for O(1) lookups. 
Also, find() returns undefined when not found, so you should handle that. 
Also, this isn't type-safe. Consider:

const userMap = new Map(users.map(u => [u.id, u]));
function getUserById(id: string): User | undefined {
  return userMap.get(id);
}

Please update."
```

What was wrong with this review? Everything:
- I assumed the author didn't know about Maps or complexity (they probably did)
- I prescribed a solution instead of discussing trade-offs
- I used "Actually" (never use "Actually")
- I didn't ask about the context or constraints
- The tone implied they'd done something wrong

The author pushed back: "This function is called twice per page load with 15 users. The Map optimization would make the code more complex for zero measurable benefit."

They were right. I was technically correct but contextually wrong.

**Mistake 2: The Drive-By Review**

```typescript
// My comment (2019):
"Why are you doing it this way?"
```

That's it. No context. No suggestion. Just a vague question that implied their approach was wrong without explaining what or why.

The author responded: "I'm not sure what you mean. Can you elaborate?"

I never responded. I'd forgotten about the PR and moved on. The author was left hanging, unsure if they should merge or wait for my clarification. They waited three days, then merged anyway, now anxious about whether they'd done something wrong.

**Mistake 3: The Architecture Astronaut**

```typescript
// Author's code: A simple form component
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

// My comment (2020):
"This component has too many responsibilities. You should:
1. Extract form state to a custom hook
2. Use a form library like React Hook Form
3. Separate presentation from logic
4. Add validation with Yup or Zod
5. Consider using a state machine for the submission flow
6. Add error boundaries

Here's a better architecture: [30 lines of code]"
```

The author's response: "This is a simple login form for an internal tool. I just need to submit two fields."

I'd let perfect be the enemy of good. The original code was fine for its context. My "better architecture" would have been over-engineering.

## What Changed: The Question That Shifted Everything

In 2021, I started asking myself one question before commenting on any PR:

**"If I were pair programming with this person, would I say this out loud?"**

If the answer was no—if I'd feel weird saying "Actually, you should use a Map" while sitting next to someone—I rewrote the comment.

This simple filter eliminated 60% of my unnecessary comments.

## The Framework I Use Now

I categorize my feedback into three buckets:

### 1. Must Fix (Blocking Issues)

These are rare. Use this only for:
- Security vulnerabilities
- Data corruption risks
- Breaking changes that affect other teams
- Violations of legal/compliance requirements

```typescript
// Example of a blocking issue
function deleteUser(userId) {
  // ⚠️ BLOCKING: This doesn't check if the current user has 
  // permission to delete other users. Security issue.
  return db.users.delete(userId);
}
```

**How I phrase it:**
```
⚠️ Security concern: This function doesn't check user permissions 
before deletion. Anyone with API access could delete any user.

We need to add an authorization check here. Would something like
this work?

[code suggestion]

Happy to pair on this if you'd like.
```

Notice:
- I explain why it's blocking
- I suggest a solution
- I offer to help

### 2. Should Consider (Non-Blocking Suggestions)

These are improvements that would make the code better but aren't critical:
- Performance improvements (with actual impact)
- Readability improvements
- Patterns that would reduce future maintenance
- Edge cases that might matter

```typescript
// Author's code
function formatDate(date) {
  return date.toLocaleDateString('en-US');
}

// My comment (non-blocking)
```

**How I phrase it:**
```
Nit: This hardcodes 'en-US' locale. Since we're expanding to 
Europe in Q2, we might want to use the user's locale:

const userLocale = getUserLocale();
return date.toLocaleDateString(userLocale);

Not blocking - feel free to merge as-is if you want to handle 
this separately.
```

Notice:
- I prefix with "Nit" to signal it's not blocking
- I explain the business context (Europe expansion)
- I explicitly say it's not blocking
- I respect their choice to address it now or later

### 3. Curious (Questions to Learn)

These are questions where I genuinely want to understand their thinking:

```typescript
// Author's code
const users = await fetchUsers();
const sortedUsers = [...users].sort((a, b) => 
  a.name.localeCompare(b.name)
);
```

**How I phrase it:**
```
Question: I see you're creating a new array before sorting. 
Is that because fetchUsers() returns a frozen array, or is 
there another reason?

I'm asking because I'm not sure if we need the spread here, 
and I want to understand the constraint.
```

Notice:
- I start with "Question:" to signal I'm asking, not criticizing
- I offer a hypothesis (frozen array) to show I've thought about it
- I explain why I'm asking
- I'm genuinely curious, not passive-aggressive

## The Comments I Delete Before Posting

I draft comments and then delete about 30% of them. Here are the patterns I've learned to catch:

### Delete: Style Preferences Disguised as Best Practices

```typescript
❌ "You should use const instead of let here"
✅ [deleted - our linter handles this, no need to comment]

❌ "This should be a named function, not an arrow function"
✅ [deleted - style preference, both are fine]

❌ "Can you add more whitespace? This is hard to read"
✅ [deleted - subjective, and Prettier handles formatting]
```

If a linter or formatter can enforce it, don't comment on it. Configure your tools instead.

### Delete: Questions That Are Really Criticisms

```typescript
❌ "Why did you choose this approach?"
✅ "I'm curious about this approach. I've typically seen X used 
for this case. Was there something about X that didn't work here, 
or is there an advantage to Y I'm not seeing?"

❌ "Have you considered performance?"
✅ "I'm thinking about the performance here with large lists. 
Have you tested with ~10k items? If not, might be worth testing 
to see if we need virtualization."

❌ "Is this necessary?"
✅ [deleted - if I can't articulate why it might not be necessary, 
I shouldn't ask]
```

Bad questions feel like traps. Good questions show genuine curiosity and give context.

### Delete: Alternative Approaches Without Trade-Off Discussion

```typescript
❌ "Use reduce instead:
const result = items.reduce((acc, item) => {
  // 10 lines of complex reduce logic
}, []);"

✅ "The map/filter chain is clear and readable. The reduce 
alternative would be slightly more efficient but harder to 
understand. I'd keep it as-is unless we're seeing performance 
issues with large arrays."

Or just:
✅ [deleted - their approach is fine, my preference doesn't matter]
```

Every alternative has trade-offs. If you're not discussing them, you're just showing off.

## The Timing Question: When to Review

I used to review PRs immediately, often within minutes. This was a mistake.

**Too fast** (within 30 minutes):
- The author might still be working on it
- You catch issues they would have caught themselves
- It feels like surveillance
- You haven't given yourself time to think

**Too slow** (more than 2 days):
- The author has context-switched to other work
- The code is harder to change (other PRs depend on it)
- The author feels blocked and frustrated
- You've probably forgotten the broader context

**My current approach:**
- Review within 4-8 hours during work hours
- For urgent PRs, authors can ping me directly
- For draft PRs, I wait until marked "Ready for Review"
- I block 30 minutes twice a day just for reviews

This gives authors time to self-review but doesn't leave them hanging.

## How I Handle Disagreements

Sometimes I genuinely think an approach is wrong, and the author disagrees. Here's my process:

### Level 1: Understand Their Reasoning
```
"I see your point about X. Can you help me understand why you 
chose this over Y? I might be missing something about the 
constraints."
```

Often, they have context I don't. Maybe there's a deadline. Maybe they tried my approach and it didn't work. Maybe I'm wrong.

### Level 2: Explain My Concerns Concretely
```
"I'm worried about Z because [specific scenario]. In production, 
this could lead to [specific problem]. Have you considered how 
this would handle [edge case]?"
```

Abstract concerns ("this feels wrong") don't help. Concrete scenarios do.

### Level 3: Suggest a Small Experiment
```
"What if we tried both approaches in a test environment? We could 
measure [specific metric] and see which works better for our case."
```

Data beats opinions. If we're both guessing, let's test.

### Level 4: Escalate or Defer
```
"We seem to have different views on this architecture decision. 
Since it affects multiple teams, should we bring this to the 
architecture review meeting? Or would you prefer to discuss 
synchronously?"
```

Sometimes async code review isn't the right forum. Moving to a call or design doc can resolve things faster.

### Level 5: Trust and Learn
```
"I still have concerns about X, but I trust your judgment on this. 
Let's merge it and revisit if we see issues. I'd love to hear how 
it works out."
```

Sometimes you have to trust people and learn from the outcome. I've been wrong enough times to know I don't have all the answers.

## What Good Reviews Look Like

Here's a real review I'm proud of (anonymized):

```typescript
// PR: Add caching to API client

// Comment 1 (blocking):
⚠️ Memory leak concern: This cache grows indefinitely. If users 
keep the app open for hours, we could hit memory limits.

Suggestion: Add a max size or TTL:

const cache = new LRU({ max: 1000, ttl: 1000 * 60 * 5 }); // 5 min

// Comment 2 (non-blocking):
Nit: The cache key is just the URL, so different POST requests 
to the same endpoint would share a cache entry. Probably not what 
we want?

Consider: Hash the request body into the cache key.

Not blocking - we can address in a follow-up if you prefer.

// Comment 3 (learning):
TIL: I didn't know about the stale-while-revalidate pattern you're 
using here. This is clever! Do you have a reference I could read 
about this approach?

// Final comment:
Nice work on this. The performance improvement should be 
significant for list views. Once the memory leak concern is 
addressed, this is good to merge.
```

Why this worked:
- Clear severity (blocking vs non-blocking)
- Specific problems with concrete solutions
- Acknowledged what was good
- I learned something and said so
- Overall positive tone

## The Human Side

Here's what I remind myself:

**The author is not their code.** "This function has a bug" is different from "You wrote buggy code." The first is about the code. The second is about the person.

**Code review is not a test.** I'm not grading their work. I'm collaborating on making it better.

**I'm not always right.** I phrase things as suggestions, not commands, because I might be wrong about the context, the constraints, or the best approach.

**Enthusiasm matters.** When something is clever or well-done, I say so. "This is really elegant" or "I like how you handled this edge case" costs nothing and matters a lot.

**Speed matters less than quality.** A thoughtful review in 8 hours is better than a rushed review in 30 minutes.

## What I Look For (In Order)

When I review code, here's my mental checklist:

1. **Does it work?** (functionality)
2. **Is it safe?** (security, data integrity)
3. **Will it break things?** (breaking changes, backwards compatibility)
4. **Can others understand it?** (readability, documentation)
5. **Will it be easy to change?** (maintainability)
6. **Is it tested?** (test coverage for critical paths)
7. **Is it fast enough?** (performance, only if it matters)
8. **Is it consistent?** (follows project patterns)

I stop at the first issue in each category. No point commenting on style if there's a security hole.

## The Review Comment I Wish I'd Received More

```
This is really good work. The approach is solid, the code is 
clean, and I learned something from reading it.

Two small things:
1. [specific suggestion]
2. [specific question]

Otherwise, looks great. Nice job!
```

Simple. Positive. Specific. Respectful.

## What I'm Still Learning

I still mess this up sometimes:

- I still occasionally leave "why?" comments without enough context
- I still sometimes suggest refactors that aren't worth the effort
- I still sometimes forget that someone spent hours on this and is nervous about my review

The difference now is that I notice faster and apologize when I get it wrong:

```
Sorry, my previous comment came across harsher than I intended. 
What I meant was: [clearer version]
```

Apologies in code reviews are underrated.

## In Closing

Code review is a skill, and like any skill, it takes practice. The goal isn't to be perfect. The goal is to help someone improve their code while making them feel respected and capable.

Before you post that comment, ask yourself:
- Is this helping them learn, or just showing off what I know?
- Would I say this out loud in a pairing session?
- Am I being specific, or just vaguely critical?
- Have I acknowledged what's good, or only pointed out problems?

Good code review makes both people better engineers. Bad code review makes people dread pushing code.

What are your code review challenges? What comments have helped you, and which ones have frustrated you? I'd love to hear your experiences.
