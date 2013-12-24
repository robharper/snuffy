module.exports = {
  name: 'lodash',
  onContext: function() {
    // Lodash has _.support, underscore does not
    return window._ && window._.support && window._.VERSION;
  }
};
