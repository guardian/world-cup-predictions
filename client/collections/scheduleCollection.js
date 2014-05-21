define(['backbone', 'models/match'], function (Backbone, Match) {
    return Backbone.Collection.extend({
		url: 'http://localhost:3000/schedule/',
		model: Match,

		getChanged: function () {
			console.log('changed models');
		}
    });
});