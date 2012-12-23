/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */

/**
 * @class
 * 
 * Provides a facade for binding to properties and interacting with the editor
 * window.
 */
SC.WYSIWYGController = SC.Object.extend({

	commands: [],

	editor: null,

	recomputeEditorState: NO,

	init: function() {
		sc_super();
		controller = this;
	},

	updateState: function() {
		this.invokeLast(function() {
			this.toggleProperty('recomputeEditorState');
		});
	},

	isBold: function() {
		return this.queryCommandState('bold');
	}.property('recomputeEditorState'),

	isItalic: function() {
		return this.queryCommandState('italic');
	}.property('recomputeEditorState'),

	isUnderline: function() {
		return this.queryCommandState('underline');
	}.property('recomputeEditorState'),

	isJustifyLeft: function() {
		return this.queryCommandState('justifyLeft');
	}.property('recomputeEditorState'),

	isJustifyCenter: function() {
		return this.queryCommandState('justifyCenter');
	}.property('recomputeEditorState'),

	isJustifyRight: function() {
		return this.queryCommandState('justifyRight');
	}.property('recomputeEditorState'),

	isJustifyFull: function() {
		return this.queryCommandState('justifyFull');
	}.property('recomputeEditorState'),

	currentStyle: function() {
		var style = this.queryCommandValue('formatBlock') || 'p';
		// because IE is stupid;
		if (style === 'Normal') {
			style = "p";
		}
		else if (style.indexOf('Heading') != -1) {
			style = style.replace('Heading ', 'h');
		}
		return style;
	}.property('recomputeEditorState'),

	queryCommandState: function(command) {
		return this.get('editor').queryCommandState(command);
	},

	queryCommandValue: function(command) {
		return this.get('editor').queryCommandValue(command);
	},

	execCommand: function(commandName, showDefaultUI, value) {
		this.get('editor').execCommand(commandName, showDefaultUI, value);
	},

	formatBlock: function(format) {
		this.execCommand('formatBlock', null, format.value);
	},

	notifyDomValueChange: function() {
		this.get('editor')._domValueDidChange();
	},

	insertHtmlHtmlAtCaret: function(html) {
		this.get('editor').insertHtmlHtmlAtCaret(html);
	},

	invokeCommand: function(source) {
		this.get('editor').focus();
		var command = source.get('command');
		if (command) {
			command.execute(source, this);
		}
		this.notifyPropertyChange('recomputeEditorState');
	},

	recomputeDocumentHeight: function() {
		this.get('editor').updateFrameHeight();
	},

	saveSelection: function() {
		return this.get('editor').saveSelection();
	},

	restoreSavedSelection: function(range) {
		this.get('editor').restoreSavedSelection(range);
	},

	getSelection: function() {
		return this.get('editor').getSelection();
	}

});
