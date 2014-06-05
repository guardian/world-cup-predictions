define([
        'backbone',
        'common/modules/identity/api'
        ], function (Backbone, Identity) {
        return Backbone.Model.extend({
            defaults: {
                userID: 0,
                isUserLoggedIn: false,
                username: null
            },

            initialize: function() {
                this.set('isUserLoggedIn', Identity.isUserLoggedIn());

                if (Identity.isUserLoggedIn()) {
                    this.set('username', Identity.getUserFromCookie().displayName);
                    this.set('userId', parseInt(Identity.getUserFromCookie().id, 10));
                }
            }

        });
});