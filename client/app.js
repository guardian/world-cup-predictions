define([
		'backbone',
		'jquery',
		'views/statusView',
		'views/scheduleView',
		'views/timeView',
		'collections/scheduleCollection',
		'models/user',
		'link!css/styles.css'
	], function(backbone, $, StatusView, ScheduleView, TimeView, ScheduleCollection, UserModel) {

	'use strict';

	var app = {};

	Backbone.on('toolkitReady', function () {

	});

	return {
		initialise: function () {
			$(this.el).addClass('wcp');

			var scheduleCollection = new ScheduleCollection();

			var user = new UserModel();
			user.setToolKitObject();

			console.log(user);

			var statusView = new StatusView();
			statusView.model = user;
			
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