/* external packages */
import hlp from 'hlp';

/* internal classes */
import Page from './Page';
import Navigation from './Navigation';
import Module from './Module';
import RouteX from './RouteX';

type SingletonClass = (new () => { ready?: () => void; load?: () => void }) & {
    readyOnce?: () => void;
    loadOnce?: () => void;
};
type ComponentClass = (new ($el: Element) => { ready?: () => void; load?: () => void }) & {
    selector: string;
    readyOnce?: () => void;
    loadOnce?: () => void;
};
type RouteClass = (new () => { ready?: () => void; load?: () => void }) & {
    route: string;
};

/* modular way */
// singletons
([Page, Navigation] as SingletonClass[]).forEach(classes__value => {
    // for convenience we use dynamic instead of static functions
    let c = new classes__value();
    if (typeof c.ready === 'function') {
        hlp.ready().then(() => {
            c.ready();
        });
    }
    if (typeof c.load === 'function') {
        hlp.load().then(() => {
            c.load();
        });
    }
    // also run static functions if available
    if (typeof classes__value.readyOnce === 'function') {
        hlp.ready().then(() => {
            classes__value.readyOnce();
        });
    }
    if (typeof classes__value.loadOnce === 'function') {
        hlp.load().then(() => {
            classes__value.loadOnce();
        });
    }
});
// components
([[Module, 'Module']] as [ComponentClass, string][]).forEach(classes__value => {
    hlp.runForEl(classes__value[0].selector, $el => {
        let c = new classes__value[0]($el);
        if (typeof c.ready === 'function') {
            hlp.ready().then(() => {
                c.ready();
            });
        }
        if (typeof c.load === 'function') {
            hlp.load().then(() => {
                c.load();
            });
        }
        // also add it to the dom element (for an implicit event bus for communication between classes); call via $0.Module
        // we cannot use c.constructor.name here, because minification would break!
        ($el as any)[classes__value[1]] = c;
    });
    // allow classes to also have static functions (these are only called ONCE overall)
    hlp.ready().then(() => {
        if (typeof classes__value[0].readyOnce === 'function') {
            classes__value[0].readyOnce();
        }
    });
    hlp.load().then(() => {
        if (typeof classes__value[0].loadOnce === 'function') {
            classes__value[0].loadOnce();
        }
    });
});
// routes
([[RouteX, 'RouteX']] as [RouteClass, string][]).forEach(classes__value => {
    if (new RegExp(classes__value[0].route).test(window.location.pathname) === false) {
        return;
    }
    // for convenience we use dynamic instead of static functions
    let c = new classes__value[0]();
    if (typeof c.ready === 'function') {
        hlp.ready().then(() => {
            c.ready();
        });
    }
    if (typeof c.load === 'function') {
        hlp.load().then(() => {
            c.load();
        });
    }
});

/* modular way (without dependencies) */
/* if you embed your scripts with async, it is not guaranteed, that window load or document ready tirggers */
/* use this instead of the original functions */
/*
const ready = new Promise(resolve => {
    if (document.readyState !== 'loading') {
        return resolve();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            return resolve();
        });
    }
});
ready.then(() => {
    // ...
});
const load = new Promise(resolve => {
    if (document.readyState === 'complete') {
        return resolve();
    } else {
        window.addEventListener('load', () => {
            return resolve();
        });
    }
});
load.then(() => {
    // ...
});
*/

/* most basic way */
/*
const page = new Page();
document.addEventListener('DOMContentLoaded', () => {
    page.ready();
    // make publically available to run from outside for debugging purposes
    window.page = page;
});
window.addEventListener('load', e => {
    page.load();
});
*/

/* when using the technique with loadCSS, use this instead */
/*
hlp.waitUntil('footer', 'position', 'relative').then(() => {
    console.log('DONE');
});
*/

/* React */
/*
const MyComponent = () => {
    return (
        <div>
            <button type="button">Click me</button>
            <p>Hello</p>
        </div>
    );
};
console.log(MyComponent);
*/
