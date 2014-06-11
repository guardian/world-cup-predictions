define([
    'backbone',
    '../config'], function (Backbone, config) {
    var SocialModel = Backbone.Model.extend({

        defaults: {
            facebook_id: '180444840287',
            twitter_account: 'guardian',
            url: config.shortUrl,
            fullUrl: config.fullUrl,
            title: 'World Cup Predictions',
            description: "I've made my World Cup predictions at the Guardian. What do you think will happen?",
            photo: 'http://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2014/6/5/1401964714817/WorldCupDreamteam.png'
        },

        urls: {
            facebook: 'https://www.facebook.com/dialog/feed?app_id={app_id}&link={url}&picture={img}&name={title}&description={description}&redirect_uri={redirect_url}',
            twitter: 'https://twitter.com/share?url={url}&text={description}&via={via}'
        },

        openWindow: function(url) {
            var w = 550;
            var h = 250;

            var leftPosition;
            var topPosition;

            leftPosition = (window.screen.width / 2) - ((w / 2) + 10);
            topPosition = (window.screen.height / 2) - ((h / 2) + 50);

            var windowFeatures = "status=no,height=" + h + ",width=" + w + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";

            window.open(url, 'wcpShare', windowFeatures);
            return false;
        },

        shareFacebook: function() {
            this.openWindow(this.getFacebookUrl());
        },

        shareTwitter: function() {
            this.openWindow(this.getTwitterUrl());
        },

        getFacebookUrl: function(options) {
            var data = {
                app_id: this.get('facebook_id') || '',
                img: '',
                url: this.get('fullUrl') || '',
                title: this.get('title') || '',
                description: this.get('description') || '',
                redirect_url: this.get('fullUrl') || ''
            };

            return this.buildURL('facebook', data);
        },

        getTwitterUrl: function(options) {
            var data = {
                via: this.get('twitter_account') || '',
                title: this.get('title'),
                url: this.get('url'),
                description: this.get('description')
            };

            return this.buildURL('twitter', data);
        },

        buildURL: function(serviceName, params) {
            var url = this.urls[serviceName];
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    url = url.replace('{' + key + '}', encodeURIComponent(params[key]));
                }
            }
            return url;
        }
    });

    return new SocialModel();
});