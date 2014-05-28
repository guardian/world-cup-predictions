define([], function() {
	'use strict';

	var amdConfiguration = {
		context: 'worldcup',
		baseUrl: 'http://chronos.theguardian.com/world-cup-predictions/client/',
		paths: {
			backbone: 'lib/backbone',
			deepmodel: 'lib/backbone.deepmodel',
			underscore: 'lib/underscore',
			jquery: 'lib/jquery',
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