define(['backbone', 'models/match'], function (Backbone, Match) {
    return Backbone.Collection.extend({
    	url: 'http://localhost:4000/data/schedule.json',
        model: Match
    });
});