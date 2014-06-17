define([
        'backbone',
        'common/modules/identity/api',
        '../config'
        ], function (Backbone, Identity, config) {
        return Backbone.Model.extend({
            urlRoot: config.apiUrl + '/user',
            defaults: {
                userID: 0,
                isUserLoggedIn: false,
                username: null,
                userTimezoneOffset: new Date().getTimezoneOffset()
            },

            initialize: function() {
                this.set('isUserLoggedIn', Identity.isUserLoggedIn());

                if (Identity.isUserLoggedIn()) {
                    this.set('userId', parseInt(Identity.getUserFromCookie().id, 10));
                    this.set('username', Identity.getUserFromCookie().displayName);
                    this.set('rawResponse', Identity.getUserFromCookie().rawResponse);
                    this.set('userEmail', Identity.getUserFromCookie().primaryEmailAddress);
                }

                this.syncUserDetails();
            },

            calcResults: function(data) {
               var correct = 0;
               var wrong = 0;
               var predictedCount = 0;

               data.schedualCollection.each(function(match) {
                    // console.log(match);
                    var matchID = match.get('matchId');
                    var userPrediction = data.usersPredictions.get(matchID);
                    var alphaScore = match.get('alphaScore');
                    var betaScore = match.get('betaScore');

                    // Early exit
                    if (typeof betaScore !== 'number' ||
                        typeof alphaScore !== 'number')
                    {
                        return;
                    }


                    // Match outcome
                    var alphaOutcome;
                    var betaOutcome;
                    if (alphaScore > betaScore) {
                        alphaOutcome = 'win';
                        betaOutcome = 'lose';
                    } else if (alphaScore < betaScore) {
                        alphaOutcome = 'lose';
                        betaOutcome = 'win';
                    } else if (alphaScore === betaScore) {
                        alphaOutcome = 'draw';
                        betaOutcome = 'draw';
                    }

                    match.set({
                        alphaOutcome: alphaOutcome,
                        betaOutcome: betaOutcome
                    });







                    if (!match.get('stats')) {
                        return;
                    }

                    var stats = match.get('stats');
                    var aScore = stats.topResult.split(':')[0];
                    var bScore = stats.topResult.split(':')[1];
                    var isCorrect = (aScore === alphaScore &&
                                     bScore === betaScore);

                    var hAlphaOutcome;
                    var hBetaOutcome;
                    if (aScore > bScore) {
                       hAlphaOutcome = 'win';
                       hBetaOutcome = 'lose';
                    } else if (aScore < bScore) {
                        hAlphaOutcome = 'win';
                        hBetaOutcome = 'lose';
                    } else if (aScore === bScore) {
                        hAlphaOutcome = 'draw';
                        hBetaOutcome = 'draw';
                    }

                    match.set({
                        hiveBetaOutcome: hBetaOutcome,
                        hiveAlphaOutcome: hAlphaOutcome,
                        hiveCorrectScore: isCorrect
                    });







                    if (!userPrediction) {
                        return;
                    }

                    var uAlphaScore = userPrediction.alphaScore;
                    var uBetaScore = userPrediction.betaScore;

                    // User prediction
                    predictedCount += 1;
                    if (userPrediction.alphaScore === alphaScore &&
                        userPrediction.betaScore === betaScore)
                    {
                        correct += 1;
                        match.set('userCorrectScore', true);
                    } else {
                        wrong += 1;
                        match.set('userCorrectScore', false);
                    }

                    // user outcome
                    var uAlphaOutcome;
                    var uBetaOutcome;
                    if (uAlphaScore > uBetaScore) {
                       uAlphaOutcome = 'win';
                       uBetaOutcome = 'lose';
                    } else if (uAlphaScore < uBetaScore) {
                        uAlphaOutcome = 'win';
                        uBetaOutcome = 'lose';
                    } else if (uAlphaScore === uBetaScore) {
                        uAlphaOutcome = 'draw';
                        uBetaOutcome = 'draw';
                    }

                    // Hive mind prediction
                    if (match.get('stats')) {
                                            }

                    match.set({
                        userAlphaOutcome: uAlphaOutcome,
                        userBetaOutcome: uBetaOutcome
                    });
                    // console.log(match);
                });

                // Set user stats
                this.set({
                    correctCount: correct,
                    failCount: wrong,
                    predictionCount: predictedCount,
                });

            },

            syncUserDetails: function() {
                this.save();
            }

        });
});
