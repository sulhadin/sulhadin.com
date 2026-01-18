---
title: Onboarding Developers - The First Week That Makes or Breaks Them
date: '2025-05-25'
spoiler: What I learned from watching 50+ developers join our team (and remembering my own terrible first weeks)
cta: 'react'
---

I've watched over 50 developers join teams I've been on. I've also joined new teams 7 times in my career. The difference between a good first week and a bad one isn't subtle—it's the difference between "I'm excited to work here" and "I'm updating my resume."

The worst onboarding I experienced: Day 1, I was given a laptop, a Slack invite, and told "the codebase is on GitHub, let us know if you need anything." I spent three days trying to get the dev environment working. Nobody checked on me. I felt stupid for not figuring it out faster. By Friday, I was convinced I'd made a mistake taking the job.

The best onboarding I experienced: Day 1, my manager spent 30 minutes with me, not talking about code, but asking what I hoped to learn and what I was nervous about. My onboarding buddy pinged me every few hours to check in. By day 3, I'd shipped a tiny bug fix and felt like part of the team. By week 2, I was productive. By week 4, I was mentoring the next new hire.

The difference wasn't the company size, the tech stack, or the complexity of the work. It was intentionality. Someone had thought about what a new developer needs to succeed.

This is what I've learned about onboarding that actually works.

## The Mistake I Made as a First-Time Manager

In 2017, I became a team lead and hired my first developer. I was so excited to have help. I assumed that because I'd been through bad onboarding, I'd naturally do better.

Here's what I did:
- Sent them a README with setup instructions
- Gave them access to all the repos
- Assigned them a "good first issue"
- Told them to ask questions if they got stuck

Here's what happened:
- They spent 2 days debugging environment setup (a Docker networking issue I could have solved in 5 minutes)
- The "good first issue" required context about 3 different systems they didn't know existed
- They asked zero questions because they didn't know what to ask
- By Friday, they'd made zero progress and felt terrible

I thought I was being respectful of their autonomy. "They're senior, they'll figure it out," I told myself.

What I actually did was abandon them.

## What New Developers Actually Need (That We Forget)

I interviewed 15 developers who'd recently joined new teams. Here's what they said they needed most:

**1. Permission to not know things**
> "I felt stupid asking basic questions. Everyone seemed to just *know* where things were and how things worked. I didn't want to look incompetent."

**2. A map of the territory**
> "I didn't need to understand everything. I needed to know what I didn't need to worry about yet. Like, 'you can ignore the billing service for now, you'll learn it in month 2.'"

**3. Human connection before technical onboarding**
> "The technical stuff is easy to catch up on. What I really needed was to know: Do I belong here? Are these people I want to work with?"

**4. Quick wins**
> "I needed to ship *something* in the first week, even if it was tiny. It made me feel like I was contributing, not just consuming."

**5. Explicit norms**
> "I had no idea if it was okay to work 9-5 or if everyone worked late. I didn't know if I should ping people on Slack or wait for standup. Everything felt like a potential mistake."

None of this is about code. It's about psychology.

## The First Day: It's Not About Productivity

I used to pack the first day with information: company overview, tech stack explanation, codebase walkthrough, setup instructions. By 3pm, the new person was exhausted and had retained maybe 20% of what I'd said.

Now I do almost the opposite.

### My First Day Checklist (90 minutes total)

**9:00am - Welcome (15 minutes)**
```
- Coffee/tea chat, no laptops
- "How are you feeling? Nervous? Excited? Both?"
- "What are you hoping to learn here?"
- "What questions do you have right now?"
```

The goal: Make them feel like a person, not a resource.

**9:15am - Setup (45 minutes, with help)**
```
- I sit with them while they set up their laptop
- I narrate what they're doing and why
- When they hit issues (they will), I help immediately
- We celebrate when things work
```

The goal: Remove the "am I stupid for not being able to set this up?" anxiety.

**10:00am - Team Intros (30 minutes)**
```
- Meet the team on video call (not Slack)
- Everyone shares: name, role, one non-work thing about themselves
- New person shares the same
- No pressure to remember everyone
```

The goal: Put faces to names. Start building relationships.

**10:30am - The Map (30 minutes)**
```
- I draw (literally, on a whiteboard or Excalidraw) our system architecture
- Not details. Just boxes and arrows.
- "Don't worry about how any of this works yet. Just know it exists."
- "You'll work in this area [highlight] for your first month."
```

The goal: Orient them. Reduce the "I have no idea what anything does" anxiety.

**11:00am - Lunch (on us)**
```
- Virtual or in-person, with 1-2 team members
- No work talk unless they bring it up
- Get to know each other as humans
```

**1:00pm - First Task (30 minutes)**
```
- "Your only job today is to get the app running locally and click around."
- "Here's what you're looking for: [specific thing]"
- "If you get stuck, ping me. I'm here to help."
```

The goal: One simple, achievable task. Not productivity, just momentum.

**1:30pm - Done for the day (seriously)**
```
- "That's it. You're done. See you tomorrow."
- "Tonight, don't think about work. Tomorrow we'll start for real."
```

The goal: Respect their cognitive load. First days are exhausting.

This seems like barely anything. That's intentional. The first day isn't about productivity. It's about making someone feel welcome and safe.

## The First Week: Build Confidence, Not Features

I used to assign "real work" in week 1. The new person would struggle, feel behind, and start wondering if they were good enough for the job.

Now I structure the first week around confidence building.

### Day 2: Read and Run

**Morning: Guided Code Reading (2 hours)**
```
- I pair with them on a video call
- We look at one feature end-to-end
- "Let's trace what happens when you click this button"
- I explain the flow, they ask questions
- No pressure to remember everything
```

**Afternoon: Break Something (1 hour)**
```
- "Change this line to this. What do you think will happen?"
- They make the change, run it, see the result
- "Now change it back."
```

The goal: Learning by exploration without fear of breaking production.

### Day 3: Ship Something Tiny

**The First PR (4 hours)**
```
- Fix a typo in documentation
- Add a console.log for debugging
- Update a comment that's outdated
- Change a button color

Something that:
- Takes <2 hours
- Touches the codebase
- Goes through our full PR process (branch, commit, PR, review, merge)
- Doesn't require deep system knowledge
```

**Why this matters:**
They go through the entire development workflow: git, our branching strategy, CI, code review, deployment. They see that their changes actually ship. They feel like a contributor, not just an observer.

When their first PR merges, I make a big deal out of it:
```
"🎉 Congrats on your first merged PR! Welcome to the team!"
```

This is not patronizing. It's acknowledging that they've crossed a threshold.

### Day 4: Shadow a Code Review

**Morning: Watch Me Review (1 hour)**
```
- I review a PR while sharing my screen
- I narrate my thinking out loud
- "I'm looking for X. I'm checking Y. I'm wondering about Z."
- They see what "good" looks like
```

**Afternoon: Review Together (2 hours)**
```
- We review a PR together
- I ask, "What do you think about this?"
- I share my thoughts
- We discuss trade-offs
```

The goal: Learn the team's standards and values through observation, not by making mistakes.

### Day 5: Reflect and Plan

**Morning: Retrospective (30 minutes)**
```
- "What surprised you this week?"
- "What's still confusing?"
- "What do you want to learn next week?"
```

**Afternoon: Pick Next Task (30 minutes)**
```
- I show them 3 options for next week
- We discuss what each involves
- They choose based on what they want to learn
```

The goal: Give them agency. They're not a passenger, they're driving.

## What I Learned from My Mistakes

### Mistake 1: Information Dumping

I used to explain everything on day 1: architecture, deployment process, team norms, technical decisions, why we chose this framework, etc.

New people would nod along, overwhelmed, retaining almost nothing.

**What I do now:** Just-in-time information. I explain something right before they need it.

Example:
```
❌ Day 1: "Here's how our deployment process works: [15 minute explanation]"
✅ Day 4: "You're about to merge your first PR. Let me show you what happens next."
```

### Mistake 2: Assuming They'll Ask Questions

I'd say "let me know if you have questions" and then wonder why they never asked anything.

Turns out, new people don't know what questions to ask. They don't know what's normal to be confused about vs. what they should know already.

**What I do now:** Check in proactively, multiple times per day.

```
"How's it going? Stuck on anything?"
"This part is confusing for everyone at first. Making sense so far?"
"I remember being confused about X when I started. Is that tripping you up too?"
```

The third one is powerful. It normalizes confusion and gives them permission to admit they're stuck.

### Mistake 3: "Good First Issues" That Aren't

I'd label issues as "good first issue" based on technical complexity. Small file changes, simple logic, no architecture decisions needed.

But I'd forget that the new person doesn't have context. They don't know:
- Where this file is
- Why this code exists
- What other systems depend on this
- Whether their approach is "the team way" of doing things

**What I do now:** "Good first issues" are evaluated by context required, not code complexity.

Example of a truly good first issue:
```
✅ "Add a 'Copy to Clipboard' button to this specific component"
- File location is clear
- Behavior is obvious
- No system knowledge required
- We have 3 other examples in the codebase they can copy
```

Example of what I used to think was a good first issue:
```
❌ "Fix the bug where the dashboard doesn't update after saving"
- Requires understanding the data flow
- Requires knowing Redux, our API client, and React Query
- Could be caused by 5 different things
- "Simple" logic but requires tons of context
```

### Mistake 4: Assigning an Onboarding Buddy and Disappearing

I'd assign an onboarding buddy and assume they'd handle everything.

Two problems:
1. The buddy often didn't know what to do either
2. The new person felt awkward reaching out too much

**What I do now:** I'm the primary onboarding person for week 1. The buddy is backup and social support.

Week 1 structure:
```
- Me: Daily check-ins, task assignment, technical guidance
- Buddy: Casual check-ins, "how are you feeling?" conversations, lunch buddy
- Team: Welcoming but not overwhelming
```

Week 2+:
```
- Buddy: Takes over daily check-ins
- Me: Weekly 1-on-1s, escalation path
- Team: Normal collaboration
```

## The Onboarding Buddy Role (That Actually Works)

The buddy role is often poorly defined. "Help them out" is too vague.

Here's what I tell onboarding buddies:

### Your Job Is Not to Teach Them Everything

Your job is to make them feel less alone.

**Do this:**
- Ping them once in the morning: "How's it going? Need anything?"
- Ping them once in the afternoon: "Making progress? Want to chat through anything?"
- Invite them to lunch (virtual or in-person)
- When you see them struggling in Slack, DM them: "Want to hop on a call?"

**Don't do this:**
- Wait for them to reach out (they won't)
- Quiz them on technical knowledge
- Dump information on them
- Disappear for days

### Share the "Unwritten Rules"

New people don't know:
- Is it okay to work from 9-5 or does everyone work late?
- Can I expense lunch? What's the limit?
- Should I attend every meeting I'm invited to?
- Is it okay to say "I don't know"?
- Do people really use their vacation days or is it frowned upon?

**Your job:** Tell them explicitly.

```
"Most people work 9-5, some start earlier. Nobody cares as long as you're at standup."
"You can expense lunch up to $20/day, no approval needed."
"Skip any meeting that says 'optional.' We have too many meetings."
"Everyone says 'I don't know' constantly. It's normal here."
```

This removes so much anxiety.

## The Documentation That Actually Helps

Our old onboarding docs:
```
# Getting Started

## Setup
1. Clone the repo
2. Run npm install
3. Copy .env.example to .env
4. Run npm start

## Architecture
[30 pages of system architecture]

## Contributing
[10 pages of git workflow]
```

Nobody read past step 4. Too much information, no clear path.

Our new onboarding docs:

```
# Welcome!

Your first week is about getting comfortable, not being productive. 
Here's what you'll do:

## Day 1: Setup & Orientation
- [ ] Get laptop and accounts
- [ ] Meet the team
- [ ] Get the app running locally
- Done? Great! See you tomorrow.

## Day 2: Learn by Reading
- [ ] Pair with [manager] to trace through one feature
- [ ] Break something intentionally (in your local env!)
- [ ] Ask 5 questions (write them down as you think of them)

## Day 3: Ship Something
- [ ] Pick a "first PR" from this list: [link]
- [ ] Open your first PR
- [ ] Get it reviewed and merged
- [ ] Celebrate 🎉

## Day 4: Learn How We Work
- [ ] Shadow a code review
- [ ] Review a PR together with your buddy
- [ ] Read our team norms doc

## Day 5: Reflect & Plan
- [ ] Retrospective with your manager
- [ ] Pick what you want to work on next week

---

## FAQ

**What if I get stuck?**
Ping [buddy] or [manager] immediately. Seriously, don't spend more 
than 20 minutes stuck on something.

**What if I don't finish everything in a day?**
That's normal. This is a guide, not a strict schedule.

**What should I read?**
Nothing on day 1. We'll point you to specific docs as you need them.
```

This is a path, not a reference manual. New people follow it step by step.

## What Success Looks Like

After 1 week:
- They've shipped a PR (even if tiny)
- They know everyone's name
- They've asked questions without fear
- They have a rough mental model of the system
- They feel welcomed, not evaluated

After 1 month:
- They can work on small features independently
- They know who to ask for help with different topics
- They've contributed to team discussions
- They're starting to mentor the next new hire

After 3 months:
- They're fully productive
- They're making architectural suggestions
- They're reviewing others' PRs
- They've forgotten what it's like to be new (time to write down what they've learned!)

## What I'd Do Differently

**Start onboarding before day 1.** Send a welcome email a week before:
```
Hi! Excited to have you join next Monday. A few things to make day 1 smoother:

- Your laptop will be ready at 9am
- We'll set up accounts together (no prep needed)
- Dress code: whatever you're comfortable in
- We'll grab coffee and chat before diving into anything technical

Any questions before then? How are you feeling?
```

**Record more stuff.** New people ask the same questions. I should record myself explaining common things:
- System architecture overview
- How to run tests
- Deployment process

Not to replace live explanation, but to let them rewatch at their own pace.

**Create a "90-day learning path."** Not a strict curriculum, but a suggested progression:
```
Month 1: [Service A] - Understand auth and API layer
Month 2: [Service B] - Understand data processing
Month 3: [Service C] - Understand frontend state management
```

This gives structure without pressure.

## The Cost of Bad Onboarding

When onboarding fails, new hires:
- Take 2-3x longer to be productive
- Feel anxious and question their abilities
- Annoy existing team members with "basic" questions
- Sometimes quit within the first few months

I've seen good engineers leave great companies because of bad onboarding. The company blamed the engineer ("not a culture fit"). The real problem was that nobody helped them succeed.

Good onboarding isn't a nice-to-have. It's how you protect your hiring investment and build a healthy team culture.

## The Human Element

Here's what I remind myself every time someone new joins:

**They're probably scared.** They just left a place where they knew everything and everyone. Now they know nothing and nobody. That's terrifying.

**They want to contribute.** They're not trying to coast. They want to help. They just don't know how yet.

**They're watching everything.** How we treat them in week 1 shows them how we treat everyone. If we're kind and patient now, they'll be kind and patient with the next new person.

**First impressions are lasting.** A bad first week is hard to recover from. A good first week sets up months of success.

## In Closing

Onboarding is not a checklist. It's an investment in a relationship.

The question isn't "how fast can we get them productive?" It's "how can we help them feel confident, welcome, and excited to be here?"

Speed comes from confidence. Confidence comes from support. Support comes from intentional onboarding.

What's your onboarding experience been like, as someone joining or someone welcoming? What helped? What didn't? I'd love to hear your stories.
