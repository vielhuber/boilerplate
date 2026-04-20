import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssUrl from 'postcss-url';

export default {
    map: false,
    plugins:
        process.env.NODE_ENV === 'production'
            ? [
                  tailwindcss,
                  autoprefixer,
                  cssnano({ preset: 'default' }),
                  postcssUrl({ url: 'inline', basePath: ['../../_assets/'] })
              ]
            : [tailwindcss]
};
