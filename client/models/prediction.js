define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
		urlRoot: 'http://localhost:3000/prediction',
        initialize: function() {
        }
    });
});