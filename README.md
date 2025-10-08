# 📦 boilerplate 📦

this is a boilerplate starter kit for rapid web development. it is based on [npm scripts](https://docs.npmjs.com/misc/scripts).

## includes

- [Vite](https://vite.dev)
- [Babel](https://babeljs.io)
- [Sass](http://sass-lang.com) (+sourcemaps/autoprefixing/file inlining)
- [Browsersync](https://www.browsersync.io)
- [Tailwind CSS](https://tailwindcss.com/)
- [eslint](https://eslint.org)
- [React](https://reactjs.org)
- [Jest](https://github.com/facebook/jest) (unit/integration/regression tests with [Puppeteer](https://github.com/smooth-code/jest-puppeteer))
- [hlp](https://github.com/vielhuber/hlp)
- [Prettier](https://github.com/prettier/prettier) and [Prettier PHP Plugin](https://github.com/prettier/plugin-php)
- [Desktop notifications](https://github.com/micromata/cli-error-notifier) on error

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
wget https://github.com/vielhuber/boilerplate/archive/master.zip
unzip master.zip -d .
mv boilerplate-master/{.[!.],}* .
rm -r boilerplate-master master.zip README.md
cp .env.example .env
nvm use --lts
npm install
```

## usage

#### run watchers, browsersync and use uncompressed versions

```
npm run dev
```

#### build once for production

```
npm run prod
```
