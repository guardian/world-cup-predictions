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
			var worldCupLogo = $('<div class="interactive_worldcuplogo"></div>');
			var headline = $('h1.content__headline');
			var intro = $('.content__standfirst');
			var newHeader = $('<div class="interactive_header"></div>');
			var newHeaderContent = $('<div class="interactive_header_content"></div>');
			var stepOneText = 'Fill in your predictions';
			var stepTwoText = 'We crunch everyone\'s data overnight';
			var stepThreeText = 'Sign in the next morning to see your performance visualised and compared with other users';
			var interactiveStandfirst = $('<div class="interactive_standfirst"></div>');

			headline.removeAttr('class');
			intro.attr('class', 'interactive_header_intro');

			interactiveStandfirst.append(headline);
			interactiveStandfirst.append(intro);
			interactiveStandfirst.append('<ul><li><span class="listNumber">1</span><span class="listText">' + stepOneText + '</span></li><li><span class="listNumber">2</span><span class="listText">' + stepTwoText + '</span></li><li><span class="listNumber">3</span><span class="listText">' + stepThreeText + '</span></li></ul>');


			header.hide();
			contentWrapper.prepend(newHeader);
			newHeader.prepend(newHeaderContent);
			newHeaderContent.append(worldCupLogo);
			newHeaderContent.append(interactiveStandfirst);
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
