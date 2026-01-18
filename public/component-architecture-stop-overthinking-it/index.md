---
title: Component Architecture - Stop Overthinking It
date: '2024-02-03'
spoiler: How to actually make architecture decisions based on real pain, not best practices
cta: 'react'
---

I've built component systems that nobody used. I've over-engineered solutions that seemed brilliant at 2am but collapsed under the weight of real product requirements. I've also built systems that scaled beautifully for years with minimal maintenance.

The difference wasn't the pattern I chose—it was understanding *when* to introduce complexity.

Most articles about component architecture present options as if they're mutually exclusive philosophies. In reality, you'll use all of them in the same codebase. The question isn't "which pattern is best?" It's "what does this specific component need to do?"

Let me show you how I actually make these decisions.

## The Problem (And Why Your First Solution Will Be Wrong)

Here's what actually happens: you build a Button component. It works great. Then someone needs an icon. You add an `icon` prop. Then someone needs the icon on the right. You add `iconPosition`. Then someone needs two icons. Then someone needs a loading state. Then someone needs it to work as a link sometimes.

Six months later, your Button has 15 props, three boolean combinations that don't work together, and a 200-line implementation file.

The mistake wasn't any single decision—it was not recognizing when the component's complexity crossed a threshold that demanded a different approach.

## How I Actually Make Architecture Decisions

Forget the patterns for a moment. Here's my decision tree:

### Start with the stupidest thing that works

```tsx
// This is fine
function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}
```

I'm serious. If this solves your problem, stop here. Most components never need more than this.

### Add variants only when you have 3+ instances of the same pattern

When I see the same props being passed to the same component three times, I extract a variant:

```tsx
// You keep writing this
<Button className="bg-blue-500 text-white px-4 py-2">Submit</Button>
<Button className="bg-blue-500 text-white px-4 py-2">Save</Button>
<Button className="bg-blue-500 text-white px-4 py-2">Continue</Button>

// Now introduce the variant
<Button variant="primary">Submit</Button>
```

Not before. Premature abstraction kills more codebases than premature optimization.

### Introduce composition when props start fighting each other

This is the key insight most articles miss. You don't choose compound components because they're "elegant"—you choose them when your prop API becomes hostile:

```tsx
// This is a signal you need composition
<Select
  value={value}
  onChange={onChange}
  options={options}
  renderOption={customRender}
  optionHeight={32}
  virtualScroll={true}
  groupBy="category"
  groupRender={groupRender}
/>
```

When you have props that configure props that configure other props, you've outgrown the single-component approach. Now compound components make sense:

```tsx
<Select value={value} onChange={onChange}>
  <Select.VirtualScroll itemHeight={32}>
    {groups.map(group => (
      <Select.Group key={group.id} label={group.name}>
        {group.items.map(item => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select.Group>
    ))}
  </Select.VirtualScroll>
</Select>
```

### Go headless when you need the same behavior with different UIs

I don't reach for headless components often. When I do, it's because I literally need to render the same logic with completely different markup:

```tsx
// Mobile app
function MobileDropdown() {
  const dropdown = useDropdown();
  return <BottomSheet {...dropdown} />;
}

// Desktop app  
function DesktopDropdown() {
  const dropdown = useDropdown();
  return <Popover {...dropdown} />;
}
```

If you're not shipping multiple UIs for the same component, you probably don't need this pattern.

## Real Decision: Building a Button

Let me walk through how I'd actually build a Button component for a production app, showing the evolution:

### Phase 1: MVP (Week 1)

```tsx
// button.tsx
interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-medium',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-900',
        className
      )}
      {...props}
    />
  );
}
```

This is what I ship first. It solves 80% of cases.

### Phase 2: Loading states emerge (Week 3)

```tsx
interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export function Button({ variant = 'primary', loading, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-medium inline-flex items-center gap-2',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-900'
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
```

I add loading state when I need it, not because I think I might need it someday.

### Phase 3: Icon complexity appears (Month 2)

```tsx
// NOW I consider composition, because this is getting messy:
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

// But wait - do I really need iconPosition? Let me check usage...
// *searches codebase*
// I find 47 buttons with left icons, 2 with right icons.

// Decision: Don't add iconPosition. For those 2 cases, use className.
// Keep it simple.

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  icon?: ReactNode;
}
```

This is the discipline that matters. I actively resist adding features.

### Phase 4: The "link button" problem (Month 4)

```tsx
// People want buttons that are actually links
// Bad solution: <Button href="..." />
// This creates a button that's sometimes a link, which is confusing

// Better solution: Separate components with shared styles
const buttonStyles = cva('px-4 py-2 rounded font-medium', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    }
  }
});

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  return <button className={buttonStyles({ variant })} {...props} />;
}

export function ButtonLink({ variant = 'primary', ...props }: LinkProps) {
  return <a className={buttonStyles({ variant })} {...props} />;
}
```

## What I've Learned The Hard Way

**Don't future-proof**. Every time I've built a component system to handle hypothetical future requirements, I got the requirements wrong. Build for today's problems.

**Composition isn't always better**. Compound components are harder to understand and harder to change. Only introduce that complexity when prop-based APIs break down.

**Variants should match design, not code**. If your designer has 3 button styles, you should have 3 variants. Don't create variants because you think they'll help with "code reuse."

**The best abstraction is often no abstraction**. I have components in production that are literally just styled divs with 5 lines of code. That's fine.

**TypeScript is not optional**. The only reason these patterns work is because TypeScript catches misuse. Without it, you're building on sand.

**Leave explicit escape hatches**. Always accept `className`. Always spread `...props`. Developers will need to do something weird—let them.

## The Pattern Nobody Talks About: Deletion

The most important architectural decision is knowing when to delete code.

I've deleted entire component systems and replaced them with simpler approaches. I've deleted "reusable" components that only had one usage. I've deleted variant APIs and replaced them with two separate components.

If a component has 15 props but 80% of usages only use 3 of them, you probably have 2 components pretending to be one.

## My Actual Component Architecture Today

Here's what I actually have in production:

* **Simple components** (Button, Badge, Avatar): Variant-based with 2-5 props max
* **Form components** (Input, Select, Checkbox): Variant-based with controlled/uncontrolled support  
* **Complex interactive components** (Dropdown, Dialog, Tabs): Compound components with context
* **Headless hooks** (useMediaQuery, useIntersectionObserver): When I need logic without UI

I didn't plan this. It emerged from solving real problems.

## Trust The Pain

Don't choose patterns because they're "best practices." Choose them because you feel pain with your current approach.

* Prop explosion and boolean hell? Try variants.
* Variants fighting each other? Try composition.
* Need the same behavior with different UIs? Try headless.
* None of the above? Don't change anything.

The best component architecture is the one that gets out of your way. If you're thinking about your component system more than your product, you've over-engineered it.

Start simple. Stay simple as long as you can. Introduce complexity only when simplicity fails. And remember: you can always refactor later when you understand the problem better.

## In Closing

Thanks for reading. What actually breaks your component systems? I'm curious what pain points I might have missed.
