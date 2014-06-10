define([
		'backbone',
		'jquery',
		'modal',
		'views/statusView',
		'views/scheduleView',
		'views/timeView',
		'views/modalView',
		'views/comingSoonView',
		'collections/scheduleCollection',
		'models/prediction',
		'models/user',
		'link!css/styles.css'
	], function(backbone, $, Modal, StatusView, ScheduleView, TimeView, ModalView, ComingSoonView, ScheduleCollection, PredictionModel, UserModel) {

		'use strict';

		var app = {};

		return {
			initialise: function () {
				$(this.el).addClass('wcp');
				var appLoaded = false;
				var querystring = window.location.search;
				if (querystring.indexOf('?ok') !== 0) {
					var comingSoonView = new ComingSoonView();
					$(this.el).append(comingSoonView.render().el);
				} else {
					var scheduleCollection = new ScheduleCollection();
					var user = new UserModel();

					var usersPredictions = new PredictionModel({id: user.get('userId')});
					usersPredictions.fetch();

					var modalView = new ModalView();
					$(this.el).append(modalView.render().el);
					$('.wcp-modal').modal();

					Backbone.on('scoreChange', function() {
						if (user.get('isUserLoggedIn') === false) {
							$('.wcp-modal').trigger('openModal');
						}

						if (appLoaded)
							usersPredictions.save({});
					});

					var statusView = new StatusView({user: user});
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

			}
		};
});