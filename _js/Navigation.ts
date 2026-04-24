export default class Navigation {
    breakpoint = 768;
    selectorChildren = '#header .menu-item.menu-item-has-children';
    classHover = 'hover';

    async ready() {
        console.log('ready');
    }
    async load() {
        console.log('load');
        this.initOnLoad();
        this.headerCollapse();
        //this.headerDropdownOverview();
    }

    initOnLoad() {
        if (document.querySelector(this.selectorChildren) !== null) {
            document.querySelectorAll(this.selectorChildren).forEach(el => {
                el.addEventListener('touchstart', e => {
                    if (window.innerWidth < this.breakpoint) {
                        return;
                    }
                    if (el.classList.contains(this.classHover)) {
                        return;
                    }
                    e.preventDefault();
                    document.querySelectorAll(this.selectorChildren).forEach(other => {
                        other.classList.remove(this.classHover);
                    });
                    el.classList.add(this.classHover);
                });
                window.addEventListener('touchstart', e => {
                    if (el.contains(e.target as Node)) {
                        return;
                    }
                    el.classList.remove(this.classHover);
                });
            });
        }
    }

    headerCollapse() {
        let navToggle = document.querySelector('#header .nav-toggle');

        if (!navToggle) {
            return;
        }

        navToggle.addEventListener('click', e => {
            navToggle.classList.toggle('active');
            document.querySelector('#nav-main').classList.toggle('active');
        });
    }

    headerDropdownOverview() {
        let menuDropdownItems = document.querySelectorAll('.menu-item-has-children.level-0');

        if (!menuDropdownItems) {
            return;
        }

        menuDropdownItems.forEach(el => {
            el.addEventListener('mouseover', e => {
                document.querySelector('#header-overlay').classList.add('show');
            });

            el.addEventListener('mouseout', e => {
                document.querySelector('#header-overlay').classList.remove('show');
            });
        });
    }

    static async readyOnce() {}
    static async loadOnce() {}
}
