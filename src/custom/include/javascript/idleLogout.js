// Enrico Simonetti
// enricosimonetti.com
//
// 2017-06-06
// Tested on Sugar 7.9.0.0

(function(app) {
    app.events.on('app:sync:complete', function() {
        if(app.idleLogin.isIdleLogoutEnabled()) {
            app.idleLogin.start();
        }
    });

    app.events.on('app:logout:success', function() {
        if(app.idleLogin.isIdleLogoutEnabled()) {
            app.idleLogin.logout();
        }
    });

    app.events.on('app:login:success', function() {
        if(app.idleLogin.isIdleLogoutEnabled()) {
            app.idleLogin.login();
        }
    });

    app.idleLogin = {};
    app.idleLogin.checkIdleTime = 60;
    app.idleLogin.idleTimeoutTime = 60;

    app.idleLogin.idleTimer = null; 
 
    app.idleLogin.login = function() {
        app.cache.set('isLoggedOut', false);
    };

    app.idleLogin.logout = function() {
        app.idleLogin.clearExistingTimer();
        app.alert.show('idle-logout', {
            level: 'error',
            autoClose: false,
            messages: app.lang.get('LBL_IDLE_LOGOUT_MESSAGE'),
            title: app.lang.get('LBL_IDLE_LOGOUT_TITLE')
        });

        // call it only once from the first triggering tab/window
        if(!app.cache.get('isLoggedOut')) {
            app.cache.set('isLoggedOut', true);
            app.api.logout();
        }

        app.router.login();
    };

    app.idleLogin.clearExistingTimer = function() {
        if(app.idleLogin.idleTimer) {
            clearInterval(app.idleLogin.idleTimer);
        }
    };

    app.idleLogin.start = function() {
        // set timeout to the configured value if more than 60
        if(app.config.idle_logout_time && app.config.idle_logout_time > 60) {
            app.idleLogin.idleTimeoutTime = app.config.idle_logout_time;
        }

        app.idleLogin.bindUpdateTimeOnActivity();
        app.idleLogin.clearExistingTimer();
        app.idleLogin.idleTimer = setInterval(function() { app.idleLogin.checkForIdle(); }, app.idleLogin.checkIdleTime * 1000);
    };

    app.idleLogin.updateActivity = function() {
        app.cache.set('inactivityLogoutTime', $.now() + app.idleLogin.idleTimeoutTime * 1000);
    };

    app.idleLogin.checkForIdle = function() {
        if(!app.cache.get('isLoggedOut')) {
            if(app.cache.get('inactivityLogoutTime') <= $.now()) {
                app.idleLogin.logout();
            }
        } else {
            // call logout to clear the timer
            app.idleLogin.logout();
        }
    };

    app.idleLogin.isIdleLogoutEnabled = function() {
        // to disable the functionality either set $sugar_config['additional_js_config']['idle_logout_time'] = 0; or unset the option
        if(app.config.idle_logout_time) {
            return true;
        } else {
            return false;
        }
    };

    app.idleLogin.bindUpdateTimeOnActivity = function() {
        // init activity time
        app.idleLogin.updateActivity();

        if(app.idleLogin.isIdleLogoutEnabled() && !app.cache.get('isLoggedOut')) {
            $('body').on('click scroll mousemove mousedown keyup keypress', function() {
                app.idleLogin.updateActivity();            
            });
        }
    };
})(SUGAR.App);
