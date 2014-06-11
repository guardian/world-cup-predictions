define(['backbone', 'models/prediction', '../config'], function (Backbone, Prediction, config) {
    return Backbone.Collection.extend({
		url: config.apiUrl + '/prediction/',
		model: Prediction,

		getChanged: function () {
		}
    });
});