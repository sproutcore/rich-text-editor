/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
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
	},

	toString: function() {
		return 'command: %@(%@)'.fmt(this.commandName, this.argument);
	}
});
