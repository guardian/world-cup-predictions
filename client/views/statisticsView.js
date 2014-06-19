define([
    'backbone',
    'underscore',
    'jquery',
    'views/singleMatchView',
    'views/matchView',
    'text!../templates/statisticsViewTemplate.html'
    ],
function (
    Backbone,
    _,
    $,
    singleMatchView,
    MatchView,
    StatisticsViewTemplate
){
    return Backbone.View.extend({

        tagName: 'div',

        template: _.template(StatisticsViewTemplate),

        events: {
            'click .wcp-show-all-previous' : 'showAllPreviousMatches',
        },

        initialize: function(obj) {
            this.userModel = obj.options.userModel;
        },

        showAllPreviousMatches: function(){
            this.$('.secondary-stat').removeClass('secondary-stat');
            this.$('.wcp-show-all-previous').hide();
        },

        renderSummaryExample: function() {
            var container = $('<ul class="wcp-match-history"></ul>');

            this.collection.each(function(match) {
                var predictionScore;
                var expiredMatch = match.get('expiredMatch');

                if(match.get('userCorrectScore')){
                    predictionScore = "prediction-right-score";
                }else if(match.get('userPredictOutcome')){
                    predictionScore = "prediction-right-winner";
                }else{
                    predictionScore = "prediction-wrong";
                }

                var li = $('<li></li>');
                var starRating = $('<div class="starRating"></div>')
                $(starRating).addClass(predictionScore);
                var matchStat = $('<div class="match-stat"></div>')
                matchStat.append(match.get('alphaCode'), match.get('betaCode'))

                li.append(starRating, matchStat);

                if (expiredMatch) {
                    container.append(li);
                    return;
                }
            });

            return container;
        },

        addMatches: function() {
            var finishedMatches = this.collection.where({expiredMatch: true});
            finishedMatches.reverse();
            _.each(finishedMatches, function(match, i) {
                var matchView = new singleMatchView({
                    model: match,
                    options: { userModel: this.model }
                });

                matchView.render();
                if (i > 3) {
                    matchView.$el.addClass('secondary-stat');
                } else {
                    matchView.$el.addClass('primary-stat');
                }
                this.$matchesContainer.append(matchView.el);
            }, this);
        },



        render: function() {
            console.log(this.userModel)
            $('.interactive_header').after(this.template({
                isUserLoggedIn: this.userModel.get('isUserLoggedIn'),
                correctScore: this.userModel.get('correctCount'),
                totalPredictions: this.userModel.get('predictionCount'),
            }));
            // this.$el.html(this.template({
            //     correctScore: this.userModel.get('correctCount'),
            //     totalPredictions: this.userModel.get('predictionCount'),
            // }));

            this.$matchesContainer = this.$('.previousMatchContainer');
            // this.addMatches();
            return this;
        }
    });
});