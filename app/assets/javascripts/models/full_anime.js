Hummingbird.FullAnime = Hummingbird.Anime.extend({
  alternateTitle: DS.attr('string'),
  coverImage: DS.attr('string'),
  coverImageTopOffset: DS.attr('number'),
  languages: DS.attr('array'),
  screencaps: DS.attr('array'),
  episodes: DS.hasMany('episode'),
  languages: DS.attr('array'),
  youtubeVideoId: DS.attr('string'),
  communityRatings: DS.attr('array'),
  bayesianRating: DS.attr('number'),
  producers: DS.hasMany('producer'),
  franchises: DS.hasMany('franchise', { async: true }),
  featuredQuotes: DS.hasMany('quote'),
  trendingReviews: DS.hasMany('review'),
  featuredCastings: DS.hasMany('casting'),

  hasTrailer: Em.computed.bool('youtubeVideoId'),

  episodeSortOrder: ['number'],
  sortedEpisodes: Em.computed.sort('episodes', 'episodeSortOrder')
});
