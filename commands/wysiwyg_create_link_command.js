// ==========================================================================
// Project:   SproutCore WYSIWYG
// Copyright: ©2012 Matygo Educational Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// /*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_command');
sc_require('commands/wysiwyg_picker_command_support');
sc_require('panes/wysiwyg_link_picker_pane');

/**
 * @class
 * 
 * Creates a with the current selection at the url entered by the user via the
 * pickerPane
 * 
 * TODO: Add support for changing the link
 */
SC.WYSIWYGCreateLinkCommand = SC.Object.extend(SC.WYSIWYGCommand, SC.WYSIWYGPickerCommandSupport, {

	commandName: 'link',

	url: '',

	linkText: '',

	toolTip: 'Insert a link',

	keyEquivalent: 'ctrl_l',

	pickerPane: SC.WYSIWYGLinkPickerPane,

	execute: function(original, source, controller) {
		original(source, controller);
		var sel = controller.getSelection();
		var parentElement = sel.anchorNode.parentElement;

		// if we are dealing with an existing anchor
		// we need to replace it
		if (parentElement.tagName === 'A') {
			this.set('url', parentElement.href);
			this.set('linkText', parentElement.text);
		}

		// this is selected text or nothing
		else {
			this.set('linkText', sel.toString());
		}
	}.enhance(),

	commitCommand: function(original, controller) {
		original(controller);
		var sel = controller.getSelection(), parentElement = sel.anchorNode.parentElement, linkText = this.get('linkText'), url = this.get('url');
		if (url) {
			if (!url.match(/[^:]+:\/\//)) {
				url = "http://" + url;
			}

			// if we are dealing with an existing anchor
			// we need to replace it
			if (parentElement.tagName === 'A') {
				parentElement.target = "_blank";
				parentElement.textContent = linkText;
				parentElement.href = url;
			}

			// this is selected text or nothing
			else {
				controller.insertHtmlHtmlAtCaret('<a href="%@" target="_blank" />%@</a>'.fmt(url, linkText));
			}
		} else {
			
			// Was a link, removing it now
			if (parentElement.tagName === 'A') {
				$(parentElement).before(parentElement.textContent);
				var parent = parentElement.parentElement;
				parent.removeChild(parentElement);
			}
		}
		this._reset();
	}.enhance(),

	cancelCommand: function(original, controller) {
		original(controller);
		this._reset();
	}.enhance(),

	_reset: function() {
		this.set('url', '');
		this.set('linkText', '');
	}

});
SC.WYSIWYGCommandFactory.registerCommand(SC.WYSIWYGCreateLinkCommand);
