import hlp from 'hlp';
import Page from './_page';
import 'babel-polyfill'; // use Array.includes etc. in IE11

document.addEventListener('DOMContentLoaded', () =>
{
    let page = new Page();
    page.init();    
    window.page = page;
});

/* Vue.js */
//import Vue from 'vue'; // import runtime only
import Vue from 'vue/dist/vue.js'; // import runtime+template compiler 
import App from '../_vue/_build/App.js';
const vm = new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
});