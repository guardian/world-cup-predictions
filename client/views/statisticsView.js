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
            'click .wcp-show-all-previous' : 'showAllPreviousMatches',
        },

        initialize: function() {

        },
        showAllPreviousMatches: function(){
            this.$('.secondary-stat').removeClass('secondary-stat');
            this.$('.wcp-show-all-previous').hide();
        },
        calculateBreakDown: function(breakdownData){
            var breakdown = {
                alphaWin:0,
                draw: 0,
                betaWin: 0
            };
            if (breakdownData) {

                for(var key in breakdownData){
                    if(key.split(':')[0] > key.split(':')[1]){
                        breakdown.alphaWin += breakdownData[key];
                    }else if(key.split(':')[0] < key.split(':')[1]){
                        breakdown.betaWin += breakdownData[key];
                    }else if(key.split(':')[0] === key.split(':')[1]){
                        breakdown.draw += breakdownData[key];
                    }
                }
                return breakdown;
            }
        },

        createMatchTemplateData: function (match) {
                var userMatchPrediction = this.model.get(match.get('matchId'));
                var userAlphaScore = null;
                var userBetaScore = null;
                var totalPredictions = 0;
                var topResultOccurence;
                var userResultOccurence;
                var matchResult;

                if(match.get('alphaScore')>match.get('betaScore')){
                    matchResult = "wcp-breakdown-alpha-win";
                } else if(match.get('alphaScore')<match.get('betaScore')){
                     matchResult = "wcp-breakdown-beta-win";
                } else if(match.get('alphaScore') === match.get('betaScore')){
                     matchResult = "wcp-breakdown-draw-result";
                }

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
                    for(var key in matchStats.frequencyHistogram){
                        totalPredictions += matchStats.frequencyHistogram[key];
                    }
                    var topResultOccurence = matchStats.frequencyHistogram[matchStats.topResult];
                    var topResultPercentage = Math.round((topResultOccurence/totalPredictions)*1000)/10;
                    var userResultOccurence = matchStats.frequencyHistogram[userAlphaScore + ":" + userBetaScore];
                    var userResultPercentage = Math.round((userResultOccurence/totalPredictions)*1000)/10;
                    var predictionBreakdown = this.calculateBreakDown(matchStats.frequencyHistogram);
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
                    hiveBetaScore: hiveBetaScore,
                    hiveScorePercentage : topResultPercentage,
                    userScorePercentage : userResultPercentage,
                    totalPredictions : totalPredictions,
                    predictionBreakdown : predictionBreakdown,
                    matchResult : matchResult,
                };

        },

        render: function() {
            var finishedMatches = this.collection.where({expiredMatch: true});
            finishedMatches.reverse();
            var matchTemplateData = finishedMatches.map(this.createMatchTemplateData.bind(this));

            this.$el.html(this.template({matches: matchTemplateData}));
            if(this.$('.wcp-match-stat').length <5){
                this.$('.wcp-show-all-previous').hide();
            }
            return this;
        }
    });
});