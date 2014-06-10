define([
        'backbone',
        'common/modules/identity/api'
        ], function (Backbone, Identity) {
        return Backbone.Model.extend({
            urlRoot: 'http://54.195.89.236:3000/user',
            defaults: {
                userID: 0,
                isUserLoggedIn: false,
                username: null
            },

            initialize: function() {
                this.set('isUserLoggedIn', Identity.isUserLoggedIn());

                if (Identity.isUserLoggedIn()) {
                    this.set('userId', parseInt(Identity.getUserFromCookie().id, 10));
                    this.set('username', Identity.getUserFromCookie().displayName);
                    this.set('rawResponse', Identity.getUserFromCookie().rawResponse);
                    this.set('userEmail', Identity.getUserFromCookie().primaryEmailAddress);
                }

                this.syncUserDetails();
            },

            syncUserDetails: function() {
                this.save();
            }

        });
});