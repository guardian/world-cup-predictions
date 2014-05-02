define(['backbone'], function (Backbone) {
    return Backbone.View.extend({
        tagName: 'li',
        template: _.template('<div><img src="../client/images/<%= alphaCode %>.png"><%= alphaTeam %> vs <%= betaTeam %><img src="../client/images/<%= betaCode %>.png"></div>'),

        render: function() {
        	$(this.el).html(this.template(this.model.toJSON()));
        	return this;
        }

    });
});