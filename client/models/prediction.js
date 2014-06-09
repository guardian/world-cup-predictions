define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
		urlRoot: 'http://54.220.127.152:3000/prediction',
        initialize: function() {
        }
    });
});