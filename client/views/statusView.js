define([
		'backbone',
        'models/status',
		'text!../templates/statusViewTemplate.html'
	], function (Backbone, StatusModel, StatusViewTemplate) {
    return Backbone.View.extend({
        template: _.template(StatusViewTemplate),

        initialize: function (options) {
            this.user = options.user;
            this.model = new StatusModel({id: this.user.get('userId')});
            this.model.on('change', this.render, this);
        },

        render: function() {
            $(this.el).html(this.template({
                username: this.user.get('username'),
                score: this.model.get('score'),
                loggedInUser: this.user.get('isUserLoggedIn')
            }));
            return this;
        }

    });
});