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
            // set as logged out, as manual logged out and clear timers if any
            app.cache.set('isLoggedOut', true);
            app.cache.set('isManualLogout', true);
            app.idleLogin.clearExistingTimer();
        }
    });

    app.events.on('app:login:success', function() {
        if(app.idleLogin.isIdleLogoutEnabled()) {
            app.idleLogin.login();
        }
    });

    app.idleLogin = {};
    app.idleLogin.checkIdleTime = 60;
    app.idleLogin.idleTimeoutTime = 120;

    app.idleLogin.idleTimer = null; 
 
    app.idleLogin.login = function() {
        app.cache.set('isLoggedOut', false);
        app.cache.set('isManualLogout', false);
    };

    app.idleLogin.autoLogout = function() {
        // clear existing timer
        app.idleLogin.clearExistingTimer();
        // show logout message
        app.alert.show('idle-logout', {
            level: 'error',
            autoClose: false,
            messages: app.lang.get('LBL_IDLE_LOGOUT_MESSAGE'),
            title: app.lang.get('LBL_IDLE_LOGOUT_TITLE')
        });

        // execute proper logout. call it only once from the first triggering tab/window
        if(!app.cache.get('isLoggedOut')) {
            app.cache.set('isLoggedOut', true);
            app.api.logout();
        }

        // show login screen
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

        // bind updates
        app.idleLogin.bindUpdateTimeOnActivity();
        // clear existing timers if any
        app.idleLogin.clearExistingTimer();
        // start the idle timer
        app.idleLogin.idleTimer = setInterval(function() { app.idleLogin.checkForIdle(); }, app.idleLogin.checkIdleTime * 1000);
    };

    app.idleLogin.updateActivity = function() {
        app.cache.set('inactivityLogoutTime', $.now() + app.idleLogin.idleTimeoutTime * 1000);
    };

    app.idleLogin.checkForIdle = function() {
        if(!app.cache.get('isLoggedOut')) {
            if(app.cache.get('inactivityLogoutTime') <= $.now()) {
                // main tab, execute logout and show idle error message
                app.idleLogin.autoLogout();
            }
        } else {
            if(app.cache.get('isManualLogout')) {
                // clear timer and show login screen (no idle error message)
                app.idleLogin.clearExistingTimer();
                app.router.login();
            } else {
                // secondary tabs, execute logout and show idle error message
                app.idleLogin.autoLogout();
            }
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
