# Bootstrap 5.3.8 Setup Documentation

## Overview
This project has been configured with Bootstrap 5.3.8 (latest version) along with Bootstrap Icons and custom configurations.

## What's Included

### 1. Bootstrap Core
- **Bootstrap 5.3.8** - Latest stable version
- **Bootstrap Icons** - Complete icon library
- **Custom Configuration** - Tailored for government applications

### 2. Custom Files Created
- `src/bootstrap-custom.scss` - Custom Bootstrap variables and configuration
- `src/bootstrap-utilities.scss` - Additional utility classes
- `src/bootstrap-components.scss` - Custom component styles
- `src/styles.scss` - Main stylesheet with all imports

## Bootstrap Configuration

### Custom Variables (bootstrap-custom.scss)
```scss
// Primary colors (Government theme)
$primary: #059669;      // Green
$secondary: #10b981;     // Light Green
$success: #22c55e;       // Success Green
$info: #3b82f6;          // Info Blue
$warning: #f59e0b;       // Warning Orange
$danger: #ef4444;        // Danger Red

// Typography
$font-family-base: 'Inter', sans-serif;

// Border radius
$border-radius: 8px;
$border-radius-sm: 4px;
$border-radius-lg: 12px;
$border-radius-xl: 16px;
```

## Usage Examples

### 1. Basic Bootstrap Classes
```html
<!-- Grid System -->
<div class="container">
  <div class="row">
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Card Title</h5>
          <p class="card-text">Card content</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Buttons -->
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-outline-primary">Outline Button</button>

<!-- Forms -->
<div class="mb-3">
  <label class="form-label">Email address</label>
  <input type="email" class="form-control" placeholder="name@example.com">
</div>
```

### 2. Custom Utility Classes
```html
<!-- Custom spacing -->
<div class="spacing-lg">Large spacing</div>
<div class="p-xl">Extra large padding</div>

<!-- Custom colors -->
<p class="text-primary-custom">Custom primary text</p>
<div class="bg-success-custom">Custom success background</div>

<!-- Custom flex utilities -->
<div class="flex-center">Centered content</div>
<div class="flex-between">Space between content</div>

<!-- Custom grid -->
<div class="grid-auto">Auto-fit grid</div>
<div class="grid-3">3 column grid</div>

<!-- Custom animations -->
<div class="fade-in">Fade in animation</div>
<div class="hover-lift">Hover lift effect</div>
```

### 3. Custom Components
```html
<!-- Custom Card -->
<div class="card-custom">
  <div class="card-header-custom">
    <h5 class="card-title-custom">Custom Card</h5>
    <p class="card-subtitle-custom">Custom subtitle</p>
  </div>
  <div class="card-body-custom">
    Card content here
  </div>
</div>

<!-- Custom Button -->
<button class="btn-custom btn-primary-custom">Custom Primary</button>
<button class="btn-custom btn-outline-custom">Custom Outline</button>

<!-- Custom Form -->
<div class="form-custom">
  <label class="form-label-custom">Custom Label</label>
  <input type="text" class="form-control-custom" placeholder="Custom input">
</div>

<!-- Custom Table -->
<table class="table-custom">
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>

<!-- Custom Alert -->
<div class="alert-custom alert-primary-custom">
  This is a custom primary alert
</div>

<!-- Custom Badge -->
<span class="badge-custom badge-primary-custom">Custom Badge</span>
```

### 4. Bootstrap Icons
```html
<!-- Bootstrap Icons -->
<i class="bi bi-house"></i>
<i class="bi bi-person"></i>
<i class="bi bi-gear"></i>
<i class="bi bi-check-circle"></i>
<i class="bi bi-exclamation-triangle"></i>
```

## Available Bootstrap Components

### Layout
- **Container** - `.container`, `.container-fluid`
- **Grid** - `.row`, `.col-*`, `.col-md-*`, `.col-lg-*`
- **Flexbox** - `.d-flex`, `.justify-content-*`, `.align-items-*`

### Content
- **Typography** - `.h1` to `.h6`, `.display-*`, `.lead`
- **Images** - `.img-fluid`, `.img-thumbnail`
- **Tables** - `.table`, `.table-striped`, `.table-hover`

### Forms
- **Form Controls** - `.form-control`, `.form-select`, `.form-check`
- **Input Groups** - `.input-group`, `.input-group-text`
- **Validation** - `.is-valid`, `.is-invalid`

### Components
- **Buttons** - `.btn`, `.btn-primary`, `.btn-outline-*`
- **Cards** - `.card`, `.card-header`, `.card-body`
- **Alerts** - `.alert`, `.alert-primary`
- **Badges** - `.badge`, `.badge-primary`
- **Modals** - `.modal`, `.modal-dialog`, `.modal-content`
- **Navigation** - `.nav`, `.nav-tabs`, `.navbar`
- **Pagination** - `.pagination`, `.page-item`

### Utilities
- **Spacing** - `.m-*`, `.p-*`, `.mx-*`, `.py-*`
- **Colors** - `.text-*`, `.bg-*`, `.border-*`
- **Display** - `.d-*`, `.d-md-*`, `.d-lg-*`
- **Position** - `.position-*`, `.top-*`, `.start-*`
- **Shadows** - `.shadow`, `.shadow-sm`, `.shadow-lg`

## Responsive Design

Bootstrap uses a mobile-first approach with breakpoints:
- **xs** - < 576px (extra small devices)
- **sm** - ≥ 576px (small devices)
- **md** - ≥ 768px (medium devices)
- **lg** - ≥ 992px (large devices)
- **xl** - ≥ 1200px (extra large devices)
- **xxl** - ≥ 1400px (extra extra large devices)

## Customization

### Adding New Variables
Edit `src/bootstrap-custom.scss` to add or modify Bootstrap variables:

```scss
// Add your custom variables
$custom-color: #your-color;
$custom-spacing: 2rem;
```

### Adding New Utilities
Edit `src/bootstrap-utilities.scss` to add new utility classes:

```scss
// Add your custom utilities
.your-utility {
  // Your styles here
}
```

### Adding New Components
Edit `src/bootstrap-components.scss` to add new component styles:

```scss
// Add your custom components
.your-component {
  // Your styles here
}
```

## Best Practices

1. **Use Bootstrap classes first** - Leverage Bootstrap's built-in classes before creating custom ones
2. **Mobile-first** - Design for mobile devices first, then enhance for larger screens
3. **Consistent spacing** - Use Bootstrap's spacing utilities for consistent layouts
4. **Semantic HTML** - Use appropriate HTML elements with Bootstrap classes
5. **Accessibility** - Bootstrap components include accessibility features by default

## Resources

- [Bootstrap 5.3 Documentation](https://getbootstrap.com/docs/5.3/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Bootstrap Examples](https://getbootstrap.com/docs/5.3/examples/)

## Troubleshooting

### Common Issues

1. **Styles not loading** - Check that all imports are correct in `styles.scss`
2. **Custom variables not working** - Ensure variables are defined before importing Bootstrap
3. **Conflicts with existing styles** - Use more specific selectors or `!important` if needed
4. **Icons not showing** - Verify Bootstrap Icons CSS is imported correctly

### Build Issues

If you encounter build issues:
1. Check that all SCSS files are properly formatted
2. Ensure all imports are correct
3. Run `ng build` to see specific error messages
4. Check for syntax errors in custom SCSS files
