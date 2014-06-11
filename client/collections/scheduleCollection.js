define(['backbone', 'models/match', '../config'], function (Backbone, Match, config) {
    return Backbone.Collection.extend({
		url: config.apiUrl + '/schedule/',
		model: Match
    });
});