define(['backbone', '../config'], function (Backbone, config) {
    return Backbone.Model.extend({
		urlRoot: config.apiUrl + '/prediction/',
        initialize: function() {
        }
    });
});