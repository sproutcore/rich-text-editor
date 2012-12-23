/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/

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