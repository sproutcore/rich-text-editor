SC.TextFieldView.reopen({
	mouseDown: function(original, evt) {
		this.$().addClass('repaint');
		return original(evt);
	}.enhance(),

	mouseUp: function(original, evt) {
		this.$().removeClass('repaint');
		return original(evt);
	}.enhance(),

	keyUp: function(original, evt) {
		this.$().addClass('repaint');
		return original(evt);
	}.enhance(),

	keyDown: function(original, evt) {
		this.$().removeClass('repaint');
		return original(evt);
	}.enhance()
});