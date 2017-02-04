/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
sc_require('delegates/wysiwyg_toolbar_view_delegate');

/**@class
  Set the `editor` property to the associated instance of SC.WYSIWYGEditorView. Set the
  `commands` property to a list of supported commands (see SC.WYSIWYGCommandFactory for
  examples).

  Buttons are generated automatically from the commands list, and laid out by the
  SC.FlowedLayout mixin. You can control the details of this with the `flowPadding` and
  `defaultFlowSpacing` properties.

  @extends SC.ToolbarView
  @extends SC.FlowedLayout
  @extends SC.WYSIWYGToolbarViewDelegate
*/

SC.WYSIWYGToolbarView = SC.ToolbarView.extend(SC.WYSIWYGToolbarViewDelegate, SC.FlowedLayout, {

  // Prevent the icons of the toolbar from being paste on the left
  layout: { left: 0, right: 0, height: 26, zIndex: 10 },
  /**
    The commands to display in the toolbar. You may update this list at any time.

    @type Array
    @default null
  */
  commands: null,

  /**
    The editor instance at which this toolbar should target its commands. (Note that you may
    not change this property's value after create time.)

    @property {SC.WYSIWYGEditorView}
  */
  editor: null,

  /**
    Delegate for controlling the toolbar command creation.

    @type SC.WYSIWYGToolbarViewDelegate
    @default null
  */
  delegate: null,

  /**
    @see SC.FlowedLayout
  */
  flowPadding: { top: 0, left: 0, right: 4, bottom: 4 },

  /**
    @see SC.FlowedLayout
  */
  defaultFlowSpacing: { top: 4, left: 4 },

  /** @private */
  classNames: ['sc-wysiwyg-toolbar'],

  /** @private */
  commandsDidChange: function () {
    // This mayRender thing prevent a first execution because of _iviwDidChange
    // while isVisibleInWindow is not coherent 
    this._mayRender = true;
    if (!this.get('isVisibleInWindow')) return;

    var commands = this.get('commands') || SC.EMPTY_ARRAY;
    if (this._lastCommands === commands) return;
    this._lastCommands = commands;

    this.removeAllChildren(); // TODO: Fix this blunt instrument.

    for (var i = 0, len = commands.length; i < len; i++) {
      var view = this.invokeDelegateMethod(this.get('viewDelegate'), 'toolbarViewCreateControlForCommandNamed', this, commands[i]);
      if (view) {
        this.appendChild(view);
      }
    }
  }.observes('commands'),

  _iviwDidChange: function () {
    if (this.get('isVisibleInWindow') && this._mayRender) this.commandsDidChange();
  }.observes('isVisibleInWindow'),

  /** @private */
  viewDelegate: function () {
    return this.delegateFor('isWYSIWYGToolbarViewDelegate', this.get('delegate'));
  }.property('delegate')

});
