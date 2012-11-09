// ==========================================================================
// Project:   SproutCore WYSIWYG 
// Copyright: C 2012 Matygo Education Incorporated operating as Learndot
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

	classNames: 'sc-wysiwyg-editor',

	tagName: 'iframe',

	/**
	 * bind the tag attributes to the the following properties
	 */
	attributeBindings: [ 'frameborder', 'width', 'height', 'scrolling' ],

	/**
	 * Cause it's ugly.
	 */
	frameborder: 0,

	/**
	 * @property {Number} used to map the width of the frame to the width of the
	 *           iframe keeping them consistent
	 */
	width: function() {
		return this.get('frame').width;
	}.property('frame').cacheable(),

	/**
	 * @property {Number} used to map the height of the frame to the width of
	 *           the iframe keeping them consistent
	 */
	height: function() {
		return this.get('frame').height;
	}.property('frame').cacheable(),

	scrolling: 'no',

	/**
	 * Min height of the frame
	 */
	minHeight: 200,

	/**
	 * Text to be entered on a carraige return
	 */
	carriageReturnText: '<p><br /></p>',

	/**
	 * Pointer to the window inside of the iFrame
	 */
	window: function() {
		if (!this._window) this._window = this.$()[0].contentWindow;
		return this._window;
	}.property(),

	/**
	 * Pointer to the document inside of the iFrame
	 */
	document: function() {
		if (!this._document) this._document = this.$()[0].contentDocument;
		return this._document;
	}.property(),

	$document: function() {
		if (!this._$document) this._$document = SC.$(this.get('document'));
	}.property(),

	$body: function() {
		var doc = this.get('document');
		if (!this._$body) this._$body = doc ? SC.$(doc.body) : null;
		return this._$body;
	}.property(),

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
		var ret = this.get('document').execCommand(commandName, showDefaultUI, value);
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
		var document = this.get('document');
		return document && document.queryCommandState(commandName);
	},
	/**
	 * Determines whether or not a commandHasBeen executed at the current
	 * selection.
	 * 
	 * @param commandName
	 * @returns {Boolean}
	 */
	queryCommandValue: function(commandName) {
		var document = this.get('document');
		return document && document.queryCommandValue(commandName);
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
		this.set('value', this.get('$body').html());
	},

	/**
	 * Recompute frame height based on the size of the content inside of the
	 * iFrame.
	 */
	_updateFrameHeight: function() {
		if (!this._iframeIsLoaded) return;
		var $body = this.get('$body');
		var lastNode = $body.children().last();
		// if we've deleted all of those nodes. lets put the empty one
		// in
		if (lastNode.length === 0) {
			$body.html(this.get('carriageReturnText'));
			lastNode = $body.children().last();
			this._domValueDidChange();
		}
		var calcHeight = lastNode.offset().top + lastNode.height();
		this.adjust('height', Math.max(calcHeight, this.get('minHeight')));
	},

	/**
	 * On create of the layer we bind to the iframe load event so we can set up
	 * our editor
	 */
	didCreateLayer: function() {
		SC.Event.add(this.$(), 'load', this, this._iframeDidLoad);
	},

	/**
	 * Clean up the load events
	 */
	willDestroyLayer: function() {
		SC.Event.remove(this.$(), 'load', this, this._iframeDidLoad);
		this._teardownEvents();
	},

	/**
	 * We need to attach the iFrame to the RootResponder for maximum SC
	 * compatibility sexiness
	 * 
	 * @private
	 */
	_setupEvents: function() {
		// handle basic events
		var window = this.get('window');

		var responder = SC.RootResponder.responder;

		// TODO: remove these to prevent memory leaks
		responder.listenFor([ 'keydown', 'keyup', 'beforedeactivate', 'mousedown', 'mouseup', 'click', 'dblclick', 'mousemove', 'selectstart', 'contextmenu' ], window);

		SC.Event.add(window, 'mousedown', this, this.mouseDown);

		// focus wire up the focus
		if (SC.browser.isIE8OrLower) {
			SC.Event.add(window, 'focusin', this, this.focus);
			SC.Event.add(window, 'focusin', this, this.blur);
		} else {
			SC.Event.add(window, 'focus', this, this.focus);
			SC.Event.add(window, 'blur', this, this.blur);
		}
	},

	/**
	 * Tear down the events that we added at init
	 * 
	 * @private
	 */
	_teardownEvents: function() {
		var window = this.get('window');

		SC.Event.add(window, 'remove', this, this.mouseDown);

		// focus wire up the focus
		if (SC.browser.isIE8OrLower) {
			SC.Event.remove(window, 'focusin', this, this.focus);
			SC.Event.remove(window, 'focusin', this, this.blur);
		} else {
			SC.Event.remove(window, 'focus', this, this.focus);
			SC.Event.remove(window, 'blur', this, this.blur);
		}
	},

	/**
	 * Called once the internal iframe has loaded, sets the document to editor
	 * mode.
	 * 
	 * @private
	 * @param evt
	 */
	_iframeDidLoad: function(evt) {
		var doc = this.get('document');
		if (!doc) return;
		docu = doc;
		doc.designMode = "on";
		doc.execCommand("styleWithCSS", true, null);

		// find the style sheet for this frame, and mess
		// with it.
		var sheets = document.styleSheets;
		for ( var i = 0; i < sheets.length; i++) {
			var sheet = sheets[i];
			if (sheet.href && sheet.href.match(/wysiwyg/)) {
				var cssLink = doc.createElement("link");
				cssLink.href = sheet.href;
				cssLink.rel = "stylesheet";
				cssLink.type = "text/css";
				doc.head.appendChild(cssLink);
				doc.body.className = "sc-wysiwyg";
				break;
			}
		}

		// load the intial value and select the first shild
		var $body = this.$(doc.body);
		$body.append(this.get('value') || this.get('carriageReturnText'));
		// this._selectElement($body.children().first());

		this._setupEvents();

		this._iframeIsLoaded = true;
	},

	/**
	 * We still need to listen to the mouseDown event and focus this window in
	 * the case that editor is clicked before the window has first responder.
	 * 
	 * @param evt
	 * @returns
	 */
	mouseDown: function(evt) {
		if (!this.get('document').hasFocus()) {
			$(this.$(this.get('document').body)).focus();
			this._updateFrameHeight();
		}
		return YES;
	},

	keyUp: function(evt) {

		// we don't allow regular returns because they are
		// divs we want paragraphs
		if (evt.keyCode === SC.Event.KEY_RETURN) {
			if (this.queryCommandValue('formatBlock') === 'div') {
				this.execCommand('formatBlock', null, 'p');
			}
		}

		this._domValueDidChange();

		return YES;
	},

	keyDown: function(evt) {
		evt.allowDefault();
		return YES;
	}

});
