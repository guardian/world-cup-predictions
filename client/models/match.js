define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
			alphaTeam: 'Home Team',
			betaTeam: 'Away Team'
        },

        initialize: function() {
        }
    });
});