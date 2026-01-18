---
title: Stop Losing Commits Between Branches - A Better Way to Manage Releases
date: '2025-12-15'
spoiler: How I built a tool to solve the nightmare of keeping dev and main branches in sync
cta: 'npm'
---

I've cherry-picked the wrong commits into production three times in the last year. Once, I missed a critical bug fix. Once, I accidentally included an unfinished feature. Once, I spent two hours manually comparing git logs to figure out what was already in `main` versus what was still stuck in `dev`.

Every team I've worked with has the same problem: **keeping long-lived branches in sync is a mess.**

You start with good intentions. "We'll merge `dev` into `main` for releases," you say. Then someone rebases. Someone else squashes commits. Someone cherry-picks a hotfix directly to `main`. Suddenly, your branch histories diverge, and you have no idea what's actually in production versus what's waiting in development.

I built `cherrypick-interactive` because I was tired of this pain. It's an interactive CLI that compares branches, shows you exactly what's missing, and lets you cherry-pick commits safely with conflict resolution built in.

Here's what I learned building it.

## The Problem Nobody Talks About

Most Git tutorials assume a simple workflow: develop on `dev`, merge to `main`, done. But reality is messier.

**What actually happens:**

```
Week 1: Merge dev → main for release v1.0.0
Week 2: Hotfix committed directly to main
Week 3: Rebase dev to clean up history
Week 4: Cherry-pick some commits to main for v1.1.0
Week 5: Squash merge a feature branch
Week 6: "Which commits are in production again?"
```

Now your branches have diverged. `git log` shows different commits even though they contain the same changes. Cherry-picking becomes guesswork.

**The manual approach:**
```bash
# Compare branches manually
git log origin/main..origin/dev --oneline

# Hope you can identify which commits are actually missing
# Copy commit hashes one by one
# Cherry-pick each one
git cherry-pick abc123
git cherry-pick def456
# Resolve conflicts manually
# Repeat 20 times
# Miss one critical commit
# Deploy broken code
```

This is tedious, error-prone, and doesn't scale.

## What I Wanted: Git Cherry-Pick, But Interactive

I wanted something that felt like `yarn upgrade-interactive` but for Git commits.

**Requirements:**
- Show me commits in `dev` that aren't in `main`
- Let me select which ones to cherry-pick
- Handle conflicts without making me leave the terminal
- Preserve commit messages (even from squashed commits)
- Optionally bump version and create a release branch
- Make it impossible to lose track of what's been deployed

## The Solution: cherrypick-interactive

I built a CLI tool that does exactly this. Here's how it works:

### The Basic Workflow

```bash
npm install -g cherrypick-interactive

cherrypick-interactive
```

This opens an interactive prompt showing commits in `origin/dev` that aren't in `origin/main`:

```
? Select commits to cherry-pick (Press <space> to select)

❯ ◯ feat(auth): add OAuth support (2 days ago)
  ◯ fix(api): correct pagination offset (1 day ago)
  ◉ feat(ui): add dark mode (3 hours ago)
  ◯ chore(deps): bump dependencies (1 hour ago)
```

Select the commits you want, press Enter, and they're cherry-picked in the correct order (oldest → newest).

### Handling Conflicts (The Hard Part)

When a cherry-pick has conflicts, you get an interactive wizard:

```
⚠️  Conflict in src/api/auth.js

? How would you like to resolve this conflict?

  Use ours (keep current branch version)
  Use theirs (accept cherry-picked version)
  Open in editor (manual resolution)
  Show diff (view conflicting changes)
  Mark resolved (stage file as-is)
  ────────────────────────
  Use ours for ALL conflicts
  Use theirs for ALL conflicts
  Stage ALL files
  Launch mergetool
```

This was the key insight: **most conflicts have patterns.** If you're cherry-picking dependency updates, you probably want "theirs" for `package-lock.json`. If you're cherry-picking a hotfix over a feature branch, you might want "ours" for certain files.

The wizard lets you resolve conflicts file-by-file or in bulk, without leaving the terminal.

### The Release Branch Workflow

Here's where it gets powerful. Most teams do this:

```bash
# Manually bump version in package.json
git checkout main
git pull
git checkout -b release/1.2.0
# Cherry-pick commits one by one
# Hope you got them all
# Push and open PR
```

With `cherrypick-interactive`, it's one command:

```bash
cherrypick-interactive \
  --semantic-versioning \
  --version-file ./package.json \
  --create-release \
  --push-release \
  --draft-pr
```

This:
1. Compares `dev` and `main`
2. Shows missing commits
3. Analyzes commit messages for version bump (using Conventional Commits)
4. Creates `release/1.2.0` branch from `main`
5. Cherry-picks selected commits
6. Updates `package.json` version
7. Pushes branch and opens a **draft PR** on GitHub

All automated. All safe. All traceable.

## The Features I Needed (That Didn't Exist)

### 1. Preserve Commit Messages from Squashed Commits

When you squash-merge a feature branch, the original commits disappear. If you later cherry-pick from `dev` to `main`, you need to preserve those original commit messages for semantic versioning to work.

Most cherry-pick tools lose this information. `cherrypick-interactive` preserves it using `git commit -C <hash>`.

### 2. Pattern-Based Filtering

Not all commits should be cherry-picked. I added filtering:

```bash
# Exclude dependency updates and CI changes
cherrypick-interactive --ignore-commits "^chore\(deps\)|^ci:"
```

### 3. Semantic Version Detection

The tool analyzes commit messages to determine the version bump:

```
feat(auth): add OAuth → minor bump (1.0.0 → 1.1.0)
fix(api): correct offset → patch bump (1.0.0 → 1.0.1)
feat!: breaking change → major bump (1.0.0 → 2.0.0)
```

You can also exclude certain commits from version calculation:

```bash
cherrypick-interactive --ignore-semver "bump|dependencies|merge"
```

### 4. Dry Run Mode

Before doing anything risky:

```bash
cherrypick-interactive --dry-run
```

Shows exactly what would happen without making any changes.

## How I Built It

### The Tech Stack

- **Node.js** - For the CLI runtime
- **Inquirer.js** - For interactive prompts
- **simple-git** - For Git operations
- **conventional-commits-parser** - For semantic versioning
- **GitHub CLI (gh)** - For creating PRs

### The Core Algorithm

```javascript
async function findMissingCommits(devBranch, mainBranch) {
  // Get commits in dev
  const devCommits = await git.log([devBranch]);
  
  // Get commits in main
  const mainCommits = await git.log([mainBranch]);
  
  // Find commits in dev that aren't in main
  // This is trickier than it sounds because:
  // - Squashed commits have different hashes
  // - Rebased commits have different hashes
  // - Cherry-picked commits have different hashes
  
  // Solution: Compare commit messages and timestamps
  const missing = devCommits.filter(devCommit => {
    return !mainCommits.some(mainCommit => {
      // Same message and similar timestamp = likely the same commit
      return mainCommit.message === devCommit.message &&
             Math.abs(mainCommit.date - devCommit.date) < 60000;
    });
  });
  
  return missing;
}
```

This handles squashed commits, rebased commits, and cherry-picked commits by comparing content rather than hashes.

### Conflict Resolution

The conflict resolution wizard was the hardest part:

```javascript
async function resolveConflicts(conflictedFiles) {
  for (const file of conflictedFiles) {
    const choice = await inquirer.prompt([{
      type: 'list',
      name: 'resolution',
      message: `Conflict in ${file}. How to resolve?`,
      choices: [
        'Use ours',
        'Use theirs',
        'Open in editor',
        'Show diff',
        // ... more options
      ]
    }]);
    
    switch (choice.resolution) {
      case 'Use ours':
        await git.raw(['checkout', '--ours', file]);
        await git.add(file);
        break;
      case 'Use theirs':
        await git.raw(['checkout', '--theirs', file]);
        await git.add(file);
        break;
      // ... handle other cases
    }
  }
  
  // Preserve original commit message
  await git.raw(['commit', '-C', originalCommitHash]);
}
```

The `-C` flag is crucial. It preserves the original commit's message, author, and date even after resolving conflicts.

## Real-World Usage

Here's how I use it in practice:

### Weekly Release Process

```bash
# Every Friday, prepare release
cherrypick-interactive \
  --semantic-versioning \
  --version-file ./package.json \
  --create-release \
  --draft-pr \
  --ignore-commits "^ci:|^docs:" \
  --ignore-semver "bump|dependencies"
```

This creates a draft PR with all commits from the last week, excluding CI and docs changes, with the correct semantic version bump.

### Hotfix Cherry-Picking

```bash
# Cherry-pick specific commits for hotfix
cherrypick-interactive \
  --since "2 days ago" \
  --ignore-commits "^feat:"
```

Shows only non-feature commits from the last 2 days (likely bug fixes).

### Preview Before Release

```bash
# See what would be released without doing it
cherrypick-interactive --dry-run
```

## What I Learned Building This

### 1. Git Is More Complex Than You Think

Cherry-picking seems simple until you deal with:
- Squashed commits
- Rebased branches
- Merge commits
- Empty commits
- Binary files
- Submodules

Each case needs special handling.

### 2. Interactive CLIs Need Good UX

Early versions just printed commit hashes. Useless. The interactive selection with commit messages and dates made it actually usable.

Key UX decisions:
- Show commit message + relative time ("2 days ago")
- Default to most recent commits selected
- Allow bulk actions for conflicts
- Show progress during cherry-picking
- Provide clear error messages

### 3. Semantic Versioning Needs Context

Not all commits should affect versioning. Dependency updates, documentation changes, and CI tweaks shouldn't bump the version.

The `--ignore-semver` flag was essential for real-world usage.

### 4. Dry Run Mode Is Essential

Nobody trusts a tool that modifies Git history without a preview. `--dry-run` was the first feature users asked for.

## Installation & Usage

Install globally:

```bash
npm install -g cherrypick-interactive
```

Or run without installing:

```bash
npx cherrypick-interactive
```

**Basic usage:**
```bash
cherrypick-interactive
```

**Full release workflow:**
```bash
cherrypick-interactive \
  --semantic-versioning \
  --version-file ./package.json \
  --create-release \
  --push-release \
  --draft-pr
```

**Preview changes:**
```bash
cherrypick-interactive --dry-run
```

**Filter commits:**
```bash
cherrypick-interactive \
  --ignore-commits "^ci:|^chore\(deps\):" \
  --ignore-semver "bump|dependencies"
```

For full documentation and options, check out the [npm package](https://www.npmjs.com/package/cherrypick-interactive).

## When You Should Use This

This tool is most valuable if your team:
- Maintains separate `dev` and `main` branches
- Uses semantic versioning based on commit messages
- Cherry-picks commits between branches regularly
- Deals with squashed commits or rebased branches
- Creates release branches for review before merging
- Wants to automate the release preparation process

**When not to use it:**
- You merge everything linearly (no cherry-picking needed)
- You use GitHub Flow (single main branch)
- You have simple release processes that don't need automation

## What's Next

I'm working on:
- **Changelog generation** - Automatically create release notes from selected commits
- **Slack/Teams notifications** - Alert your team when a release branch is ready
- **Multiple branch comparison** - Compare more than two branches at once
- **Web UI** - For teams who prefer graphical interfaces

## In Closing

Cherry-picking commits between branches shouldn't be this hard. Git gives you the primitives, but doesn't give you the workflow.

`cherrypick-interactive` is the workflow I wish existed when I started doing release management. It's saved me hours of manual work and prevented several "oops, we deployed the wrong thing" incidents.

If you're tired of manually comparing branches, losing track of commits, or dealing with messy cherry-pick conflicts, give it a try:

```bash
npm install -g cherrypick-interactive
```

The source code is open source and available on npm. Contributions, bug reports, and feature requests are welcome.

What's your release management process like? What tools do you use to keep branches in sync? I'd love to hear about your workflow.
