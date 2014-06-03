/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/

/**
  @class
  
  Command responsible for undoing actions

  @extends SC.Object
*/
SC.WYSIWYGUndoCommand = SC.Object.extend(SC.WYSIWYGCommand, {
  commandName: 'undo',

  title: 'Undo',

  keyEquivalent: 'ctrl_z',

  exampleView: SC.WYSIWYGButtonView.extend({
    isEnabled: NO,
    
    editorStateDidChange: function() {
      var editor = this.get('editor');
      this.set('isEnabled', editor.undoManager.get('canUndo'));
    },
  }),

  execute: function(source, editor) {
    editor.undo();
  },

});
SC.WYSIWYGCommandFactory.registerCommand(SC.WYSIWYGUndoCommand);


/**
  @class
  
  Command responsible for redoing actions

  @extends SC.Object
*/
SC.WYSIWYGRedoCommand = SC.Object.extend(SC.WYSIWYGCommand, {
  commandName: 'redo',

  title: 'Redo',

  keyEquivalent: 'ctrl_shift_z',

  exampleView: SC.WYSIWYGButtonView.extend({
    isEnabled: NO,

    editorStateDidChange: function() {
      var editor = this.get('editor');
      this.set('isEnabled', editor.undoManager.get('canRedo'));
    },
  }),

  execute: function(source, editor) {
    editor.redo();
  },

});
SC.WYSIWYGCommandFactory.registerCommand(SC.WYSIWYGRedoCommand);
