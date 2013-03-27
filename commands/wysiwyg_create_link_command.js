/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
sc_require('commands/wysiwyg_command');
sc_require('commands/wysiwyg_picker_command_support');
sc_require('panes/wysiwyg_link_picker_pane');

/**
  @class
  
  Creates a with the current selection at the url entered by the user via the
  pickerPane
*/
SC.WYSIWYGCreateLinkCommand = SC.Object.extend(SC.WYSIWYGCommand, SC.WYSIWYGPickerCommandSupport, {

	commandName: 'link',

	url: '',

	linkText: '',

	title: 'Insert a link',

	keyEquivalent: 'ctrl_k',

	pickerPane: SC.WYSIWYGLinkPickerPane,

	execute: function(original, source, editor) {
		var sel = editor.getSelection(), node = sel.anchorNode, range = null;

		if (!node && sel.createRange) {
			range = sel.createRange();
			node = range.parentElement();
		}

		if (node && node.nodeType === Node.TEXT_NODE) {
			node = node.parentNode;
		}

		if (node && node.tagName === 'A') {
			this.set('url', node.href);
			this.set('linkText', node.text);
		}
		else {
			this.set('linkText', range ? range.text : sel.toString());
		}
		original(source, editor);
	}.enhance(),

	commitCommand: function(original, editor) {
		original(editor);
		var sel = editor.getSelection(), anchorNode = sel.anchorNode, linkText = this.get('linkText'), url = this.get('url');

		var parentNode;
		if (!anchorNode) {
			parentNode = sel.createRange().parentElement();
		}
		else {
			parentNode = anchorNode.parentNode;
		}

		if (url) {
			if (!url.match(/[^:]+:\/\//) && !url.match(/^mailto:/)) {
				url = "http://" + url;
			}

			// if we are dealing with an existing anchor
			// we need to replace it
			if (parentNode.tagName === 'A') {
				parentNode.target = "_blank";
				parentNode.textContent = linkText;
				parentNode.href = url;
				editor.notifyDomValueChange();
			}

			// this is selected text or nothing
			else {
				editor.insertHtmlAtCaret('<a href="%@" target="_blank" />%@</a>'.fmt(url, linkText));
			}
		}

		// we don't have a url so we probably either
		// canceled or need to unlink
		else {

			// Was a link, removing it now
			if (parentNode.tagName === 'A') {
				$(parentNode).before(parentNode.textContent);
				var parent = parentNode.parentNode;
				parent.removeChild(parentNode);
			}
		}
		this._reset();
	}.enhance(),

	cancelCommand: function(original, editor) {
		original(editor);
		this._reset();
	}.enhance(),

	_reset: function() {
		this.set('url', '');
		this.set('linkText', '');
	}

});
SC.WYSIWYGCommandFactory.registerCommand(SC.WYSIWYGCreateLinkCommand);
