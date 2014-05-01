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
			var launch;
			var head = document.getElementsByTagName('head')[0];

			var link = document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('href', 'http://localhost/world-cup-predictions/client/css/styles.css');
			head.appendChild(link);

			launch = function () {
				app.launch();
			};

			require(amdConfiguration, ['app']).then(launch);
		}
	};
});