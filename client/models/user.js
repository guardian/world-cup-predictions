define([
        'backbone'
        ], function (Backbone) {
        return Backbone.Model.extend({
            defaults: {
                userID: 0,
                isUserLoggedIn: false,
                username: null
            },

            initialize: function() {
            },

            isUserLoggedIn: function() {
                var isLoggedIn = false;
            },

            setToolKitObject: function() {
                var that = this;
                require(['common/modules/identity/api']).then(function(toolkit) {
                    that.set('isUserLoggedIn', toolkit.isUserLoggedIn());
                    that.set('username', toolkit.getUserFromCookie().displayName);
                    that.set('userID', toolkit.getUserFromCookie().id);

                    Backbone.trigger('toolkitReady');
                });
            }
        });
});