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



                    var stats = match.get('stats');
                    if (!stats) {
                        return;
                    }

                    var hiveAlphaWinCount = 0;
                    var hiveDrawCount = 0;
                    var hiveBetaWinCount = 0;

                    var breakdown = {
                        alphaWin:0,
                        draw: 0,
                        betaWin: 0
                    };


                    for (var result in stats.frequencyHistogram) {
                        var a = parseInt(result.split(':')[0], 10);
                        var b = parseInt(result.split(':')[1], 10);
                        var count = stats.frequencyHistogram[result];
                        if (a > b)  { breakdown.alphaWin += count; }
                        if (a == b) { breakdown.draw += count; }
                        if (a < b)  { breakdown.betaWin += count; }
                    }

                    var hivePredictWinner;
                    var maxCount = 0;
                    for (var key in breakdown) {
                        var c = breakdown[key];
                        if (c > maxCount) {
                            maxCount = c;
                            hivePredictWinner = key;
                        }
                    }

                    var hivePredictOutcome = false;
                    if (hivePredictWinner === 'alphaWin' && alphaOutcome == 'win') {
                        hivePredictOutcome = true;
                    }
                    if (hivePredictWinner === 'draw' && alphaOutcome == 'draw') {
                        hivePredictOutcome = true;
                    }
                    if (hivePredictWinner === 'betaWin' && alphaOutcome == 'lose') {
                        hivePredictOutcome = true;
                    }


                    var aScore = parseInt(stats.topResult.split(':')[0], 10);
                    var bScore = parseInt(stats.topResult.split(':')[1], 10);
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
                        hiveCorrectScore: isCorrect,
                        breakdown: breakdown,
                        hivePredictOutcome: hivePredictOutcome
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
                        uAlphaOutcome = 'lose';
                        uBetaOutcome = 'win';
                    } else if (uAlphaScore === uBetaScore) {
                        uAlphaOutcome = 'draw';
                        uBetaOutcome = 'draw';
                    }

                    var userPredictOutcome = false;
                    console.log(uAlphaOutcome, alphaOutcome);
                    if (uAlphaOutcome == alphaOutcome) {
                        userPredictOutcome = true;
                    }

                    match.set({
                        userAlphaOutcome: uAlphaOutcome,
                        userBetaOutcome: uBetaOutcome,
                        userPredictOutcome: userPredictOutcome
                    });

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
