define(['backbone', 'models/prediction'], function (Backbone, Prediction) {
    return Backbone.Collection.extend({
		url: 'http://localhost:3000/prediction/',
		model: Prediction,

		getChanged: function () {
		}
    });
});