define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
		urlRoot: 'http://localhost:3000/score',
        initialize: function() {
			this.fetch();
        }
    });
});