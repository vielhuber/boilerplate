export default class Module {
    static selector = '.module';
    constructor(public $el: Element) {}
    async ready() {
        console.log(this.$el);
    }
    async load() {
        console.log(this.$el);
    }
    static async readyOnce() {} // this runs only once on ready (also if n modules are initialized)
    static async loadOnce() {} // this runs only once on load (also if n modules are initialized)
}
