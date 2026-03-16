import SVGInject from '@iconfu/svg-inject';

export default class Page {
    constructor() {}

    async ready() {
        console.log('ready');
    }
    async load() {
        console.log('load');
        this.addTailwindCDN();
        this.addEmojiOnBlur();
        this.addConsoleLogNote();
        /*
        this.windowScroll();
        this.scrollToHash();
        this.initSVGInject();
        this.videoController();
        this.hideHeaderOnScroll();
        this.blogComment();
        */
    }

    static async readyOnce() {}
    static async loadOnce() {}

    addTailwindCDN() {
        if (window.location.host.includes('local') || window.location.host.includes('close2dev')) {
            let script = document.createElement('script');
            script.src = 'https://cdn.tailwindcss.com';
            document.head.appendChild(script);
        }
    }

    addEmojiOnBlur() {
        this.originalPageTitle = document.title;
        document.addEventListener(
            'visibilitychange',
            () => {
                if (document.visibilityState === 'hidden') {
                    this.pageTitleChangingTimeout = setTimeout(() => {
                        this.originalPageTitle = document.title;
                        document.title = '🙁 ' + this.originalPageTitle;
                    }, 1500);
                } else {
                    clearTimeout(this.pageTitleChangingTimeout);
                    document.title = '😁 ' + this.originalPageTitle;
                    setTimeout(() => {
                        document.title = this.originalPageTitle;
                    }, 1000);
                }
            },
            false
        );
    }

    addConsoleLogNote() {
        console.log(
            '%c 42 ',
            'font-weight: bold; font-size: 100px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)'
        );
    }

    windowScroll() {
        window.addEventListener('scroll', () => {});
    }

    initSVGInject() {
        SVGInject(document.querySelectorAll('.svginject'));
    }

    scrollToHash() {
        if (window.location.hash) {
            let targetId = window.location.hash.replace('#', ''),
                target = document.getElementById(targetId);
            this.scrollToTarget(target);
        }
    }

    scrollToTarget(target) {
        if (!target) {
            return;
        }
        this.scrollTo(target.offsetTop);
    }

    scrollTo(top) {
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }

    hideHeaderOnScroll() {
        let didScroll,
            lastScrollTop = 0,
            delta = 5,
            navbarHeight = 200;

        setInterval(() => {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        }, 0);

        window.addEventListener('scroll', () => {
            checkIsScrolled();
        });

        function checkIsScrolled() {
            didScroll = true;
        }

        function hasScrolled() {
            let st = window.pageYOffset;

            // Make sure they scroll more than delta
            if (Math.abs(lastScrollTop - st) <= delta) {
                return;
            }

            // If they scrolled down and are past the navbar, add class .nav-up.
            // This is necessary so you never see what is "behind" the navbar.
            if (st > lastScrollTop && st > navbarHeight) {
                // Scroll Down
                document.documentElement.classList.remove('header-show');
                document.body.classList.remove('header-show');
                document.documentElement.classList.add('header-hide');
                document.body.classList.add('header-hide');
            } else {
                // Scroll Up
                document.documentElement.classList.remove('header-hide');
                document.body.classList.remove('header-hide');
                document.documentElement.classList.add('header-show');
                document.body.classList.add('header-show');
            }

            lastScrollTop = st;
        }
    }

    videoController() {
        let $video_trigger = document.querySelectorAll('.video-trigger');

        if ($video_trigger.length == 0) {
            return;
        }
        $video_trigger.forEach(el => {
            el.addEventListener('click', e => {
                let videoId = el.getAttribute('data-video-id'),
                    player = el.getAttribute('data-player'),
                    muted = el.getAttribute('data-muted'),
                    playerHtml = '';

                //youtube player
                if (player === 'youtube') {
                    playerHtml += '<div class="embed-video">';
                    playerHtml +=
                        '<iframe src="https://www.youtube-nocookie.com/embed/' +
                        videoId +
                        '?start=1&theme=dark&color=white&autohide=0&modestbranding=1&showinfo=0&rel=0&autoplay=1' +
                        (muted ? '&mute=1' : '') +
                        '" allow="autoplay; fullscreen" class="video-player__iframe" frameborder="0" allowfullscreen></iframe>';
                    playerHtml += '</div>';
                    el.parentElement.innerHTML = playerHtml;
                }

                // vimeo player
                if (player === 'vimeo') {
                    playerHtml += '<div class="embed-video">';
                    playerHtml +=
                        '<iframe src="https://player.vimeo.com/video/' +
                        videoId +
                        '?color=01E596&portrait=0&autoplay=1&dnt=1' +
                        (muted ? '&muted=1' : '') +
                        '" width="920" height="545" frameborder="0" class="video-player__iframe" allow="autoplay; fullscreen" allowfullscreen></iframe>';
                    playerHtml += '</div>';
                    el.parentElement.innerHTML = playerHtml;
                }
            });
        });
    }

    blogComment() {
        if (document.querySelector('.add-blog-comment') !== null) {
            document.querySelectorAll('.add-blog-comment').forEach(el => {
                el.addEventListener('submit', e => {
                    fetch(el.getAttribute('action'), {
                        method: el.getAttribute('method'),
                        body: new URLSearchParams(new FormData(el)),
                        cache: 'no-cache'
                    })
                        .then(response => {
                            let data = response.json(),
                                status = response.status;
                            if (status == 200 || status == 304 || status == 400) {
                                return data;
                            }
                            return {
                                success: false,
                                message: status
                            };
                        })
                        .catch(error => {
                            return {
                                success: false,
                                message: error
                            };
                        })
                        .then(response => {
                            if (el.querySelector('.message') !== null) {
                                if (response.message === 'error') {
                                    el.querySelector('.message').classList.add('text-error');
                                }
                                el.querySelector('.message').innerHTML = response.public_message;
                            }
                            el.reset();
                        });

                    e.preventDefault();
                });
            });
        }
    }
}
