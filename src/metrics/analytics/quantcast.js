module.exports = {
  name: 'quantcast',
  onContext: function() {
    return !!window.__qc;
  }
};
