(function () {
'use strict';

Vue.config.debug = true;

window.Guacamoly = window.Guacamoly || {};
var Core = window.Guacamoly.Core;

var md = window.markdownit({
    breaks: true,
    html: true,
    linkify: true
}).use(window.markdownitEmoji)
.use(window.markdownitCheckbox);

md.renderer.rules.emoji = function(token, idx) {
  return twemoji.parse(token[idx].content);
};

Vue.filter('markdown', function (value) {
    if (!value) return '';

    return md.render(value);
});

Vue.filter('prettyDateOffset', function (time) {
    var date = new Date(time),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

    if (isNaN(day_diff) || day_diff < 0)
        return;

    return day_diff === 0 && (
            diff < 60 && 'just now' ||
            diff < 120 && '1 minute ago' ||
            diff < 3600 && Math.floor( diff / 60 ) + ' minutes ago' ||
            diff < 7200 && '1 hour ago' ||
            diff < 86400 && Math.floor( diff / 3600 ) + ' hours ago') ||
        day_diff === 1 && 'Yesterday' ||
        day_diff < 7 && day_diff + ' days ago' ||
        day_diff < 31 && Math.ceil( day_diff / 7 ) + ' weeks ago' ||
        day_diff < 365 && Math.round( day_diff / 30 ) +  ' months ago' ||
                          Math.round( day_diff / 365 ) + ' years ago';
});

var vue = new Vue({
    el: '#application',
    data: {
        busy: true,
        error: null,
        thing: {}
    },
    methods: {
        giveAddFocus: function () {
            this.$els.addinput.focus();
        }
    }
});

function main() {
    var search = window.location.search.slice(1).split('&').map(function (item) { return item.split('='); }).reduce(function (o, k) { o[k[0]] = k[1]; return o; }, {});

    if (!search.id) {
        vue.error = 'No id provided';
        vue.busy = false;
        return;
    }

    Core.things.getPublic(search.id, function (error, result) {
        vue.busy = false;

        if (error) {
            console.log(error);
            vue.error = 'Not found';
            return;
        }

        vue.thing = result;
    });
}

// Main
main();

})();
