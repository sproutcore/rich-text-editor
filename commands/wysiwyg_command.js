// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('controllers/wysiwyg_controller');
/**
 * @class
 * 
 * A command object contains all of the information about a command including
 * how it is executed.
 * 
 * Required to implement execute: function(source, controller);
 * 
 * If you implement a class you are required to add it to the command factory
 * after your definition.
 * 
 * @extends SC.Object
 * @author Joe Gaudet - joe@learndot.com
 */
SC.WYSIWYGCommand = {

	/**
	 * Quack like a duck
	 */
	isWYSIWYGCommand: YES,

	/**
	 * @property {String} - Name of the command.
	 */
	commandName: '',

	/**
	 * @property {String} - class name for the icon that represents this
	 *           command.
	 */
	icon: function() {
		return this.get('commandName').dasherize();
	}.property().cacheable(),

	/**
	 * @property {String} - toolTip for this command, will be applied to the
	 *           control that invokes this command
	 */
	toolTip: function() {
		return this.get('commandName').titleize();
	}.property().cacheable(),

	/**
	 * @property {String} - key equivalent that will execute this command.
	 */
	keyEquivalent: '',

	/**
	 * The expected interface through which commands are called.
	 * 
	 * @param {SC.Control}
	 *            source - control that invoked this command
	 * @param {SC.WYSIWYGController}
	 *            controller - instance of the wysiwyg controller
	 */
	execute: function(source, controller) {
		SC.info('Override me for action');
	}
};
