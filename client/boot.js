define([], function() {
	'use strict';

	var amdConfiguration = {
		context: 'worldcup',
		baseUrl: 'http://daan/~dlouter/code/predictions-world-cup/client/',
		paths: {
			backbone: 'lib/backbone',
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