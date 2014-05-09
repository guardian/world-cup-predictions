define([
		'backbone',
		'text!../templates/statusViewTemplate.html'
	], function (Backbone, StatusViewTemplate) {
    return Backbone.View.extend({
        template: _.template(StatusViewTemplate),

        initialize: function () {
        	_.bindAll(this, 'render');
        	this.model.on('change', this.render, this);
        	this.render();
        },

        render: function() {
        	$(this.el).html(this.template({username: this.model.get('username')}));
        	return this;
        }

    });
});