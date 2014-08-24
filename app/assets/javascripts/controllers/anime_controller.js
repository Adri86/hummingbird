Hummingbird.AnimeController = Ember.ObjectController.extend(Hummingbird.HasCurrentUser, {
  needs: ['application'],

  isIndex: function() {
    return this.get('controllers.application.currentRouteName') === "anime.index";
  }.property('controllers.application.currentRouteName'),

  coverImageStyle: function() {
    return "background-image: url('" + this.get('model.coverImage') + "'); background-position: 50% -" + this.get('model.coverImageTopOffset') + "px;";
  }.property('model.coverImage', 'model.coverImageTopOffset'),

  roundedBayesianRating: function() {
    if (this.get('model.bayesianRating')) {
      return this.get('model.bayesianRating').toFixed(2);
    } else {
      return null;
    }
  }.property('model.bayesianRating'),

  libraryEntryExists: function() {
    return (!Ember.isNone(this.get('model.libraryEntry'))) && (!this.get('model.libraryEntry.isDeleted'));
  }.property('model.libraryEntry', 'model.libraryEntry.isDeleted'),

  recentlyStartedAiring: function() {
    if (this.get('model.airingStatus') === "Finished Airing") { return false; }
    // Used to hide "First Impressions" from long-term ongoing shows like
    // Naruto Shippuden. Checks if show started airing in past 10 weeks
    // (6048000000 ms)
    var startedAiring = this.get('model.startedAiring');
    return startedAiring && Date.now() - startedAiring < 6048000000;
  }.property('model.startedAiring'),

  activeTab: "Genres",
  language: null,

  showGenres: Ember.computed.equal('activeTab', 'Genres'),
  showFranchise: Ember.computed.equal('activeTab', 'Franchise'),
  showQuotes: Ember.computed.equal('activeTab', 'Quotes'),
  showStudios: Ember.computed.equal('activeTab', 'Studios'),
  showCast: Ember.computed.equal('activeTab', 'Cast'),

  filteredCast: function () {
    return this.get('model.featuredCastings').filterBy('language', this.get('language'));
  }.property('model.featuredCastings', 'language'),

  actions: {
    switchTo: function (newTab) {
      this.set('activeTab', newTab);
      if (newTab === "Franchise") {
        return this.get('model.franchise');
      }
    },
    setLanguage: function (language) {
      this.set('language', language);
      return this.send('switchTo', 'Cast');
    }
  },

  // Legacy
  fullQuotesURL: function () {
    return "/anime/" + this.get('model.id') + "/quotes";
  }.property('model.id'),
  // End Legacy
});
