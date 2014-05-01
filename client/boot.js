define([], function() {
	'use strict';
	var amdConfiguration = {
		context: 'worldcup',
		baseUrl: 'http://localhost/world-cup-predictions/client/',
		paths: {
			backbone: 'lib/backbone',
			underscore: 'lib/underscore',
			jquery: 'lib/jquery'
		}
	};

	return {
		boot : function(el, context, config, mediator) {
			var head = document.getElementsByTagName('head')[0];
			var link = document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('href', 'http://localhost/world-cup-predictions/client/css/styles.css?234098');
			head.appendChild(link);

			require(amdConfiguration, ['app']).then(function(app){app.el = el; app.initialise();});
		}
	};
});