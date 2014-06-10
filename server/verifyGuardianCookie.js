var crypto = require('crypto');
var base64url = require('base64url');
var fs = require('fs');
var pubKey = fs.readFileSync(__dirname +'/gu_prod_key.pub');

module.exports = function(cookieValue, guardianID) {
    // Check that cookie value looks correct
    if (typeof cookieValue !== 'string' || cookieValue.indexOf('.') === -1) {
        return false;
    }

    // Decode cookie
    var cookieDataBase64 = base64url.toBase64(cookieValue.split('.')[0]);
    var cookieSigBase64 = base64url.toBase64(cookieValue.split('.')[1]);
    var jsonString  = new Buffer(cookieDataBase64 || '', 'base64').toString('utf8');
    var cookieData = null;

    // Try parseing the cookie JSON string
    try {
        cookieData = JSON.parse(jsonString);
    } catch (err) {
        return false;
    }

    // Check guardian IDs match
    if (cookieData[0] !== guardianID) {
       return false;
    }


    // Check the signature
    var verifier = crypto.createVerify('sha256');
    var buffer = new Buffer(cookieDataBase64, 'base64');

    verifier.update(buffer);
    return verifier.verify(pubKey, cookieSigBase64, 'base64');
};

