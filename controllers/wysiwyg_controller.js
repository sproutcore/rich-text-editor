// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
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
		var style = this.queryCommandValue('formatBlock');
		return style ? style : 'p';
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

	insertHtmlHtmlAtCaret: function(html) {
		this.get('editor').insertHtmlHtmlAtCaret(html);
	},

	// commands
	invokeCommand: function(source) {
		var command = source.get('command');
		if (command) {
			command.execute(source, this);
		}
		this.notifyPropertyChange('recomputeEditorState');
	}

});
