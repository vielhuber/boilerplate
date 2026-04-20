[![GitHub Tag](https://img.shields.io/github/v/tag/vielhuber/boilerplate)](https://github.com/vielhuber/boilerplate/tags)
[![Code Style](https://img.shields.io/badge/code_style-psr--12-ff69b4.svg)](https://www.php-fig.org/psr/psr-12/)
[![License](https://img.shields.io/github/license/vielhuber/boilerplate)](https://github.com/vielhuber/boilerplate/blob/main/LICENSE.md)
[![Last Commit](https://img.shields.io/github/last-commit/vielhuber/boilerplate)](https://github.com/vielhuber/boilerplate/commits)

# 📦 boilerplate 📦

this is a boilerplate starter kit for rapid web development. it is based on [npm scripts](https://docs.npmjs.com/misc/scripts).

## includes

- [Vite](https://vite.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Babel](https://babeljs.io)
- [Sass](http://sass-lang.com) (basic pipeline: sourcemaps, autoprefixing, file inlining)
- [Tailwind CSS](https://tailwindcss.com/) (tailwind pipeline: PostCSS, no Sass)
- [Browsersync](https://www.browsersync.io)
- [eslint](https://eslint.org)
- [React](https://reactjs.org)
- [Jest](https://github.com/facebook/jest) (unit/integration/regression tests with [Puppeteer](https://github.com/smooth-code/jest-puppeteer))
- [hlp](https://github.com/vielhuber/hlp)
- [Prettier](https://github.com/prettier/prettier) and [Prettier PHP Plugin](https://github.com/prettier/plugin-php)
- [Desktop notifications](https://github.com/micromata/cli-error-notifier) on error
- [AGENTS.md](https://agents.md)

## features

- watchers for file changes
- copy scripts
- minification of html, js and css
- bundling of external libs
- extracting of critical css for [above-the-fold-content](https://developers.google.com/speed/docs/insights/PrioritizeVisibleContent)
- deferred loading of google analytics
- import css files in javascript
- auto transform es6 dependencies
- google page speed 100/100 ready
- full ie11 support
- zero vulnerabilities on `npm audit`

## installation

```
mkdir testproject
cd testproject
wget https://github.com/vielhuber/boilerplate/archive/main.zip
unzip main.zip -d .
mv boilerplate-main/{.[!.],}* .
rm -r boilerplate-main main.zip README.md
cp .env.example .env
nvm use --lts
npm install
```

## usage

the css pipeline comes in two flavors: **tailwind** (postcss, no sass) and **basic** (sass only, no tailwind).

| command                        | pipeline | watch | browsersync | delete | copy | css | js | html | tests |
| ------------------------------ | -------- | :---: | :---------: | :----: | :--: | :-: | :-: | :--: | :---: |
| `npm run prod:slim:tailwind`   | tailwind |       |             |        |      | ✓   | ✓   |      |       |
| `npm run dev:slim:tailwind`    | tailwind | ✓     | ✓           |        |      | ✓   | ✓   |      |       |
| `npm run prod:full:tailwind`   | tailwind |       |             | ✓      | ✓    | ✓   | ✓   | ✓    |       |
| `npm run dev:full:tailwind`    | tailwind | ✓     | ✓           |        | ✓    | ✓   | ✓   | ✓    | ✓     |
| `npm run prod:slim:basic`      | basic    |       |             |        |      | ✓   | ✓   |      |       |
| `npm run dev:slim:basic`       | basic    | ✓     | ✓           |        |      | ✓   | ✓   |      |       |
| `npm run prod:full:basic`      | basic    |       |             | ✓      | ✓    | ✓   | ✓   | ✓    |       |
| `npm run dev:full:basic`       | basic    | ✓     | ✓           |        | ✓    | ✓   | ✓   | ✓    | ✓     |
