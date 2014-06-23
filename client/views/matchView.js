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
            'change .wcp-beta-score'  : 'scoreChanged',
            'input .wcp-alpha-score' : 'validateNumber',
            'input .wcp-beta-score'  : 'validateNumber'
        },

        initialize: function(options) {
            this.prediction = options.prediction;
            var matchPrediction = this.prediction.get(this.model.get('matchId'));
            console.log(matchPrediction, '000', this.model.get('matchId'), this.prediction);

            if (matchPrediction) {
                if (matchPrediction.hasOwnProperty('alphaScore')) {
                    this.alphaScore = matchPrediction.alphaScore;
                }

                if (matchPrediction.hasOwnProperty('betaScore')) {
                    this.betaScore = matchPrediction.betaScore;
                }
            }
        },

        validateNumber: function(e) {
            if (e.target.value !== '') {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = parseInt(e.target.value, 10);
            }
        },

        scoreChanged: function(e) {
            if (e.target.value > 2 && (e.target.value !== ''))
                e.target.value = e.target.value.slice(0, 2);

            this.prediction.set(this.model.get('matchId'), {});

            var match = this.prediction.get(this.model.get('matchId'));

            match.alphaScore = parseInt(this.$('input.wcp-alpha-score').val(), 10);
            match.betaScore = parseInt(this.$('input.wcp-beta-score').val(), 10);

            Backbone.trigger('scoreChange');
        },

        itemStatus:function(correctPrediction){
            if(this.model.get('expiredMatch')){
                this.el.className = 'disabled';
                if(correctPrediction){
                    this.el.className = 'correct-prediction';
                }
            }
        },

        render: function() {
            function isInteger(i) {
                return i % 1 === 0;
            }

            var correctPrediction;
            if (this.model.get('expiredMatch')) {
                if (isInteger(this.alphaScore) && isInteger(this.betaScore) && isInteger(this.model.get('alphaScore')) && isInteger(this.model.get('betaScore'))) {
                    if (this.alphaScore === this.model.get('alphaScore') && this.betaScore === this.model.get('betaScore')) {
                        correctPrediction = true;
                    }
                }
            }

            var timezoneOffset = new Date().getTimezoneOffset();

            this.itemStatus(correctPrediction);

            var hiveMindScore;

            if (this.model.get('stats')) {
                hiveMindScore = this.model.get('stats').topResult;
            }

            $(this.el).html(this.template({
                alphaTeam: this.model.get('alphaTeam'),
                alphaCode: this.model.get('alphaCode'),
                alphaScore: this.alphaScore,
                betaCode: this.model.get('betaCode'),
                betaTeam: this.model.get('betaTeam'),
                betaScore: this.betaScore,
                timestamp: moment.unix(this.model.get('timestamp')).format('dddd D MMMM HHmm'),
                expiredMatch: this.model.get('expiredMatch'),
                realAlphaScore: this.model.get('alphaScore'),
                realBetaScore: this.model.get('betaScore'),
                hiveMindScore: hiveMindScore,
                groupname: this.model.get('groupname'),
                correctPrediction: correctPrediction
            }));

            return this;
        }
    });
});