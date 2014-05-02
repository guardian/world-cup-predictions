define([], function() {
	'use strict';

	var amdConfiguration = {
		context: 'worldcup',
		baseUrl: 'http://chronos.theguardian.com/world-cup-predictions/client/',
		paths: {
			backbone: 'lib/backbone',
			underscore: 'lib/underscore',
			jquery: 'lib/jquery'
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