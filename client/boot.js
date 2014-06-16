define([], function() {
	'use strict';

	var amdConfiguration = {
		context: 'worldcup',
		baseUrl: 'http://chronos.theguardian.com/client/',
		// baseUrl: 'http://interactive.guim.co.uk/next-gen/football/ng-interactive/2014/jun/world-cup-predictions/',
		paths: {
			backbone: 'lib/backbone',
			underscore: 'lib/underscore',
			jquery: 'lib/jquery',
			modal: 'lib/jquery.modal',
			moment: 'lib/moment'
		},
		pluginPath: 'lib/'
	};


	return {
		boot : function(el, context, config, mediator) {
			require(amdConfiguration, ['app']).then(function(app){
				app.el = el; app.initialise();
			});
		}
	};
});
