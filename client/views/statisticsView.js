define([
        'backbone',
        'jquery',
        'text!../templates/statisticsViewTemplate.html',
        'views/matchView'
    ], function (Backbone, $, StatisticsViewTemplate, MatchView) {
    return Backbone.View.extend({
        tagName: 'div',
        template: _.template(StatisticsViewTemplate),

        events: {
        },

        initialize: function() {

        },

        render: function() {
            console.log(this.collection);
            var matches = this.collection.where({matchId: 7029}).map(function(match){

                var userMatchPrediction = this.model.get(match.get('matchId'));

                var userAlphaScore = null;
                var userBetaScore = null;


                if (userMatchPrediction) {
                    userAlphaScore = userMatchPrediction.alphaScore;
                    userBetaScore = userMatchPrediction.betaScore;
                }

                var matchStats = match.get('stats');

                var hiveAlphaScore = null;
                var hiveBetaScore = null;

                if (matchStats) {
                    hiveAlphaScore = matchStats.topResult.split(':')[0];
                    hiveBetaScore = matchStats.topResult.split(':')[1];
                }
                
                return {
                    alphaScore: match.get('alphaScore'),
                    alphaTeam: match.get('alphaTeam'),
                    alphaCode: match.get('alphaCode'),
                    betaScore: match.get('betaScore'),
                    betaTeam: match.get('betaTeam'),
                    betaCode: match.get('betaCode'),
                    userAlphaScore: userAlphaScore,
                    userBetaScore: userBetaScore,
                    hiveAlphaScore: hiveAlphaScore,
                    hiveBetaScore: hiveBetaScore
                };

            }.bind(this));


            $('.interactive_header').after(this.template({matches: matches}));

            return this;
        }
    });
});