import hlp from 'hlp';
import hljs from 'highlight.js';

// this is how to import css from node module dependencies
import 'highlight.js/styles/github.css';

export default class Example {
    var1: string;
    var2: string;
    var3 = 'this also works!';
    static var4 = 'this also!';

    constructor() {
        let _ = this;
        _.var1 = 'variable1';
        this.var2 = 'variable2';
    }

    async ready() {
        await this.loadScripts();
        this.addEnvironment();
        console.log(document.querySelector('footer').closest('body'));
        let foo: { bar?: { baz?: string } } = {};
        console.log(foo?.bar?.baz);
        foo = { bar: { baz: 'gnarr' } };
        console.log(foo?.bar?.baz);
        // test tailwind safelist
        document.querySelector('footer + div').classList.add('sticky');
    }

    async load() {}

    static async readyOnce() {}
    static async loadOnce() {}

    loadScripts() {
        // try to detect page speed insights and delay loading of scripts
        const ua = navigator.userAgent || '';
        let score = 0;
        if (/Lighthouse|HeadlessChrome|Chrome-Lighthouse|Speed Insights|PTST|PageSpeed/i.test(ua)) score = 99;
        if (navigator.webdriver) score = 99;
        if (!navigator.languages || navigator.languages.length === 0) score += 3;
        if (/Chrome\/\d{3}\.0\.0\.0/i.test(ua)) score += 1;
        const w = window.innerWidth,
            h = window.innerHeight;
        if ((w === 1350 && h === 940) || (w === 412 && (h === 823 || h === 915)) || (w === 360 && h === 640))
            score += 2;
        if (navigator.plugins && navigator.plugins.length === 0) score += 1;
        if (!(navigator as any).connection && !(navigator as any).deviceMemory && !navigator.hardwareConcurrency)
            score += 1;
        if (typeof navigator.permissions === 'undefined') score += 1;
        if (/Chrome/i.test(ua) && typeof (window as any).chrome === 'undefined') score += 2;
        if (score >= 4) {
            //return;
        }
        let tplurl = hlp.url(); // if wordpress, this is set in header
        // some libs need to be loaded dynamically and not concatenated via npm
        //return hlp.loadJs([tplurl + '/bundle.js']);
    }

    addEnvironment() {
        document.documentElement.classList.add(hlp.getOs());
        document.documentElement.classList.add(hlp.getDevice());
        document.documentElement.classList.add(hlp.getBrowser());
    }
}
