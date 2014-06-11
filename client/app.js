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

		function setupHeader() {
			var header = $('header.content__head');
			var contentWrapper = $('article.content--interactive');
			var headline = $('h1.content__headline');
			var intro = $('.content__standfirst');
			var newHeader = $('<div class="interactive_header"></div>');


			headline.removeAttr('class');
			intro.attr('class', 'interactive_header_intro');

			newHeader.append(headline);
			newHeader.append(intro);


			header.hide();
			contentWrapper.prepend(newHeader);
			contentWrapper.css('padding-top', '0');
		}


		return {

			initialise: function () {
				setupHeader();

				$(this.el).addClass('wcp');
				var appLoaded = false;
				var querystring = window.location.search;

				var scheduleCollection = new ScheduleCollection();
				var user = new UserModel();

				var usersPredictions = new PredictionModel({
					id: user.get('userId'),
					rawResponse: user.get('rawResponse')
				});
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
		};
});