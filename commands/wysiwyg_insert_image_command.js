// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_command');
sc_require('commands/wysiwyg_picker_command_support');
sc_require('panes/wysiwyg_image_picker_pane');

/**
 * @class
 * 
 * Inserts an image at the current location
 * 
 * TODO: Support Image size
 */
SC.WYSIWYGInsertImageCommand = SC.Object.extend(SC.WYSIWYGCommand, SC.WYSIWYGPickerCommandSupport, {

	commandName: 'insertImage',

	/**
	 * @property {String} URL the image to be inserted
	 */
	url: '',

	pickerPane: SC.WYSIWYGImagePickerPane,

	commitCommand: function(controller) {
		controller.execCommand('insertImage', false, this.get('url'));
	}

});
SC.WYSIWYGCommandFactory.registerCommand(SC.WYSIWYGInsertImageCommand);
