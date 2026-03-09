import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const [, , file, root] = process.argv;
const read = href => readFileSync(resolve(root, href.replace(/^\//, '')), 'utf8');

let html = readFileSync(file, 'utf8');
html = html.replace(
    /<link\b([^>]*?\bdata-inline\b[^>]*?)>/gi,
    (_, a) => `<style>${read(a.match(/\bhref="([^"]+)"/i)[1])}</style>`
);
html = html.replace(
    /<script\b([^>]*?\bdata-inline\b[^>]*?)><\/script>/gi,
    (_, a) => `<script>${read(a.match(/\bsrc="([^"]+)"/i)[1])}</script>`
);
writeFileSync(file, html);
