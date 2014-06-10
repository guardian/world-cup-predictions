define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
		urlRoot: 'http://54.195.89.236:3000/prediction',
        initialize: function() {
        }
    });
});