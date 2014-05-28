define([
		'backbone',
		'jquery',
		'views/statusView',
		'views/scheduleView',
		'views/timeView',
		'collections/scheduleCollection',
		'collections/predictionCollection',
		'models/prediction',
		'models/user',
		'link!css/styles.css'
	], function(backbone, $, StatusView, ScheduleView, TimeView, ScheduleCollection, PredictionCollection, PredictionModel, UserModel) {

		'use strict';

		var app = {};

		return {
			initialise: function () {
				$(this.el).addClass('wcp');

				var appLoaded = false;

				var scheduleCollection = new ScheduleCollection();
				var predictionCollection = new PredictionCollection();
				var user = new UserModel();

				var usersPredictions = new PredictionModel({id: user.get('userId')});
				usersPredictions.fetch();

				Backbone.on('scoreChange', function() {
					if (appLoaded)
						usersPredictions.save({});
				});

				var statusView = new StatusView({model: user});
				$(this.el).append(statusView.render().el);

				var timeView = new TimeView();
				$(this.el).append(timeView.render().el);

				var that = this;
				scheduleCollection.fetch({success: function () {
					var scheduleView = new ScheduleView({
						collection: scheduleCollection,
						model: usersPredictions
					});

					$(that.el).append(scheduleView.render().el);

					appLoaded = true;
				}});

			}
		};
});