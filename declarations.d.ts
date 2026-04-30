declare module '*.css';

declare const jQuery: any;
declare const hlp: any;
declare const google: any;

interface Window {
    [key: string]: any;
}
interface Document {
    querySelector<T = any>(selectors: string & {}): T;
    querySelectorAll<T = any>(selectors: string & {}): NodeListOf<T>;
    getElementById<T = any>(elementId: string): T;
    [key: string]: any;
}
interface Element {
    querySelector<T = any>(selectors: string & {}): T;
    querySelectorAll<T = any>(selectors: string & {}): NodeListOf<T>;
    closest<T = any>(selectors: string & {}): T;
}
interface DocumentFragment {
    querySelector<T = any>(selectors: string & {}): T;
    querySelectorAll<T = any>(selectors: string & {}): NodeListOf<T>;
    getElementById<T = any>(elementId: string): T;
}
interface EventTarget {
    closest<T = any>(selectors: string & {}): T;
}
interface ParentNode {
    classList: DOMTokenList;
    style: CSSStyleDeclaration;
}
interface ArrayConstructor {
    from<T = any>(arrayLike: any): T[];
}
