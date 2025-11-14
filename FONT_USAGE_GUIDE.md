# Font Usage Guide

## Available Fonts

Your project now has the following fonts imported and ready to use:

### 1. Charifund Font (Primary Brand Font)
- **File**: `/fonts/charifund.woff2`
- **Usage**: `className="font-charifund"`
- **Best for**: Headers, brand text, main content
- **Default**: Applied to all text by default

### 2. FontAwesome Fonts
- **Files**: 
  - `/fonts/fa-solid-900.woff2` (Solid icons)
  - `/fonts/fa-regular-400.woff2` (Regular icons)
  - `/fonts/fa-brands-400.woff2` (Brand icons)
- **Usage**: `className="font-awesome"`
- **Best for**: Icons, special characters

### 3. Slick Font
- **File**: `/fonts/slick.653a4cbb.woff`
- **Usage**: `className="font-slick"`
- **Best for**: Carousel/slider components, navigation

### 4. Cursive Font
- **Usage**: `className="font-cursive"`
- **Best for**: Elegant headings, quotes, decorative text

## How to Use Fonts in Your Code

### Method 1: Using CSS Classes (Recommended)

```tsx
// In any React component
<div className="font-charifund text-2xl font-bold">
  This uses the Charifund font
</div>

<span className="font-slick text-lg">
  This uses the Slick font
</span>

<p className="font-awesome text-base">
  This uses the FontAwesome font
</p>

<h2 className="font-cursive text-xl">
  This uses the cursive font
</h2>
```

### Method 2: Using Inline Styles

```tsx
<div style={{ fontFamily: 'Charifund, Arial, Helvetica, sans-serif' }}>
  Custom font with inline style
</div>
```

### Method 3: Using CSS Variables

```tsx
// In your CSS
.custom-text {
  font-family: var(--font-charifund);
}

// In your component
<div className="custom-text">
  Custom styled text
</div>
```

## Examples by Component Type

### Headers
```tsx
<h1 className="font-charifund text-4xl font-bold text-gray-800">
  Main Heading
</h1>

<h2 className="font-cursive text-2xl text-gray-700">
  Elegant Subheading
</h2>
```

### Navigation
```tsx
<nav className="font-charifund text-base font-medium">
  <ul>
    <li>Home</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
</nav>
```

### Buttons
```tsx
<button className="font-charifund font-semibold px-6 py-3 bg-yellow-400 rounded-full">
  Donate Now
</button>
```

### Cards
```tsx
<div className="charity-card p-6">
  <h3 className="font-charifund text-xl font-bold mb-2">
    Card Title
  </h3>
  <p className="font-charifund text-gray-600">
    Card description text
  </p>
</div>
```

### Carousel/Slider Components
```tsx
<div className="carousel-container">
  <div className="font-slick text-center">
    Carousel navigation arrows
  </div>
  <div className="font-charifund">
    Carousel content
  </div>
</div>
```

## Font Combinations

### Professional Look
```tsx
<div>
  <h1 className="font-charifund text-3xl font-bold">Title</h1>
  <p className="font-charifund text-base">Body text</p>
  <span className="font-awesome">Icon</span>
</div>
```

### Elegant Look
```tsx
<div>
  <h1 className="font-cursive text-3xl">Elegant Title</h1>
  <p className="font-charifund text-base">Supporting text</p>
</div>
```

### Modern Look
```tsx
<div>
  <h1 className="font-charifund text-3xl font-bold">Modern Title</h1>
  <p className="font-slick text-base">Modern body text</p>
</div>
```

## Best Practices

1. **Consistency**: Use Charifund as your primary font for most text
2. **Hierarchy**: Use different font weights and sizes to create visual hierarchy
3. **Readability**: Ensure sufficient contrast between text and background
4. **Performance**: Fonts are loaded with `font-display: swap` for better performance
5. **Fallbacks**: All fonts have fallbacks to system fonts

## Testing Fonts

You can test all fonts by visiting the FontExample component that's now included in your home page. It shows examples of all available fonts and how they look.

## Troubleshooting

If fonts don't appear:
1. Check that the font files exist in `/public/fonts/`
2. Verify the font paths in `globals.css`
3. Clear browser cache
4. Check browser developer tools for any loading errors

## Font Loading Performance

The fonts are configured with:
- `font-display: swap` - Shows fallback fonts while custom fonts load
- Proper fallback fonts for better user experience
- Optimized file formats (woff2) for faster loading
