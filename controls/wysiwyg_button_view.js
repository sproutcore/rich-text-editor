/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */

SC.WYSIWYGButtonView = SC.ButtonView.extend({
  classNames: 'sc-wysiwyg-button',

  editorStateDidChange: function() {
    var command = this.command,
        editor = this.get('editor');

    this.set('isSelected', editor.queryCommandState(command.commandName));
  },
  action: 'invokeCommand',
});
