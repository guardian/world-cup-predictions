define([
		'backbone',
		'jquery',
		'views/statusView',
		'views/scheduleView',
		'collections/scheduleCollection'
	], function(backbone, $, StatusView, ScheduleView, ScheduleCollection) {

	var app = {};
	return {
		initialise: function () {

			$(this.el).addClass('wcp');

			// Schedule collection
			var scheduleCollection = new ScheduleCollection();

			var statusView = new StatusView();
			$(this.el).append(statusView.render().el);

			var that = this;
			scheduleCollection.fetch({success: function () {
				var scheduleView = new ScheduleView({collection: scheduleCollection});
				$(that.el).append(scheduleView.render().el);
			}});
		}
	};
});