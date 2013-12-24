module.exports = {
  name: 'marketo',
  onContext: function() {
    return !!window.mktoMunchkin;
  }
};