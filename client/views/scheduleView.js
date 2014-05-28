define([
        'backbone',
        '../collections/scheduleCollection',
        'models/prediction',
        'views/matchView'
        ], function (Backbone, ScheduleCollection, PredictionModel, MatchView) {

        return Backbone.View.extend({
            tagName: 'ul',

            initialize: function () {
            },

            render: function() {
                this.collection.each(function(match) {

                    var userScores = this.model.get(match.get('matchId'));
                    var matchView = new MatchView({model: match, prediction: this.model});

                    this.$el.append(matchView.render().el);

                }, this);

                return this;
            }

        });
});