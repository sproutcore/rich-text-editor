// ==========================================================================
// Project:   SproutCore WYSIWYG
// Copyright: ©2012 Matygo Educational Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals SproutCoreWysiwyg */
// Framework:   SproutcoreWysiwyg
/**
 * @class
 * 
 * View class responsible for encapsulating the RTE editor built into modern
 * browsers.
 * 
 * https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
 * http://msdn.microsoft.com/en-us/library/ms536419(v=vs.85).aspx
 * https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html
 * 
 * @extends SC.View
 * @extends SC.Control
 * @author Joe Gaudet - joe@learndot.com
 */
SC.WYSIWYGEditorView = SC.View.extend(SC.Control,
/** @scope SC.WYSIWYGEditorView.prototype */
{

	isTextSelectable: YES,

	classNames: 'sc-wysiwyg-editor',

	render: function(context) {
		context.attr('contentEditable', true);
		context.addStyle('padding', this.get('documentPadding'));
	},

	/**
	 * Min height of the frame
	 */
	minHeight: 200,

	documentPadding: 20,

	/**
	 * Text to be entered on a carraige return
	 */
	carriageReturnText: '<p><br /></p>',

	/**
	 * Executes a command against the iFrame:
	 * 
	 * https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
	 * http://msdn.microsoft.com/en-us/library/ms536419(v=vs.85).aspx
	 * https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html
	 * 
	 * @param commandName
	 * @param showDefaultUI
	 * @param value
	 */
	execCommand: function(commandName, showDefaultUI, value) {
		var ret = document.execCommand(commandName, showDefaultUI, value);
		this._domValueDidChange();
		return ret;
	},

	/**
	 * Determines whether or not a commandHasBeen executed at the current
	 * selection.
	 * 
	 * @param commandName
	 * @returns {Boolean}
	 */
	queryCommandState: function(commandName) {
		return document.queryCommandState(commandName);
	},
	/**
	 * Determines whether or not a commandHasBeen executed at the current
	 * selection.
	 * 
	 * @param commandName
	 * @returns {Boolean}
	 */
	queryCommandValue: function(commandName) {
		// var document = this.get('document');
		// return this._iframeIsLoaded && document ?
		// document.queryCommandValue(commandName) : '';
		// return document.queryCommandValue(commandName);
	},

	/**
	 * Insert some html at the current caret position
	 * 
	 * @param html
	 *            {String} html to be inserted
	 */
	insertHtmlHtmlAtCaret: function(html) {
		var document = this.get('document'), window = this.get('window'), sel, range;
		if (document.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(), node = null, lastNode = null;
				while (node = el.firstChild) {
					lastNode = frag.appendChild(node);
				}
				range.insertNode(frag);

				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
				}

				this._domValueDidChange();
			}
		} else if (document.selection && document.selection.type != "Control") {
			document.selection.createRange().pasteHTML(html);
			this._domValueDidChange();
		}
	},

	/**
	 * Reformats
	 * 
	 * @param $element
	 * @param tagName
	 * @private
	 * @returns
	 */
	_formatElement: function($element, tagName) {
		var newElement = $('<' + tagName + '/>').append($element.clone().get(0).childNodes);
		$element.replaceWith(newElement);
		return newElement;
	},

	/**
	 * Selects the provided element in the views iFrame
	 * 
	 * @param $element
	 * @private
	 */
	_selectElement: function($element) {
		var contentWindow = this.get('window');
		if (contentWindow.getSelection) {
			var sel = contentWindow.getSelection();
			sel.removeAllRanges();
			var range = document.createRange();
			range.selectNodeContents($element[0]);
			sel.addRange(range);
		} else if (contentWindow.document.selection) {
			var textRange = contentWindow.document.body.createTextRange();
			textRange.moveToElementText($element[0]);
			textRange.select();
		}
	},

	_value: '',

	/**
	 * Whether or not the value has been changed by the editor
	 * 
	 * @property {Boolean}
	 * @private
	 */
	_changeByEditor: false,

	/**
	 * Syncronize the value with the dom.
	 */
	_valueDidChange: function() {
		var value = this.get('value');
		if (value && !this._changeByEditor) {
			var document = this.get('document');
			if (document) this.$(document.body).html(value);
		}
		this._updateFrameHeight();
		this._changeByEditor = false;
	}.observes('value'),

	/**
	 * @private notify the dom that values have been updated.
	 */
	_domValueDidChange: function() {
		// get the value from the inner document
		this._changeByEditor = true;
		this.set('value', this.$().html());
	},

	/**
	 * Recompute frame height based on the size of the content inside of the
	 * editor
	 */
	_updateFrameHeight: function() {
		var $body = this.$();
		var lastNode = $body.children().last();

		// if we've deleted all of those nodes. lets put the empty one
		// in
		if (lastNode.length === 0) {
			$body.html(this.get('carriageReturnText'));
			lastNode = $body.children().last();
			this._domValueDidChange();
		}

		var calcHeight = lastNode.position().top + lastNode.height() + this.get('documentPadding');
		this.adjust('height', Math.max(calcHeight, this.get('minHeight')));
	},

	/**
	 * On create of the layer we bind to the iframe load event so we can set up
	 * our editor
	 */
	didCreateLayer: function() {
		this.$().append(this.get('value') || this.get('carriageReturnText'));
	},

	saveSelection: function() {

	},

	keyUp: function(evt) {

		// we don't allow regular returns because they are
		// divs we want paragraphs
		if (evt.keyCode === SC.Event.KEY_RETURN) {
			if (this.queryCommandValue('formatBlock') === 'div') {
				this.execCommand('formatBlock', null, 'p');
			}
		}

		if (evt.keyCode === SC.Event.KEY_BACKSPACE) {
			first = this.$().children().first()[0];
			if (first && first.nodeName === "BR") {
				this.execCommand('insertParagraph', false, null);
			}
		}

		this._domValueDidChange();

		return YES;
	}

});
