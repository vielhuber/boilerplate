declare module '*.css';

// Map a selector to its element type — analogous to HTMLElementTagNameMap.
// Projects extend this via interface merging in a project-local .d.ts:
//     interface SelectorTypeMap { '.my-form': HTMLFormElement; }
// Then document.querySelector('.my-form') is automatically typed, no generics.
// Selectors not listed fall back to `any`.
interface SelectorTypeMap {}

// Map an element id to its type — used by getElementById. Same pattern.
interface IdTypeMap {}

// Less-verbose DOM queries: known selectors are strictly typed via the maps,
// unknown selectors fall back to `any` so .reset(), .value etc. still work
// without generics or casts.
interface Document {
    querySelector<K extends keyof SelectorTypeMap>(selectors: K): SelectorTypeMap[K];
    querySelectorAll<K extends keyof SelectorTypeMap>(selectors: K): NodeListOf<SelectorTypeMap[K]>;
    querySelector(selectors: string): any;
    querySelectorAll(selectors: string): NodeListOf<any>;
    getElementById<K extends keyof IdTypeMap>(elementId: K): IdTypeMap[K];
    getElementById(elementId: string): any;
}
interface Element {
    querySelector<K extends keyof SelectorTypeMap>(selectors: K): SelectorTypeMap[K];
    querySelectorAll<K extends keyof SelectorTypeMap>(selectors: K): NodeListOf<SelectorTypeMap[K]>;
    querySelector(selectors: string): any;
    querySelectorAll(selectors: string): NodeListOf<any>;
}
interface DocumentFragment {
    querySelector<K extends keyof SelectorTypeMap>(selectors: K): SelectorTypeMap[K];
    querySelectorAll<K extends keyof SelectorTypeMap>(selectors: K): NodeListOf<SelectorTypeMap[K]>;
    querySelector(selectors: string): any;
    querySelectorAll(selectors: string): NodeListOf<any>;
    getElementById<K extends keyof IdTypeMap>(elementId: K): IdTypeMap[K];
    getElementById(elementId: string): any;
}
