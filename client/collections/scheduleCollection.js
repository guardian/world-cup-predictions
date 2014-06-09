define(['backbone', 'models/match'], function (Backbone, Match) {
    return Backbone.Collection.extend({
		url: 'http://54.195.89.236:3000/schedule/',
		// url: 'http://localhost:3000/schedule/',
		model: Match,

		getChanged: function () {
		}
    });
});