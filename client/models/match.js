define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
			alphaTeam: 'Denmark',
			betaTeam: 'England'
        },

        initialize: function() {
        }
    });
});