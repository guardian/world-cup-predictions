define([
	'backbone',
	'text!../templates/timeViewTemplate.html'
	], function (Backbone, TimeViewTemplate) {
    return Backbone.View.extend({
        tagName: 'div',
        template: _.template(TimeViewTemplate),
        render: function() {
            $(this.el).html(this.template({ nextDate: ''}));
            return this;
        }
    });
});