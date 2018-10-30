import { config } from 'hyperagent/config';

export function Properties(response, options) {
  // XXX: This function is too large. Let's figure out if we could instead build
  // one large object for defineProperties first and call on that in the end
  // and if that would make the code cleaner.
  options = options || {};
  var data = response.data;
  if (Object(data) !== data) {
    throw new Error('The Properties argument must be an object.');
  }
  // Overwrite the data object with the original properties if provided.
  config._.defaults(data, options.original || {});

  var skipped = ['_links', '_embedded'];
  Object.keys(data).forEach(function (key) {
    if (!config._.contains(skipped, key)) {
      this[key] = data[key];
    }
  }.bind(this));

  // Set up curies
  var curies = options.curies;
  if (!curies) {
    return;
  }

  Object.keys(this).forEach(function (key) {
    if (curies.canExpand(key)) {
      Object.defineProperty(this, curies.expand(key), {
        enumerable: true,
        value: this[key]
      });
    }
  }.bind(this));
}
