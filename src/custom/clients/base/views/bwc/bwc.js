// Enrico Simonetti
// enricosimonetti.com
//
// 2017-06-06
// Tested on Sugar 7.9.0.0

({
    extendsFrom: 'BwcView',

    initialize: function(options) {
        this._super('initialize', [options]);
    },

    _renderHtml: function() {
        this._super('_renderHtml');
        this.$('iframe').on('load', function() {
            if (this.contentWindow.$ === undefined) {
                return;
            }

            if(app.idleLogin.isIdleLogoutEnabled() && !app.cache.get('isLoggedOut')) {
                this.contentWindow.$('body').on('click scroll mousemove mousedown keyup keypress', function() {
                    app.idleLogin.updateActivity();
                });
            }
        });
    }
})
