export default class Navigation {
    constructor() {
        this.breakpoint = 768;
        this.selectorChildren = '#header .menu-item.menu-item-has-children';
        this.classHover = 'hover';
    }

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
                    if (window.innerWidth >= this.breakpoint) {
                        if (!el.classList.contains(this.classHover)) {
                            e.preventDefault();
                            document.querySelectorAll(this.selectorChildren).forEach(el => {
                                el.classList.remove(this.classHover);
                            });
                            el.classList.add(this.classHover);
                        }
                    }
                });
                window.addEventListener('touchstart', e => {
                    if (!el.contains(e.target)) {
                        el.classList.remove(this.classHover);
                    }
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
}
