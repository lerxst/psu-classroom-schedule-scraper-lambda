// Set up modules
var request = require('request');
var cheerio = require('cheerio');

// Process invokation
exports.handler = function(event, context, callback) {
	// Response placeholder
	var resp = {};

    new Promise(function(resolve, reject) {
		// Check for url
		if (!event.url)
			reject('Classroom "url" parameter is required.');

		// Make request
		request(event.url, function(error, response, html) {
			// Check for error
			if (error)
				reject('Error with HTTP request.');

			// Go to process HTML
			resolve(html);
		});
    })
	// Process HTML
    .then(function(html) {
		var classInfo = classObj = null;

		// Load page into Cheerio.
		var $ = cheerio.load(html);

		$('.no-bottom-margin').filter(function() {
			// Get date
			var prevElem = $(this).prev();
			var date = (prevElem.html().split('<br>')[1]).trim();

			// Add to response
			resp[date] = [];

			// Get classes
			$(this).find('.row').each(function(i, classElem) {
				// Set up object
				classObj = {};

				// Get class info
				$(this).find('.data').each(function(j, classInfoElem) {
					// Set up data
					classInfo = $(this).text().trim();

					// Start
					if (j == 0)
						classObj.start = classInfo;
					// End
					else if (j == 1)
						classObj.end = classInfo;
					// Name
					else if (j == 2)
						classObj.name = classInfo;
				});

				// Add to date
				resp[date].push(classObj);
			});

		});

        // Respond with response
        callback(null, resp);
    })
	// Catch exceptions
	.catch(function(e) {
		// Respond with error.
		callback(e);
	});
}
