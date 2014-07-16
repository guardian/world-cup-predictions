define([
        'backbone',
        '../collections/scheduleCollection',
        'models/prediction',
        'views/matchView'
        ], function (Backbone, ScheduleCollection, PredictionModel, MatchView) {

        return Backbone.View.extend({
            tagName: 'div',
            className: 'prediction-area',

            initialize: function () {
            },

            checkInputs: function(prediction) {
                if($(prediction).val()){
                    $(prediction).addClass('score-complete');
                }else{
                    $(prediction).removeClass('score-complete');
                }

                var parentListItem = $(prediction).closest('li');
                if(parentListItem.find('.score-complete').length === 2){
                    parentListItem.addClass('prediction-complete');
                    var resultTeamAlpha = $(parentListItem.find('.score-complete')[0]);
                    var resultTeamBeta = $(parentListItem.find('.score-complete')[1]);
                    if(resultTeamAlpha.val()>resultTeamBeta.val()){
                        resultTeamAlpha.closest('.wcp-row').find('.wcp-match-divider').addClass('result-alpha');
                        resultTeamAlpha.closest('.wcp-row').find('.wcp-match-divider').removeClass('result-draw result-beta');
                    }else if(resultTeamAlpha.val() < resultTeamBeta.val()){
                        resultTeamAlpha.closest('.wcp-row').find('.wcp-match-divider').addClass('result-beta');
                        resultTeamAlpha.closest('.wcp-row').find('.wcp-match-divider').removeClass('result-draw result-alpha');
                    }else if(resultTeamAlpha.val() === resultTeamBeta.val()){
                        resultTeamAlpha.closest('.wcp-row').find('.wcp-match-divider').addClass('result-draw');
                        resultTeamAlpha.closest('.wcp-row').find('.wcp-match-divider').removeClass('result-alpa result-beta');
                    }
                }else{
                    parentListItem.find('.wcp-match-divider').removeClass('result-alpha result-draw result-beta');
                    parentListItem.removeClass('prediction-complete');
                }

                var parentMatchContainer = parentListItem.closest('.matchDay');
                if(parentMatchContainer.find('.prediction-complete').length === parentMatchContainer.find('li').length){
                    parentMatchContainer.addClass('day-complete');
                }else{
                    parentMatchContainer.removeClass('day-complete');
                }
            },

            render: function() {
                var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                var months = ["January", "February","March","April","May","June","July","August","September","October","November","December"];
                var endText = "";
                var j = 0;

                var validMatches = this.collection.filter(function(m) {
                    var alphaTeam = m.get('alphaTeam');
                    var betaTeam = m.get('betaTeam');
                    return ((alphaTeam !== null) && (betaTeam !== null));

                });

                _.each(validMatches, function(match, i) {
                    if (!match.get('expiredMatch')) {
                        var currentDay = new Date((match.get('timestamp')-18000) *1000);
                        var formattedDate = currentDay.getDate() + "-" + currentDay.getMonth();
                        var userScores = this.model.get(match.get('matchId'));
                        var matchView = new MatchView({model: match, prediction: this.model });
                        if(this.$('.' + formattedDate).length === 0){
                            if(j===0){
                                this.$el.append('<div class="' + formattedDate + ' matchDay matchToday clearfix">');
                                this.$('.' + formattedDate).append('<div class="wcp-divider"><div class="wcp-day-check"></div>' + days[currentDay.getDay()] + " " + currentDay.getDate() + " " + months[currentDay.getMonth()] + '<p class="deadlineMessage">Deadline today</p><p class="savedMessage">Check your stats when the matches finish</p>');
                            }else{
                                this.$el.append('<div class="' + formattedDate + ' matchDay clearfix">');
                                this.$('.' + formattedDate).append('<div class="wcp-divider"><div class="wcp-day-check"></div>' + days[currentDay.getDay()] + " " + currentDay.getDate() + " " + months[currentDay.getMonth()] + '<p class="savedMessage">Check your stats when the matches finish</p>');
                            }

                            this.$('.' + formattedDate).append('<ul class="">');
                            this.$('.' + formattedDate + ' ul').append(matchView.render().el);
                        } else {
                            this.$('.' + formattedDate + ' ul').append(matchView.render().el);
                        }
                        j++;
                    }

                }, this);
                this.$el.append("<div class='matchDay lastMatch'><ul><p>" + endText + "</p></ul>");

                var _this = this;
                $.each(this.$('input'), function(i,j){
                    _this.checkInputs(j);
                });

                this.$("input").change(function(){
                    _this.checkInputs(this);
                });

                return this;
            }

        });
});