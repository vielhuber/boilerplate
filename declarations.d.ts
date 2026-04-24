declare module '*.css';

interface Document {
    querySelector<T = any>(selectors: string & {}): T;
    querySelectorAll<T = any>(selectors: string & {}): NodeListOf<T>;
    getElementById<T = any>(elementId: string): T;
}
interface Element {
    querySelector<T = any>(selectors: string & {}): T;
    querySelectorAll<T = any>(selectors: string & {}): NodeListOf<T>;
}
interface DocumentFragment {
    querySelector<T = any>(selectors: string & {}): T;
    querySelectorAll<T = any>(selectors: string & {}): NodeListOf<T>;
    getElementById<T = any>(elementId: string): T;
}
