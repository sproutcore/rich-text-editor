// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_command');
sc_require('controllers/wysiwyg_controller');

SC.WYSIWYGBaseCommand = SC.Object.extend(SC.WYSIWYGCommand, {

	/**
	 * Quack like a duck
	 */
	isWYSIWYGBaseCommand: YES,

	/**
	 * @property {String} - Name of the command to be executed
	 */
	commandName: '',

	argument: null,

	/**
	 * Minimum interface for SC.WYSIWYGCommand
	 * 
	 * @param {SC.Control}
	 *            source - control that invoked this command
	 * @param {SC.WYSIWYGController}
	 *            controller - instance of the wysiwyg controller
	 */
	execute: function(source, controller) {
		controller.execCommand(this.get('commandName'), false, this.get('argument'));
	}
});
