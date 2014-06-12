define([
		'backbone',
		'jquery',
		'modal',
		'views/statusView',
		'views/scheduleView',
		'views/timeView',
		'views/modalView',
		'views/comingSoonView',
		'views/statisticsView',
		'collections/scheduleCollection',
		'models/prediction',
		'models/user',
		'link!css/styles.css'
	], function(backbone, $, Modal, StatusView, ScheduleView, TimeView, ModalView, ComingSoonView, StatisticsView, ScheduleCollection, PredictionModel, UserModel) {

		'use strict';

               var scheduleFetched = false;
               var predictionsFetched = false;
               var scheduleCollection = new ScheduleCollection();
               var usersPredictions;
               var appLoaded;

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

		function renderMainView(view) {

			// debugger;

			if (scheduleFetched && predictionsFetched) {
				var scheduleView = new ScheduleView({
					collection: scheduleCollection,
					model: usersPredictions
				});

				var statisticsView = new StatisticsView({
					collection: scheduleCollection,
					model: usersPredictions
				});

				// debugger;

				$(view).append(statisticsView.render().el);
				$(view).append(scheduleView.render().el);
				$('.wcp-loading').remove();
				appLoaded = true;
			}
		}


		return {

			initialise: function () {
				setupHeader();

				$(this.el).addClass('wcp');
				appLoaded = false;

				var user = new UserModel();

				usersPredictions = new PredictionModel({
					id: user.get('userId'),
					rawResponse: user.get('rawResponse')
				});

               usersPredictions.fetch({success: function() {
					predictionsFetched = true;
					renderMainView(this.el);
               }.bind(this), error: function(e) {
					predictionsFetched = true;
					renderMainView(this.el);
               }.bind(this)});

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

				// debugger;

				var statusView = new StatusView({user: user});
				$(this.el).append(statusView.render().el);

				var timeView = new TimeView();
				$(this.el).append(timeView.render().el);

               scheduleCollection.fetch({success: function() {
               	// debugger;
                       scheduleFetched = true;
                       renderMainView(this.el);
               }.bind(this)});
               $(this.el).append('<p class="wcp-loading">Loading</p>');

			}
		};
});
