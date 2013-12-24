module.exports = {
  name: 'doubleclick',
  matcher: /doubleclick.(com|net)/,
  onResource: function(response, memo) {
    return memo || (response.stage === 'end' && response.url && !!this.matcher.exec(response.url));
  }
};