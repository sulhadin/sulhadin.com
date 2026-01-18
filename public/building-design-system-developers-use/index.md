---
title: Building a Design System That Developers Actually Use
date: '2025-02-10'
spoiler: Why most design systems fail and how to build one that your team will love
cta: 'react'
---

Six months after launching our "comprehensive design system," I watched a senior developer copy-paste button styles directly into a feature branch instead of using our beautifully crafted Button component. When I asked why, he said: "It was faster than figuring out which of the 47 props I needed."

That hurt. We'd spent three months building this system. We had every variant imaginable. We had Storybook documentation. We had design tokens. We had everything the Medium articles said we needed.

Except adoption. Our design system had a 32% adoption rate. Developers were building one-off components, designers were frustrated by inconsistency, and I was stuck maintaining a component library nobody wanted to use.

This is the story of how we rebuilt our design system from scratch with one principle: if developers don't use it, it doesn't matter how good it is.

## The Problem: Why Design Systems Fail

Most design systems fail for one of two reasons:

**Too Rigid:** "You must use Button with variant='primary' and size='medium' and iconPosition='left' and..."
Result: Developers need a simple button with custom padding. The design system doesn't allow it. They build their own.

**Too Vague:** "Here are some components. Figure it out."
Result: Every developer interprets the system differently. You end up with 12 different button implementations anyway.

Our first design system was too rigid. We tried to anticipate every use case and codify it into props. The result was components with 15+ props, each with 3-5 possible values. The decision paralysis was real.

```tsx
// Our over-engineered Button from v1
<Button
  variant="primary" | "secondary" | "tertiary" | "ghost" | "link"
  size="xs" | "sm" | "md" | "lg" | "xl"
  rounded="none" | "sm" | "md" | "lg" | "full"
  shadow="none" | "sm" | "md" | "lg"
  iconPosition="left" | "right" | "only"
  loading={boolean}
  disabled={boolean}
  fullWidth={boolean}
  // ... 8 more props
/>
```

Nobody could remember which combination they needed. They'd spend 5 minutes in Storybook, get frustrated, and just write their own button.

## Principle 1: Start With What Developers Actually Do

Instead of building what we thought developers needed, I spent a week analyzing our codebase:

```bash
# Find all button-like elements
git grep -n "onClick" --and -E "(button|Button)" | wc -l
# Result: 247 instances

# How many use our design system Button?
git grep -n "import.*Button.*from.*@/components" | wc -l
# Result: 79 instances

# Adoption rate: 32%
```

I looked at the 168 instances that didn't use our Button. What did they have in common?

**Pattern 1: Simple buttons with custom spacing**
```tsx
<button className="px-6 py-3 bg-blue-500 text-white rounded">
  Save
</button>
```

**Pattern 2: Icon-only buttons**
```tsx
<button className="p-2 hover:bg-gray-100 rounded-full">
  <XIcon />
</button>
```

**Pattern 3: Link-styled buttons**
```tsx
<button className="text-blue-500 underline hover:text-blue-700">
  Learn more
</button>
```

Our design system Button couldn't do any of these without fighting the API.

## Principle 2: Design the API Developers Want to Write

I asked our team: "What would the perfect Button API look like?"

The answers were revealing:

- "Just let me add className"
- "Don't make me choose between 5 variants when I only need 2"
- "Make the common case easy, not the edge case"
- "Show me real examples, not prop tables"

We redesigned the Button API based on actual usage:

```tsx
// v2: Simple by default, extensible when needed
interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  // That's it. Everything else comes from ...props and className
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        className // Override anything you want
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

**The key insight:** We went from 15 props to 2, but made the component more flexible by accepting className and spreading props.

```tsx
// All of these just work now:

// Standard usage
<Button variant="primary">Save</Button>

// Custom spacing
<Button variant="primary" className="px-8 py-4">
  Large Save Button
</Button>

// Icon-only
<Button variant="ghost" className="p-2 rounded-full">
  <XIcon />
</Button>

// Link-styled
<Button variant="ghost" className="text-blue-500 underline">
  Learn more
</Button>
```

Adoption jumped from 32% to 67% in two weeks.

## Principle 3: Documentation Is Not a Prop Table

Our v1 documentation looked like this:

```
Button Component

Props:
- variant: string - The button variant
- size: string - The button size
- rounded: string - The border radius
- shadow: string - The shadow depth
...
```

Developers didn't read it. They'd open Storybook, see a wall of knobs, and close the tab.

Our v2 documentation looked like this:

```tsx
// Button Component
// Use this for primary actions like submitting forms or confirming dialogs

// Most common usage (90% of cases):
<Button variant="primary">Save Changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Learn More</Button>

// With icons:
<Button variant="primary">
  <SaveIcon className="mr-2" />
  Save Changes
</Button>

// Loading state:
<Button disabled={isLoading}>
  {isLoading ? <Spinner /> : 'Save'}
</Button>

// Need custom styles? Just add className:
<Button className="w-full justify-start">
  Custom Button
</Button>

// Props:
// - variant?: 'primary' | 'secondary' | 'ghost'
// - size?: 'sm' | 'md' | 'lg'
// - All standard button props (onClick, disabled, etc.)
```

**What changed:**
- Examples first, props last
- Real use cases, not abstract descriptions
- Copy-paste ready code
- Showed the escape hatch (className) prominently

Developers stopped asking "how do I..." questions in Slack.

## Principle 4: Measure Adoption, Not Completion

Our v1 metrics:

- ✅ 47 components built
- ✅ 100% Storybook coverage
- ✅ TypeScript types for everything
- ❌ 32% adoption rate

Our v2 metrics:

- Components built: 12 (we deleted 35)
- Adoption rate: 67% → 89% over 3 months
- Support questions: -73%
- Design inconsistencies: -81%
- Time to implement new feature: -40%

We tracked adoption with a simple ESLint rule:

```js
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'JSXElement[openingElement.name.name="button"]',
        message: 'Use <Button> from @/components/ui instead of raw <button>'
      }
    ]
  }
};
```

This gave us warnings (not errors) when developers used raw HTML elements instead of design system components. We could track adoption over time and see which components weren't being used.

## Principle 5: Build What You Need, Not What You Might Need

Our v1 system tried to handle every possible button variant upfront:

- 5 color variants
- 5 size variants  
- 4 rounded variants
- 4 shadow variants
- 3 icon positions
- 2 loading states

That's 5 × 5 × 4 × 4 × 3 × 2 = 2,400 possible combinations.

Nobody needed 2,400 button variations. They needed 3-5 that covered 95% of use cases.

Our v2 approach:

```tsx
// Start with the absolute minimum
function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

// Add variants only when you see the same pattern 3+ times
// Week 1: Added variant prop after seeing "bg-blue-500" 8 times
// Week 2: Added size prop after seeing different padding 5 times
// Week 3: Added loading state after 4 PRs implemented it differently
// Week 4-12: Nothing. The component was done.
```

When someone needed something custom, they could use className. If we saw the same className pattern 3+ times, we'd consider adding it as a variant.

## Principle 6: Composition Over Configuration

Our v1 Select component had 23 props to handle every possible configuration:

```tsx
<Select
  options={options}
  value={value}
  onChange={onChange}
  searchable={true}
  clearable={true}
  multi={true}
  loading={isLoading}
  placeholder="Select..."
  renderOption={customRender}
  renderValue={customValue}
  onSearch={handleSearch}
  // ... 12 more props
/>
```

Our v2 Select used composition:

```tsx
<Select value={value} onValueChange={onChange}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectSearch onSearch={handleSearch} />
    {options.map(option => (
      <SelectItem key={option.id} value={option.id}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Why composition won:**
- Easy cases stayed easy: `<Select><SelectTrigger>...</SelectTrigger></Select>`
- Complex cases became possible: Developers could inject custom components anywhere
- No prop explosion: Each component had 2-4 props max
- Self-documenting: The JSX structure showed the component hierarchy

Developers understood it immediately because it looked like HTML.

## Principle 7: Make Breaking Changes Impossible to Miss

We used TypeScript to make breaking changes fail loudly:

```tsx
// v1: Changing the API broke things silently
<Button color="blue" /> // Worked
// We changed "color" to "variant"
<Button color="blue" /> // Still compiled, but button was unstyled

// v2: Breaking changes cause TypeScript errors
<Button color="blue" />
//      ^^^^^ 
// Property 'color' does not exist on type 'ButtonProps'
// Did you mean 'variant'?
```

We also added deprecation warnings:

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  /** @deprecated Use variant instead */
  color?: never;
}

export function Button({ color, ...props }: ButtonProps) {
  if (color) {
    console.warn('Button: "color" prop is deprecated. Use "variant" instead.');
  }
  // ...
}
```

When we needed to make breaking changes, we:
1. Released the new API alongside the old one
2. Added deprecation warnings
3. Gave developers 2 sprints to migrate
4. Used find-and-replace with AST tools (jscodeshift) to automate migrations
5. Removed the old API

```bash
# Example jscodeshift transform
npx jscodeshift -t transforms/button-color-to-variant.js src/
# Automatically updates: <Button color="blue" /> → <Button variant="primary" />
```

## Principle 8: Design Tokens That Actually Work

Our v1 design tokens were technically correct but practically useless:

```js
// tokens.js
export const colors = {
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  // ... 50 more blues
  red50: '#fef2f2',
  // ... 50 more reds
};
```

Developers asked: "Which blue do I use for a button?"

Our v2 tokens were semantic:

```js
// tokens.js
export const colors = {
  // Raw values (internal use only)
  _blue500: '#3b82f6',
  _blue600: '#2563eb',
  
  // Semantic tokens (use these)
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  secondary: '#64748b',
  danger: '#ef4444',
  
  // Component-specific tokens
  buttonPrimary: '#3b82f6',
  buttonPrimaryHover: '#2563eb',
  buttonSecondary: '#64748b',
};
```

But the real win was generating tokens from design:

```bash
# We used style-dictionary to sync with Figma
npx style-dictionary build

# Output:
# ✓ Generated tokens.js
# ✓ Generated tokens.css
# ✓ Generated tokens.json (for mobile)
# ✓ 142 tokens synced from Figma
```

Designers changed a color in Figma → CI automatically updated our tokens → Developers got the change in the next pull.

## Principle 9: Show, Don't Tell

Instead of writing documentation, we created a gallery of real production UI:

```tsx
// examples/dashboard.tsx
export function DashboardExample() {
  return (
    <div>
      <h2>This is how we use the design system in production</h2>
      {/* Actual dashboard code from our app */}
    </div>
  );
}
```

Developers could:
1. See real examples
2. Copy the code
3. Understand the patterns we use

We also created "recipes" for common patterns:

```tsx
// recipes/form-with-validation.tsx
// How we build forms with validation feedback

export function FormRecipe() {
  const [errors, setErrors] = useState({});
  
  return (
    <form>
      <Input 
        label="Email"
        error={errors.email}
        required
      />
      
      <Input
        label="Password"
        type="password"
        error={errors.password}
        required
      />
      
      <Button type="submit" variant="primary">
        Sign In
      </Button>
    </form>
  );
}
```

This was more valuable than any documentation we wrote.

## Principle 10: Make It Easy to Contribute

Our v1 system was maintained by a "Design Systems Team" (me). Contributions required:

1. Design review
2. Architecture review  
3. Storybook stories
4. Unit tests
5. Integration tests
6. Documentation
7. Migration guide

Nobody contributed. It was too much work.

Our v2 system made contributions trivial:

```tsx
// To add a new component, create this file:
// components/ui/alert.tsx

export function Alert({ children, ...props }) {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded" {...props}>
      {children}
    </div>
  );
}

// That's it. It's in the design system now.
```

We removed gatekeeping:
- ❌ No design review needed for small changes
- ❌ No extensive testing required (TypeScript catches most issues)
- ❌ No documentation mandate (examples were enough)

✅ PR with working code → Approved → Merged

Contributions went from 0.5 per month to 4-5 per month.

## What Success Looked Like

**Before (v1 - 6 months in):**
- Components: 47
- Adoption: 32%
- Weekly support questions: 12
- Time to implement new UI: 4 hours
- Developer satisfaction: 3.2/5

**After (v2 - 6 months in):**
- Components: 18 (we deleted 29 that nobody used)
- Adoption: 89%
- Weekly support questions: 3
- Time to implement new UI: 45 minutes
- Developer satisfaction: 4.6/5

**Real impact:**
- Designers stopped complaining about inconsistent UI
- New developers got productive faster
- We shipped features 40% faster
- Bug reports related to UI dropped 67%

## The Components We Actually Built

Our v2 system has 18 components:

**Primitives (10):**
Button, Input, Select, Checkbox, Radio, Switch, Textarea, Label, Badge, Avatar

**Composition (5):**
Dialog, Dropdown, Popover, Tabs, Card

**Feedback (3):**
Alert, Toast, Spinner

That's it. Everything else is either:
- Composed from these primitives
- Too specific to the feature (doesn't belong in design system)
- Rare enough to inline

## What I'd Do Differently

**Start even smaller.** We could have launched with just 5 components: Button, Input, Select, Dialog, Card. Everything else could wait.

**Version the design system separately.** We kept it in our main repo, which meant breaking changes affected the whole app. Separate versioning would have given teams flexibility.

**Invest in visual regression testing earlier.** We caught several "oops, we broke Button everywhere" moments manually. Percy or Chromatic would have automated this.

**Create better TypeScript types from the start.** We spent too much time fighting with generic types. Starting with simpler, more concrete types would have been faster.

## The Principles That Actually Mattered

1. **Developers won't use it if it's hard.** Optimize for the common case.
2. **Examples > Documentation.** Show real code, not prop tables.
3. **Measure adoption, not features.** A design system with 50 components that nobody uses is worthless.
4. **Build only what you need.** Every component costs maintenance. Minimize that cost.
5. **Composition > Configuration.** Complex APIs lead to confusion and low adoption.
6. **Make it easy to contribute.** Your design system is only as good as your team's willingness to use and improve it.
7. **Trust developers to do the right thing.** Allow className overrides. Allow custom styles. They'll use it responsibly.

## In Closing

A design system isn't about having every component imaginable. It's about making developers productive and consistent UI inevitable.

If your design system has low adoption, you don't have a developer problem—you have an API problem. Redesign for the developers you have, not the developers you wish you had.

What challenges are you facing with your design system? I'd love to hear about what's working and what isn't.
