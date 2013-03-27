/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
sc_require('delegates/wysiwyg_toolbar_view_delegate');

SC.WYSIWYGToolbarView = SC.ToolbarView.extend(SC.WYSIWYGToolbarViewDelegate, SC.FlowedLayout, {

  classNames: 'sc-wysiwyg-toolbar',

  editor: null,

  commands: null,

  flowPadding: {
    top: 0,
    left: 0,
    right: 4,
    bottom: 4
  },

  defaultFlowSpacing: {
    top: 4,
    left: 4
  },

  calculatedHeightDidChange: function () {
    this.adjust('height', this.get('calculatedHeight'));
  }.observes('calculatedHeight'),

  anchorLocation: SC.ANCHOR_TOP,

  commandsDidChange: function () {
    var commands = this.get('commands');
    for (var i = 0; i < commands.length; i++) {
      var view = this.invokeDelegateMethod(this.get('viewDelegate'), 'toolbarViewCreateControlForCommandNamed', this, commands[i]);
      if (view) {
        this.childViews.push(view);
        this.appendChild(view);
      }
    }
  }.observes('commands'),

  delegate: null,

  viewDelegate: function () {
    return this.delegateFor('isWYSIWYGToolbarViewDelegate', this.get('delegate'));
  }.property('delegate')

});
