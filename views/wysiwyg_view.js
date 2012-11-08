// ==========================================================================
// Project:   SproutCore WYSIWYG 
// Copyright: C 2012 Matygo Education Incorporated operating as Learndot
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
SC.WYSIWYGView = SC.View.extend(SC.ContentValueSupport, {

	acceptsFirstResponder: YES,

	classNames: 'sc-wysiwyg-view',

	classNameBindings: [ 'isFirstResponder:focus' ],

	childViews: [ 'scrollView', 'toolbar' ],

	isTextSelectable: YES,

	value: '',

	commands: [ 'styles', 'insertImage', 'embedVideo', 'link', 'bold', 'italic', 'underline', 'insertOrderedList', 'insertUnorderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent' ],

	init: function() {
		sc_super();
		this.controller = this.controllerClass.create({
			commands: this.get('commands'),
			editor: this.get('editor')
		});

		// TODO: fix this up
		this.getPath('toolbar.viewDelegate').set('controlHeight', this.get('controlHeight'));

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
				var anchorNode = this.get('document').getSelection().anchorNode;
				if (anchorNode && anchorNode.parentNode) {
					var $node = SC.$(anchorNode.parentNode);
					var position = $node.position();
					this.getPath('parentView.parentView').scrollTo(0, position.top + $node.height());
				}
				return ret;
			},

			/**
			 * Override the default behavior of the editor grabbing focus and
			 * let the wysiwyg view manage it.
			 */
			focus: function(evt) {
				this.get('wysiwygView').focus(evt);
			},

			/**
			 * Override the default behavior of the editor grabbing focus
			 */
			blur: function(evt) {
				this.get('wysiwygView').blur(evt);
			}
		})
	}),

	// Event handlers

	mouseWheel: function(evt) {
		return NO;
	},

	mouseDown: function(evt) {
		evt.allowDefault();
		this.controller.updateState();
		return YES;
	},

	mouseUp: function(evt) {
		evt.allowDefault();
		this.controller.updateState();
		return this.get('editor').mouseUp(evt);
	},

	keyUp: function(evt) {
		var ret = this.get('editor').keyUp(evt);
		this.controller.updateState();
		return ret;
	},

	// TODO: Fix this up to be a bit more sane.
	keyDown: function(evt) {
		evt.allowDefault();
		this.controller.updateState();
		return evt.keyCode === SC.Event.KEY_RETURN;
	},

	focus: function(evt) {
		this.becomeFirstResponder();
		this.controller.updateState();
	},

	blur: function(evt) {
		this.controller.updateState();
	}

});
