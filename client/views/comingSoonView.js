define([
        'backbone',
        'jquery',
        'text!../templates/comingSoonTemplate.html'
    ], function (Backbone, $, ComingSoonTemplate) {
    return Backbone.View.extend({
        tagName: 'div',
        template: _.template(ComingSoonTemplate),

        events: {
        },

        initialize: function() {
        },

        render: function() {

            $(this.el).html(this.template());

            return this;
        }
    });
});