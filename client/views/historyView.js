define([
    'backbone',
    'underscore',
    'views/singleMatchView',
    'text!../templates/historyViewTemplate.html'
    ],
function (
    Backbone,
    _,
    SingleMatchView,
    Template
) {
    return Backbone.View.extend({

        tag: 'div',

        template: _.template(Template),

        className: 'history_block',

        events: {
            'click .historyStar' : 'showMatch'
        },

        initialize: function() {
            this.matchView = null;
        },

        showMatch: function(e) {
            var matchID = $(e.currentTarget).data('matchid');
            var matchModel = this.collection.findWhere({'matchId': matchID});
            this.matchView.model = matchModel;
            this.matchView.render();
        },

        getTemplateOptions: function() {
            var matches = this.collection.map(function(match) {
                return match.toJSON();
            });

            return {
                matches: matches
            };
        },


        render: function() {
            this.$el.html(this.template( this.getTemplateOptions() ));
            this.matchView = new SingleMatchView({
                model: this.collection.at(0),
                options: { userModel: this.model }
            });
            this.$('.history_container').append(this.matchView.render().el);

            return this;
        }

    });
});