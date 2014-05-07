define(['backbone'], function (Backbone) {
    return Backbone.View.extend({
        template: _.template('<header>Highlight my favourite team. Your prediction score<div class=warning>2 matches today without predictions. Your username </div></header>'),

        initialize: function () {
        	_.bindAll(this, 'render');
        	this.model.on('change', this.render, this);
        	this.render();
        },

        render: function() {
        	$(this.el).html(this.template());
        	return this;
        }

    });
});