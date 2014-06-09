define(['backbone', 'models/prediction'], function (Backbone, Prediction) {
    return Backbone.Collection.extend({
		url: 'http://54.195.89.236:3000/prediction/',
		// url: 'http://localhost:3000/prediction/',
		model: Prediction,

		getChanged: function () {
		}
    });
});