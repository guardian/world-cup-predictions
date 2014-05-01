define([
		'backbone',
		'jquery',
		'views/statusView',
		'collections/scheduleCollection'
	], function(backbone, $, StatusView, ScheduleCollection) {
	var app = {};
	return {
		initialise: function () {

			$(this.el).addClass('wcp');


			// Schedule collection
			var scheduleCollection = new ScheduleCollection;
			scheduleCollection.fetch();

			console.log(scheduleCollection);

			var statusView = new StatusView();
			$(this.el).html(statusView.render().el);

		}
	};
});