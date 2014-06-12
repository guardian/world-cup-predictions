define([
		'backbone',
        'models/status',
		'text!../templates/statusViewTemplate.html',
        'models/social'
	], function (Backbone, StatusModel, StatusViewTemplate, SocialModel) {
    return Backbone.View.extend({
        template: _.template(StatusViewTemplate),

        events: {
            'click .wcp-facebook': 'clickFacebook',
            'click .wcp-twitter': 'clickTwitter'
        },

        initialize: function (options) {
            this.user = options.user;
            this.model = new StatusModel({id: this.user.get('userId')});
            this.model.on('change', this.render, this);
        },

        clickFacebook: function(e) {
            e.preventDefault();
            SocialModel.shareFacebook();
        },

        clickTwitter:function(e) {
            e.preventDefault();
            SocialModel.shareTwitter();
        },

        render: function() {
            $(this.el).html(this.template({
                username: this.user.get('username'),
                score: this.model.get('score'),
                loggedInUser: this.user.get('isUserLoggedIn')
            }));
            // debugger;
            return this;
        }

    });
});