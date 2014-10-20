Hummingbird.UserIndexRoute = Ember.Route.extend(Hummingbird.Paginated, Hummingbird.ResetScroll, {
  fetchPage: function(page) {
    return this.store.find('story', {
      user_id: this.modelFor('user').get('id'),
      page: page
    });
  },

  setupController: function(controller, model) {
    controller.set('userInfo', this.store.find('userInfo', this.modelFor('user').get('id')));

    ic.ajax({
      url: '/api/v1/users/'+this.modelFor('user').get('id')+'/favorite_anime',
      type: 'GET'
    }).then(function(favoriteAnime) {
        controller.set('favorite_anime', favoriteAnime);
    });

    this.setCanLoadMore(true);
    controller.set('canLoadMore', true);
    controller.set('model', []);

    this.loadNextPage();
  },

  afterModel: function() {
    return Hummingbird.TitleManager.setTitle(this.modelFor('user').get('username') + "'s Profile");
  },

  actions: {
    postComment: function(comment) {
      var story = this.store.createRecord('story', {
        type: 'comment',
        poster: this.get('currentUser.model.content'),
        user: this.modelFor('user'),
        comment: comment
      });
      this.currentModel.unshiftObject(story);
      story.save();
    }
  }
});
