Hummingbird.StoryController = Ember.ObjectController.extend(Hummingbird.HasCurrentUser, {
  commentStory: Ember.computed.equal('model.type', 'comment'),
  mediaStory: Ember.computed.equal('model.type', 'media_story'),
  followedStory: Ember.computed.equal('model.type', 'followed'),
  knownStory: Ember.computed.any('commentStory', 'mediaStory', 'followedStory'),
  unknownStory: Ember.computed.not('knownStory'),
  substories: Ember.computed.any('allSubstories', 'model.substories'),
  selfPost: Hummingbird.computed.propertyEqual('model.poster.id', 'model.user.id'),
  moreThanTwoSubstories: Em.computed.gt('model.substoryCount', 2),
  isExpanded: false,
  overflowing: false,
  showMoreText: 'Show More',

  // Comment replies.
  showReplyForm: false,

  showAll: false,
  loadingAll: false,
  loadedAll: Hummingbird.computed.propertyEqual('substories.length', 'model.substoryCount'),

  belongsToUser: function () {
    var loggedInUser = this.get('currentUser');
    return loggedInUser.get('id') === this.get('model.poster.id') || loggedInUser.get('id') === this.get('model.user.id');
  }.property('model.poster'),

  canDeleteStory: function() {
    return this.get('belongsToUser') || this.get('currentUser.isAdmin');
  }.property('belongsToUser', 'currentUser.isAdmin'),

  mediaRoute: function () {
    if (this.get('mediaStory') && this.get('model.media').constructor.toString() === "Hummingbird.Anime") {
      return 'anime';
    }
  }.property('model.media'),


  displaySubstories: function () {
    var sorted = this.get('substories').sortBy('createdAt').reverse();
    if (sorted.length > 2 && !this.get('showAll')) {
      return sorted.slice(0, 2);
    } else {
      return sorted;
    }
  }.property('substories.@each', 'showAll'),

  actions: {
    toggleShowReplyForm: function() {
      this.toggleProperty('showReplyForm');
    },

    submitReply: function() {
      var self = this;
      this.store.find('user', this.get('currentUser.id')).then(function(user) {
        var reply = self.store.createRecord('substory', {
          story: self.get('model'),
          user: user,
          type: "reply",
          reply: self.get('reply'),
          createdAt: new Date()
        });
        reply.save();
        self.incrementProperty('substoryCount');
        self.get('model.substories').addObject(reply);
        self.set('reply', '');
      });
    },

    toggleShowAll: function () {
      var self = this;
      if (!this.get('loadedAll')) {
        if (!this.get('loadingAll')) {
          // Load all substories for this story.
          this.store.find('substory', {story_id: this.get('model.id')}).then(function(substories) {
            self.set('allSubstories', substories);
            self.set('loadingAll', false);
          });
        }
        this.set('loadingAll', true);
      }
      return this.set('showAll', !this.get('showAll'));
    },

    deleteStory: function() {
      this.get('model').destroyRecord();
    },

    deleteSubstory: function(substory) {
      var self = this;
      substory.destroyRecord().then(function() {
        self.get('model.substories').removeObject(substory);
        self.decrementProperty('substoryCount');
      });
    },

    toggleFullPost: function() {
      this.set('isExpanded', !this.get('isExpanded'));
      if(this.get('isExpanded'))
        this.set('showMoreText', 'Show Less');
      else
        this.set('showMoreText', 'Show More');
    }
  }
});
