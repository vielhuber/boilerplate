# AGENTS.md - AI Agent Guide for Boilerplate Project

## Project Overview

This is a modern frontend boilerplate starter kit for rapid web development based on npm scripts. The project provides a comprehensive build pipeline with automated workflows for CSS, JavaScript, HTML processing, and testing.

### Technology Stack

- **Bundler**: Vite (modern ES module bundler)
- **Legacy Bundler**: Browserify (available but not used by default)
- **Transpiler**: Babel (ES6+ to ES5)
- **CSS Preprocessor**: Sass/SCSS with PostCSS pipeline
- **CSS Framework**: Tailwind CSS v4
- **Dev Server**: Browsersync (live reload proxy)
- **Testing**: Jest with Puppeteer (unit/integration/regression)
- **Code Quality**: ESLint, Prettier (JS, PHP support)
- **Utilities**: hlp library for DOM manipulation

### Project Structure

```
/var/www/boilerplate/
├── _assets/           # Static assets (fonts, images)
├── _html/             # HTML source files
├── _js/               # JavaScript source files
│   ├── script.js      # Main entry point
│   ├── Page.js        # Singleton classes
│   ├── Navigation.js
│   ├── Module.js      # Component classes
│   └── RouteX.js
├── _scss/             # Sass/SCSS source files
│   ├── style.scss     # Main entry point
│   ├── _basic/        # Base styles, variables, utilities
│   └── _tailwind/     # Tailwind configuration
├── _libs/             # External libraries (CSS/JS)
├── _php/              # PHP files (copied to build)
├── _tests/            # Test files
│   └── _js/
│       ├── unit/
│       ├── integration/
│       └── regression/
├── _public/           # Build output directory
└── package.json       # NPM configuration & scripts
```

## Build Pipeline Architecture

### Module System

⚠️ **Important**: This project uses ES modules (`"type": "module"` in package.json)

- All `.js` files are treated as ES modules
- Use `import`/`export` syntax only
- CommonJS files must use `.cjs` extension
- Configuration files: `jest.config.cjs`, `jest-puppeteer.config.cjs`

### CSS Pipeline

The CSS pipeline processes Sass → PostCSS (Tailwind) → Autoprefixer → Critical CSS extraction:

1. **`css:sass`** - Compiles Sass to CSS (compressed for prod, uncompressed for dev)
2. **`css:postcss:tailwind`** - Applies Tailwind CSS transformations with cssnano
3. **`css:postcss:autoprefixer`** - Adds vendor prefixes
4. **`css:critical`** - Extracts critical above-the-fold CSS
5. **`css:libs`** - Concatenates external library CSS files

**Output**: `_public/bundle.css`, `_public/bundle-critical.css`

**Watch mode**: Monitors `_scss/**/*.scss`, `_php/**/*.php` for changes

### JavaScript Pipeline

The JavaScript pipeline uses Vite for bundling with Babel for transpilation:

1. **`js:vite`** - Bundles JS using Vite (replaces Browserify)
    - Entry: `_js/script.js`
    - Output: `_public/bundle.js`
    - Sourcemaps enabled
    - No minification (done separately)

2. **`js:minify`** - Minifies bundle.js with Terser
3. **`js:babel`** - Transpiles source files to `_public/_js/` for testing
4. **`js:libs`** - Concatenates external library JS files
5. **`js:tests`** - Runs Jest test suite

**Legacy alternative**: Browserify commands (`js:browserify`, `js:browserify:none`, `js:browserify:global`) are still available but not used in the default pipeline.

**Watch mode**: Monitors `_js/**/*.js`, `_libs/**/*.js` for changes

### HTML Pipeline

1. **`html:minify`** - Minifies HTML files (optional for dev)
2. **`html:inline`** - Inlines critical CSS/JS marked with `data-inline` attribute

**Watch mode**: Monitors `_html/**/*.html` for changes

## NPM Scripts Guide

### Main Pipelines

- **`npm run dev`** → `dev:⚡` - Development mode with watchers
    - Runs: `css:slim:watch`, `js:slim:watch`, `browsersync`
    - Live reload on file changes
    - Uncompressed builds for debugging

- **`npm run prod`** → `prod:⚡` - Production build (slim)
    - Runs: `css:slim`, `js:slim` (sequential)
    - Minified CSS/JS bundles
    - No HTML processing

- **`npm run dev:full`** → `dev:full:⚡` - Full development mode
    - Runs: `copy:watch`, `css:watch`, `js:watch`, `js:tests:watch`, `html:watch`, `browsersync`
    - Includes asset copying, HTML processing, continuous testing

- **`npm run prod:full`** → `prod:full:⚡` - Full production build
    - Runs: `delete:files`, `copy`, `css`, `js`, `html` (sequential)
    - Complete build including critical CSS, tests, HTML inlining

### Individual Task Scripts

All build tasks use `command time` for performance measurement:

- Format: `echo "⏳" && command time -f "✅ (%es)" <command>`
- Displays execution time in seconds after completion

**CSS Tasks:**

- `css:slim` - Quick CSS build (Sass + Tailwind + Autoprefixer)
- `css` - Full CSS build (includes critical CSS + libs)
- `css:sass[:dev]` - Sass compilation
- `css:postcss:tailwind` - Tailwind processing
- `css:postcss:autoprefixer` - Autoprefixer
- `css:critical` - Critical CSS extraction (requires DOMAIN env var)
- `css:libs` - Library concatenation

**JS Tasks:**

- `js:slim` - Quick JS build (Vite + minify)
- `js` - Full JS build (includes Babel transpilation, libs, tests)
- `js:vite` - Vite bundling
- `js:minify` - Terser minification
- `js:babel` - Babel transpilation to `_public/_js/`
- `js:libs` - Library concatenation
- `js:tests` - Jest test execution
- `js:browserify` - Legacy Browserify build (not used in pipelines)
- `js:browserify:none` - Browserify without Babel transforms
- `js:browserify:global` - Browserify with global Babel transforms

**HTML Tasks:**

- `html` - Full HTML processing (minify + inline)
- `html:minify[:dev]` - HTML minification
- `html:inline` - Inline critical resources

**Utility Tasks:**

- `copy` - Copy assets from `_assets/` and `_php/` to `_public/`
- `delete:files` - Clean build directory (keeps index.html, favicon.png, \_fonts/)
- `prettier` - Format code with Prettier
- `browsersync` - Start proxy server
- `browsersync:reload` - Trigger reload
- `browsersync:watch` - Watch mode with auto-reload

## Configuration Files

### Vite Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: '_public',
        rollupOptions: {
            input: './_js/script.js',
            output: {
                entryFileNames: 'bundle.js',
                format: 'iife',
                inlineDynamicImports: true
            }
        },
        sourcemap: true,
        minify: false, // Minification handled by Terser separately
        emptyOutDir: false // Preserve other files in _public/
    }
});
```

### Babel Configuration (`.babelrc` or `babel.config.js`)

Babel is configured to transpile modern JS to ES5 for legacy browser support, including:

- `@babel/preset-env` - Smart ES6+ to ES5 transpilation
- Polyfills for modern APIs
- Transform plugins for class properties, optional chaining, private methods

### Jest Configuration (`jest.config.cjs`)

```javascript
module.exports = {
    automock: false,
    preset: 'jest-puppeteer',
    testMatch: ['**/_tests/_js/**/*.js?(x)'],
    testTimeout: 60 * 1000,
    testEnvironmentOptions: {
        url: 'https://tld.com/?foo=bar&bar=baz'
    },
    transform: {} // Disables Babel transform conflicts with ES modules
};
```

### Tailwind Configuration (`tailwind.config.js`)

Tailwind v4 configuration with safelist patterns defined in `tailwind.safelist.txt`.

### PostCSS Configuration (`postcss.config.js`)

Pipeline includes:

- `@tailwindcss/postcss` - Tailwind CSS processing
- `autoprefixer` - Vendor prefixes
- `cssnano` - CSS minification

### Package.json Configuration

```json
{
    "type": "module", // ES module mode
    "config": {
        "build_folder": "_public",
        "critical_width": 1920,
        "critical_height": 1080
    }
}
```

## Testing

### Test Structure

- **Unit tests** (`_tests/_js/unit/`) - Test individual functions/modules
- **Integration tests** (`_tests/_js/integration/`) - Test component interactions
- **Regression tests** (`_tests/_js/regression/`) - Visual regression with Puppeteer

### Running Tests

```bash
npm run js:tests              # Run all tests once
npm run js:tests:watch        # Watch mode for continuous testing
```

### Test Example (ES Module)

```javascript
/**
 * @jest-environment jsdom
 */
import hlp from 'hlp';

describe('Test group 1', () => {
    test('should validate object type', () => {
        expect(hlp.isObject({})).toBe(true);
    }, 3000);
});
```

### Puppeteer Tests

```javascript
describe('Test puppeteer', () => {
    beforeAll(async () => {
        await page.goto('https://google.com', { waitUntil: 'networkidle2' });
    }, 3000);

    it('should display title', async () => {
        await page.waitForSelector('body');
        await expect(page.title()).resolves.toMatch('Google');
    }, 3000);
});
```

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
DOMAIN=https://your-local-domain.test  # Required for Browsersync and critical CSS
```

Access in scripts via `from-env`:

```bash
from-env browser-sync start --proxy %DOMAIN
```

## Common Development Workflows

### 1. Start Development Server

```bash
npm run dev
# - Watches CSS and JS files
# - Starts Browsersync on port 3030
# - Live reload on changes
# - Uncompressed builds for debugging
```

### 2. Build for Production

```bash
npm run prod
# - Minified CSS and JS bundles
# - No watchers, single build
# - Outputs to _public/
```

### 3. Full Development with Tests

```bash
npm run dev:full
# - All watchers active
# - Continuous test execution
# - HTML processing
# - Asset copying
```

### 4. Full Production Build

```bash
npm run prod:full
# - Cleans build directory
# - Copies all assets
# - Builds CSS with critical extraction
# - Builds JS with tests
# - Minifies and inlines HTML
```

### 5. Run Individual Tasks

```bash
npm run css:slim              # Just CSS
npm run js:vite               # Just Vite bundling
npm run js:tests              # Just tests
npm run prettier              # Format all files
```

## Troubleshooting

### Common Issues

**1. "module is not defined in ES module scope"**

- Cause: Using CommonJS syntax in `.js` files
- Solution: Convert to ES modules or rename to `.cjs`

**2. "time: /dev/stdout: No such device or address"**

- Cause: Issues with `command time` output redirection
- Solution: Use `/usr/bin/time -f "✅ (%es)"` without `-o` flag

**3. Jest configuration errors**

- Cause: Jest preset conflicts with ES modules
- Solution: Ensure `jest.config.cjs` and `jest-puppeteer.config.cjs` use `.cjs` extension

**4. Vite build errors**

- Check `vite.config.js` for correct entry point (`_js/script.js`)
- Ensure output directory is `_public`
- Verify ES module imports are correct

**5. Browsersync not working**

- Verify DOMAIN is set in `.env`
- Check proxy configuration matches your local server
- Ensure port 3030 is available

### Performance Notes

- Build times are displayed after each task (in seconds)
- Vite is significantly faster than Browserify for bundling
- Watch modes use polling (25ms) for cross-platform compatibility
- Debounce delays prevent excessive rebuilds

## AI Agent Instructions

### When Making Changes

1. **Always preserve the existing pipeline structure** - Don't remove or rename existing scripts unless explicitly requested
2. **Maintain ES module compatibility** - All new JS files should use `import`/`export`
3. **Keep time measurements** - Use `command time` wrapper for new build tasks
4. **Test after changes** - Run `npm run js:tests` to verify functionality
5. **Update this guide** - Document any significant changes to the build pipeline

### Code Style Guidelines

- Use ES6+ syntax (classes, arrow functions, destructuring)
- Prefer `const` over `let`, avoid `var`
- Use template literals for string interpolation
- Follow existing file naming conventions (PascalCase for classes)
- Maintain SCSS organization (vars → reset → modules → utilities)
- Keep Tailwind utilities in separate layer from custom CSS

### Adding New Dependencies

```bash
npm install --save-dev <package>    # Dev dependencies
npm install --save <package>         # Runtime dependencies
```

Update relevant configuration files and document in this guide.

### Modifying the Build Pipeline

When adding new build steps:

1. Create individual task script with time wrapper
2. Add to appropriate pipeline (slim/full)
3. Create watch variant if needed
4. Update this documentation
5. Test in both dev and prod modes

### Browserify to Vite Migration Notes

- Vite replaced Browserify as the default bundler (Dec 2025)
- Legacy Browserify commands remain available (`js:browserify*`)
- Main difference: Vite uses native ES modules, faster builds
- Babel transforms still applied via Vite's Rollup pipeline
- CSS imports now handled by Vite (previously browserify-css)

## Resources

- [Vite Documentation](https://vite.dev)
- [Babel Documentation](https://babeljs.io)
- [Sass Documentation](https://sass-lang.com)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [Jest Documentation](https://jestjs.io)
- [Puppeteer Documentation](https://pptr.dev)
- [npm-run-all Documentation](https://github.com/mysticatea/npm-run-all)

## Changelog

### Recent Updates

- **Dec 2025**: Migrated from Browserify to Vite as default bundler
- **Dec 2025**: Added `command time` performance measurements to all build tasks
- **Dec 2025**: Converted to ES module system (`"type": "module"`)
- **Dec 2025**: Updated to Tailwind CSS v4
- **Dec 2025**: Updated Jest configuration for ES module compatibility

---

**Maintained by**: David <david@vielhuber.de>
**License**: UNLICENSED (Private project)
**Version**: 42.0.0
