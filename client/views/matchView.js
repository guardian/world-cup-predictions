define(['backbone'], function (Backbone) {
    return Backbone.View.extend({
        template: _.template('<div></div>'),

        initialize: function () {
        	_.bindAll(this, 'render');
        	this.render();
        },

        render: function() {
        	$(this.el).html(this.template());
        	return this;
        }

    });
});