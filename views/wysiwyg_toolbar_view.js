/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
sc_require('delegates/wysiwyg_toolbar_view_delegate');

SC.WYSIWYGToolbarView = SC.ToolbarView.extend(SC.WYSIWYGToolbarViewDelegate, SC.FlowedLayout, {

  classNames: 'sc-wysiwyg-toolbar',

  /**
    delegate for controlling the toolbar command creation.

    @type SC.WYSIWYGToolbarViewDelegate
    @default null
  */
  delegate: null,

  flowPadding: { top: 0, left: 0, right: 4, bottom: 4 },

  defaultFlowSpacing: { top: 4, left: 4 },

  /**
    Only SC.ANCHOR_TOP is handle by SC.WYSIWYGView.

    @type Object
  */
  anchorLocation: SC.ANCHOR_TOP,

  /**
    The commands to display in the toolbar.
    This property is set by SC.WYSIWYGView at initialization.

    @type Array
  */
  commands: null,

  /**
    The editor instance.
    This property is set by SC.WYSIWYGView at initialization

    @readOnly
    @property {SC.WYSIWYGEditorView}
  */
  editor: null,

  calculatedHeightDidChange: function () {
    this.adjust('height', this.get('calculatedHeight'));
  }.observes('calculatedHeight'),

  commandsDidChange: function () {
    var commands = this.get('commands');
    for (var i = 0; i < commands.length; i++) {
      var view = this.invokeDelegateMethod(this.get('viewDelegate'), 'toolbarViewCreateControlForCommandNamed', this, commands[i]);
      if (view) {
        this.appendChild(view);
      }
    }
  }.observes('commands'),

  viewDelegate: function () {
    return this.delegateFor('isWYSIWYGToolbarViewDelegate', this.get('delegate'));
  }.property('delegate')

});
