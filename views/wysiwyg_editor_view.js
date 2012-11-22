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

	classNameBindings: [ 'shouldRepaint:repaint' ],

	classNames: 'sc-wysiwyg-editor',

	render: function(context) {
		context.attr('contentEditable', true);
		context.addStyle('padding', this.get('documentPadding'));
		context.push(this.get('carriageReturnText'));
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

	didCreateLayer: function() {
		SC.Event.add(this.$(), 'focus', this, this.focus);
		SC.Event.add(this.$(), 'paste', this, this.paste);
	},

	willDestroyLayer: function() {
		SC.Event.remove(this.$(), 'focus', this, this.focus);
		SC.Event.remove(this.$(), 'paste', this, this.paste);
	},

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
		this.invokeLast(function() {
			this._domValueDidChange();
			this._updateFrameHeight();
		});
		return document.execCommand(commandName, showDefaultUI, value);
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
		return document.queryCommandValue(commandName);
	},

	/**
	 * Insert some html at the current caret position
	 * 
	 * @param html
	 *            {String} html to be inserted
	 */
	insertHtmlHtmlAtCaret: function(html) {
		if (document.getSelection) {
			var sel = window.getSelection(), range;
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

			}
		} else if (document.selection && document.selection.type != "Control") {
			document.selection.createRange().pasteHTML(html);
		}

		this._domValueDidChange();
		this._updateFrameHeight();
	},

	paste: function(evt) {
		if (!SC.browser.isIE) {
			evt.preventDefault();
			var data = SC.browser.isIE ? window.clipboardData.getData('HTML') : event.clipboardData.getData('text/html');
			data = data.replace(/(font-family|font-size|line-height|background-color|color):[^;]+;/gi, '');
			this.insertHtmlHtmlAtCaret(data);
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
	_selectElement: function($element, collapse) {
		if (document.getSelection) {
			var sel = document.getSelection();
			sel.removeAllRanges();
			var range = document.createRange();
			range.selectNodeContents($element[0]);
			if (collapse != undefined) {
				range.collapse(collapse);
			}
			sel.addRange(range);
		} else if (document.selection) {
			var textRange = document.body.createTextRange();
			textRange.moveToElementText($element[0]);
			textRange.select();
			if (collapse != undefined) {
				textRange.collapse(collapse);
			}
		}
	},

	selectFirstChild: function(collapse) {
		this._selectElement(this.$().children().first(), collapse);
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
			this.$().html(value);
		}
		this._changeByEditor = false;
		this.invokeLast(function() {
			this._updateFrameHeight();
		});
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
		var lastNode = this.$().children().last();
		if (lastNode.length > 0) {
			var calcHeight = this.$().scrollTop() + lastNode.position().top + lastNode.height() + this.get('documentPadding');
			this.adjust('height', Math.max(calcHeight, this.get('minHeight')));
		}
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
			first = this.$().children()[0];
			if (!first || first && first.nodeName === "BR") {
				this.insertHtmlHtmlAtCaret(this.get('carriageReturnText'));
			}
		}
		this._domValueDidChange();

		return YES;
	},

	focus: function() {

	}

});