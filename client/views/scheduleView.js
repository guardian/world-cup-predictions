define([
        'backbone',
        '../collections/scheduleCollection',
        'views/matchView'
        ], function (Backbone, ScheduleCollection, MatchView) {

        return Backbone.View.extend({
            tagName: 'ul',

            initialize: function () {

            },

            render: function() {
                this.collection.each(function(match) {
                    var matchView = new MatchView({model: match});
                    this.$el.append(matchView.render().el);
                }, this);

            return this;

            },

            save: function() {
                Bsckbone.sync('create', this, {
                    success: function() {
                        console.log('saved');
                    }
                });
            }
        });
});