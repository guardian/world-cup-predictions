define([
    'backbone',
    'text!../templates/matchViewTemplate.html'
    ], function (Backbone, MatchViewTemplate) {
    return Backbone.View.extend({
        tagName: 'li',
        template: _.template(MatchViewTemplate),
        render: function() {
        	$(this.el).html(this.template(this.model.toJSON()));
        	return this;
        }
    });
});