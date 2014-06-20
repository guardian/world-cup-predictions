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
		'views/historyView',
		'collections/scheduleCollection',
		'models/prediction',
		'models/user',
		'link!css/styles.css'
	], function(backbone, $, Modal, StatusView, ScheduleView, TimeView, ModalView, ComingSoonView, StatisticsView, HistoryView, ScheduleCollection, PredictionModel, UserModel) {

		'use strict';

               var scheduleFetched = false;
               var predictionsFetched = false;
               var scheduleCollection = new ScheduleCollection();
               var usersPredictions;
               var appLoaded;
               var user;

		function setupHeader() {
		var header = $('header.content__head');
			var contentWrapper = $('article.content--interactive');
			var worldCupLogo = $('<div class="interactive_worldcuplogo"></div>');
			var headline = $('h1.content__headline');
			var intro = $('.content__standfirst');
			var newHeader = $('<div class="interactive_header"></div>');
			var newHeaderContent = $('<div class="interactive_header_content"></div>');
			var stepOneText = 'Fill in your predictions';
			var stepTwoText = 'We crunch everyone\'s data';
			var stepThreeText = 'See your performance visualised and compared with other users';
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
			if (scheduleFetched && predictionsFetched) {
				var scheduleView = new ScheduleView({
					collection: scheduleCollection,
					model: usersPredictions
				});

				var statisticsView = new StatisticsView({
					collection: scheduleCollection,
					model: usersPredictions,
					options: {
						userModel: user
					}
				});

				var historyView = new HistoryView({
					collection: scheduleCollection,
					model: usersPredictions
				});

                user.calcResults({
                    usersPredictions: usersPredictions,
                    schedualCollection: scheduleCollection
                });

				$(view).prepend(historyView.render().el);
				$(view).prepend(statisticsView.render().el);
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

				user = new UserModel();

				usersPredictions = new PredictionModel({
					id: user.get('userId'),
					rawResponse: user.get('rawResponse')
				});

               usersPredictions.fetch({success: function(model) {
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
