/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */
sc_require('panes/wysiwyg_command_picker_pane');

/**
  @mixin
  
  Support for a command to popup a SC.PickerPane
*/
SC.WYSIWYGPickerCommandSupport = {

	/**
	  Quack like a duck
	*/
	isWYSIWYGPickerCommandSupport: YES,

	/**
	  Wired up.
	  
	  @param {SC.View} source 
	  @param {SC.WYSIWYGEditorView} editor 
	*/
	execute: function(source, editor) {
		editor.saveSelection();
		this._popup(source, editor);
	},

	/**
	  Executed by dismissing the pane, should be enhanced to restore the text
	  selection before executing.
	  
	  @param {SC.WYSIWYGEditorView} editor 
	*/
	commitCommand: function(editor) {
		editor.restoreSavedSelection();
	},
	
	cancelCommand: function(editor) {
		editor.restoreSavedSelection();
	},

	/**
	  Pop up the panel
	  
	  @param {SC.View} anchor
	  @param {SC.WYSIWYGEditorView} editor
	*/
	_popup: function(anchor, editor) {
		var pickerPaneInstance = this._pickerPaneInstance;

		if (!pickerPaneInstance) {
			if (!this.pickerPane) throw new Error("Can't find pickerPane for the '%@' command.".fmt(this.commandName));
			pickerPaneInstance = this._pickerPaneInstance = this.pickerPane.create({
				command: this
			});
		}

		// This is needed in the case where there is several instances of the editor
		// because the commands and the command panes are singletons.
		// Note that binding with the editor property will have to be like this:
		// SC.Binding.from('.pane*editor.value')
		pickerPaneInstance.set('editor', editor);

		pickerPaneInstance.popup(anchor, SC.PICKER_POINTER, [ 2, 3, 0, 1, 2 ]);
	}
};
