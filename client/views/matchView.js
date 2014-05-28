define([
        'backbone',
        'moment',
        'text!../templates/matchViewTemplate.html'
    ], function (Backbone, moment, MatchViewTemplate) {
    return Backbone.View.extend({
        tagName: 'li',
        template: _.template(MatchViewTemplate),

        events: {
            'change .wcp-alpha-score' : 'scoreChanged',
            'change .wcp-beta-score'  : 'scoreChanged'
        },

        initialize: function(options) {

            this.prediction = options.prediction;

            var matchPrediction = this.prediction.get(this.model.get('matchId'));

            if (matchPrediction) {
                if (matchPrediction.hasOwnProperty('alphaScore')) {
                    this.alphaScore = matchPrediction.alphaScore;
                }

                if (matchPrediction.hasOwnProperty('betaScore')) {
                    this.betaScore = matchPrediction.betaScore;
                }

            }

        },

        scoreChanged: function(e) {
            if (e.target.value > 2)
                e.target.value = e.target.value.slice(0, 2);

            this.prediction.set(this.model.get('matchId'), {});

            var match = this.prediction.get(this.model.get('matchId'));

            match.alphaScore = parseInt(this.$('input.wcp-alpha-score').val(), 10);
            match.betaScore = parseInt(this.$('input.wcp-beta-score').val(), 10);

            Backbone.trigger('scoreChange');
        },

        render: function() {

            var matchDate = moment(this.model.get('matchDate')).format('dddd D MMMM');

            $(this.el).html(this.template({
                alphaTeam: this.model.get('alphaTeam'),
                alphaCode: this.model.get('alphaCode'),
                alphaScore: this.alphaScore,
                betaCode: this.model.get('betaCode'),
                betaTeam: this.model.get('betaTeam'),
                betaScore: this.betaScore,
                matchDate: matchDate,
                matchTime: this.model.get('matchTime')
            }));

            return this;
        }
    });
});