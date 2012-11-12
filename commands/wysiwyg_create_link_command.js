// ==========================================================================
// Project:   SproutCore WYSIWYG
// Copyright: ©2012 Matygo Educational Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// /*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_command');
sc_require('commands/wysiwyg_picker_command_support');
sc_require('panes/wysiwyg_link_picker_pane');

/**
 * @class
 * 
 * Creates a with the current selection at the url entered by the user via the
 * pickerPane
 * 
 * TODO: Add support for changing the link
 */
SC.WYSIWYGCreateLinkCommand = SC.Object.extend(SC.WYSIWYGCommand, SC.WYSIWYGPickerCommandSupport, {

	commandName: 'link',

	url: '',

	toolTip: 'Insert a link',

	keyEquivalent: 'ctrl_l',

	pickerPane: SC.WYSIWYGLinkPickerPane,

	commitCommand: function(original, controller) {
		original(controller);
		controller.execCommand('createLink', false, this.get('url'));
	}.enhance()

});
SC.WYSIWYGCommandFactory.registerCommand(SC.WYSIWYGCreateLinkCommand);
