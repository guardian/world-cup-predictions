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

            render: function() {
                var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                var months = ["January", "February","March","April","May","June","July","August","September","October","November","December"];
                this.collection.each(function(match) {
                    var currentDay = new Date(match.get('timestamp') *1000);
                    var formattedDate = currentDay.getDate() + "-" + currentDay.getMonth();
                    var $currentDay;

                    var userScores = this.model.get(match.get('matchId'));
                    var matchView = new MatchView({model: match, prediction: this.model});
                    // console.log(formattedDate);

                    if(this.$('.' + formattedDate).length === 0){
                        this.$el.append('<div class="' + formattedDate + ' matchDay clearfix">');
                        this.$('.' + formattedDate).append('<div class="wcp-divider">' + days[currentDay.getDay()] + " " + currentDay.getDate() + " " + months[currentDay.getMonth()]);
                        this.$('.' + formattedDate).append('<ul class="">');
                        this.$('.' + formattedDate + ' ul').append(matchView.render().el);
                    }else{
                        this.$('.' + formattedDate + ' ul').append(matchView.render().el);
                    }
                    

                    // this.$el.append(matchView.render().el);

                }, this);

                return this;
            }

        });
});