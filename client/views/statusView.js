define(['backbone'], function (Backbone) {
    return Backbone.View.extend({
        template: _.template('<header>Highlight my favourite team. Your prediction score<div class=warning>2 matches today without predictions</div></header>'),

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