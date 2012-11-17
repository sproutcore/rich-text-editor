// ==========================================================================
// Project:   SproutCore WYSIWYG
// Copyright: ©2012 Matygo Educational Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('controllers/wysiwyg_controller');
sc_require('views/wysiwyg_editor_view');
sc_require('views/wysiwyg_toolbar_view');
// Framework: SproutcoreWysiwyg

/**
 * @class
 * 
 * 
 * @extends SC.View
 * @extends SC.Control
 * @author Joe Gaudet - joe@learndot.com
 */
SC.WYSIWYGView = SC.View.extend(SC.ContentValueSupport, SC.Control, {

	contentKeys: {
		contentValueKey: 'value',
		contentErrorKey: 'error',
		contentIsInErrorKey: 'isInError'
	},

	acceptsFirstResponder: YES,

	classNames: 'sc-wysiwyg-view',

	classNameBindings: [ 'isFirstResponder:focus' ],

	childViews: [ 'scrollView', 'toolbar' ],

	isTextSelectable: YES,

	value: '',

	shouldRepaint: NO,

	commands: [ 'styles', 'insertImage', 'embedVideo', 'link', 'bold', 'italic', 'underline', 'insertOrderedList', 'insertUnorderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent' ],

	init: function() {
		sc_super();
		this.controller = this.controllerClass.create({
			wysiwygView: this,
			commands: this.get('commands'),
			editor: this.get('editor')
		});

		// TODO: fix this up
		var toolbarHeight = this.get('toolbarHeight');
		this.get('toolbar').adjust('height', toolbarHeight);
		this.get('scrollView').adjust('top', toolbarHeight);

	},

	controllerClass: SC.WYSIWYGController,
	controller: null,

	// -------- Views

	/**
	 * 
	 * Pointer to the editorView, which is set to the contentView of the
	 * ScrollPane
	 * 
	 * @property {SC.WYSIWYGEditorView}
	 */
	editor: SC.outlet('scrollView.contentView'),

	/**
	 * The toolbar that will be used for this view.
	 * 
	 * @property {SC.WYSIWYGToolbarView}
	 */
	toolbar: SC.WYSIWYGToolbarView.extend({
		controller: SC.outlet('parentView.controller')
	}),

	/**
	 * Container for the editor view
	 * 
	 * @property {SC.ScrollView}
	 */
	scrollView: SC.ScrollView.extend({

		layout: {
			top: 32,
			right: 0,
			bottom: 0,
			left: 0
		},

		containerView: SC.ContainerView.extend({

			didCreateLayer: function() {
				SC.Event.add(this.$(), 'scroll', this, this.scroll);
			},

			willDestroyLayer: function() {
				SC.Event.remove(this.$(), 'scroll', this, this.scroll);
			},

			// syncronizing scrolling
			scroll: function(evt) {
				var $this = this.$();
				this.get('parentView').scrollTo($this.scrollLeft(), $this.scrollTop());
				return YES;
			}

		}),

		contentView: SC.WYSIWYGEditorView.extend({

			wysiwygView: SC.outlet('parentView.parentView.parentView'),

			valueBinding: '.wysiwygView.value',

			minHeightBinding: SC.Binding.transform(function(frame) {
				return frame ? frame.height : 0;
			}).oneWay('.parentView.parentView.frame'),

			/**
			 * Extended to support scrolling of the resized frame
			 */
			keyUp: function(evt) {
				var ret = sc_super();
				return ret;
			},

			mouseUp: function(evt) {
				return this.get('wysiwygView').mouseUp(evt);
			},

			mouseDown: function(evt) {
				return this.get('wysiwygView').mouseDown(evt);
			},

			focus: function(evt) {
				this.get('wysiwygView').becomeFirstResponder();
				this._updateFrameHeight();
			},

			didCreateLayer: function() {
				SC.Event.add(this.$(), 'focus', this, this.focus);
			},

			willDestroyLayer: function() {
				SC.Event.remove(this.$(), 'focus', this, this.focus);
			}
		}),

		mouseWheel: function(evt) {
			sc_super();
			return YES;
		},
	}),

	// Event handlers
	mouseDown: function(evt) {
		this.rePaint();
		evt.allowDefault();
		this.controller.updateState();
		return YES;
	},

	mouseUp: function(evt) {
		this.rePaint();
		evt.allowDefault();
		this.becomeFirstResponder();
		this.controller.updateState();
		return YES;
	},

	keyUp: function(evt) {
		this.rePaint();
		var ret = this.get('editor').keyUp(evt);
		this.controller.updateState();
		return ret;
	},

	didBecomeKeyResponderFrom: function() {
		this.get('editor').selectFirstChild(true);
	},

	// TODO: Fix this up to be a bit more sane.
	keyDown: function(evt) {
		this.rePaint();
		this.controller.updateState();
		return this.interpretKeyEvents(evt) || NO;
	},

	insertNewline: function(evt) {
		return this.insertText(null, evt);
	},

	insertText: function(chr, evt) {
		evt.allowDefault();
		return YES;
	},

	insertTab: function(evt) {
		evt.preventDefault();
		this.get('editor').insertHtmlHtmlAtCaret('<span class="tab"></span>');
		return YES;
	},

	rePaint: function() {
		this.get('editor').toggleProperty('shouldRepaint');
		this.invokeLater(function() {
			this.get('editor').toggleProperty('shouldRepaint');
		});
	}
});
