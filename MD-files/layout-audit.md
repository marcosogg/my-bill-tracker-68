# Layout System Audit & Standardization

## Current Layout Patterns

### Container Dimensions
- Global max-width: 1400px (defined in tailwind.config.ts)
- Page-specific max-width: max-w-7xl (1280px) used inconsistently
- Default padding: 2rem container padding (defined in tailwind.config.ts)

### Page Layout Structure
1. Base Layout (PageLayout.tsx)
   - Full height minimum (min-h-screen)
   - Flex column layout
   - Fixed header and navigation
   - Flexible main content area
   - Fixed footer

2. Content Wrappers
   - Inconsistent usage between pages:
     - Some pages use `min-h-screen p-8`
     - Inconsistent max-width implementations
     - Varying padding patterns

### Spacing System
- Current implementation uses inconsistent values:
  - gap-8 (2rem)
  - p-8 (2rem)
  - p-4 (1rem)
  - space-y-8 (2rem)
  - mb-8 (2rem)

### Header Structures
1. Global Header
   - Fixed height with p-4 padding
   - Dark background (bg-gray-800)
   - Basic text styling

2. Page Headers
   - Inconsistent implementations
   - Varying margin patterns
   - Different heading sizes

### Responsive Behavior
- Limited responsive design implementation
- Container breakpoints only defined for 2xl (1400px)
- No consistent mobile-first approach

## Standardization Recommendations

### 1. Container System
```typescript
// Standard container widths
const containerWidths = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablets
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1400px' // Extra large screens
}

// Usage pattern:
<div className="container mx-auto px-4 md:px-6 lg:px-8">
  {content}
</div>
```

### 2. Spacing Scale
```typescript
// Standardized spacing scale
const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  '2xl': '4rem'   // 64px
}
```

### 3. Page Layout Template
```typescript
// Standard page layout structure
<PageLayout>
  <div className="container mx-auto px-4 md:px-6 lg:px-8">
    <header className="py-6 md:py-8">
      <h1 className="text-2xl md:text-4xl font-bold">{pageTitle}</h1>
    </header>
    <main className="py-6 md:py-8">
      {content}
    </main>
  </div>
</PageLayout>
```

### 4. Responsive Rules
1. Mobile-First Approach:
   - Base styles for mobile
   - Progressive enhancement for larger screens
   - Standard breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1400px)

2. Container Behavior:
   - Full width on mobile with consistent padding
   - Max-width constraints on larger screens
   - Responsive padding scale

### 5. Header Components
```typescript
// Standard page header
<header className="mb-6 md:mb-8">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
    <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-0">{title}</h1>
    {actions && (
      <div className="flex gap-4">
        {actions}
      </div>
    )}
  </div>
</header>