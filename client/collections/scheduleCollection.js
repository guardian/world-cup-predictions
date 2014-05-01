define(['backbone', 'models/match'], function (Backbone, Match) {
    return Backbone.Collection.extend({
    	url: 'data/schedule.json',
        model: Match
    });
});