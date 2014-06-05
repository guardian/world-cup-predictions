define([
        'backbone',
        'jquery',
        'text!../templates/modalViewTemplate.html'
    ], function (Backbone, $, MatchViewTemplate) {
    return Backbone.View.extend({
        tagName: 'div',
        template: _.template(MatchViewTemplate),

        events: {
            'click .wcp-modal-proceed' : 'proceedModal',
            'click .wcp-modal-cancel'  : 'cancelModal'
        },

        initialize: function() {
        },

        proceedModal: function(e) {
            window.location = 'https://profile.theguardian.com/signin';
        },

        cancelModal: function(e) {
            $('.wcp-modal').trigger('closeModal');
        },

        render: function() {

            $(this.el).html(this.template());

            return this;
        }
    });
});