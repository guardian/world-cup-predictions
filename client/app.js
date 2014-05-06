define([
		'backbone',
		'jquery',
		'views/statusView',
		'views/scheduleView',
		'views/timeView',
		'collections/scheduleCollection',
		'link!css/styles.css'
	], function(backbone, $, StatusView, ScheduleView, TimeView, ScheduleCollection) {

	'use strict';

	var app = {};
	return {
		initialise: function () {
			$(this.el).addClass('wcp');

			var scheduleCollection = new ScheduleCollection();

			var statusView = new StatusView();
			$(this.el).append(statusView.render().el);

			var timeView = new TimeView();
			$(this.el).append(timeView.render().el);

			var that = this;
			scheduleCollection.fetch({success: function () {
				var scheduleView = new ScheduleView({collection: scheduleCollection});
				$(that.el).append(scheduleView.render().el);
			}});
		}
	};
});