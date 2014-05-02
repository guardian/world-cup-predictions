define([
        'backbone',
        '../collections/scheduleCollection',
        'views/matchView'
        ], function (Backbone, ScheduleCollection, MatchView) {

        return Backbone.View.extend({
            // template: _.template('<div></div>'),
            tagName: 'ul',

            render: function() {
                this.collection.each(function(match) {
                    var matchView = new MatchView({model: match});
                    this.$el.append(matchView.render().el);
                }, this);

            	return this;
            }
        });
});