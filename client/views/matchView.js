define([
        'backbone',
        'moment',
        'text!../templates/matchViewTemplate.html'
    ], function (Backbone, moment, MatchViewTemplate) {
    return Backbone.View.extend({
        tagName: 'li',
        template: _.template(MatchViewTemplate),

        events: {
            'change input.wcp-alpha-score': 'scoreChanged',
            'change input.wcp-beta-score': 'scoreChanged'
        },

        initialize: function() {
            // _.bindAll(this, 'contentChanged');
            this.alphaScore = this.$('input.wcp-alpha-score');
            this.betaScore = this.$('input.wcp-beta-score');
        },

        scoreChanged: function(e) {
            this.model.set('alphaScore', this.$('input.wcp-alpha-score').val());
            this.model.set('betaScore', this.$('input.wcp-beta-score').val());
        },

        render: function() {
            var matchDate = moment(this.model.get('matchDate')).format('dddd D MMMM');

            $(this.el).html(this.template({
                alphaTeam: this.model.get('alphaTeam'),
                alphaCode: this.model.get('alphaCode'),
                betaCode: this.model.get('betaCode'),
                betaTeam: this.model.get('betaTeam'),
                matchDate: matchDate,
                matchTime: this.model.get('matchTime')
            }));

            return this;
        }
    });
});