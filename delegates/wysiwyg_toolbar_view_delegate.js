// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('views/wysiwyg_select_view');

/**
 * @class
 * 
 * Responsible for creating toolbar controls for command objects
 */
SC.WYSIWYGToolbarViewDelegate = {

	isWYSIWYGToolbarViewDelegate: YES,

	controlHeight: 24,

	controller: null,

	toolbarViewCreateControlForCommandNamed: function(toolbarView, commandName) {
		var command = SC.WYSIWYGCommandFactory.commandFor(commandName);
		var controlView = command ? this.toolbarViewButtonForCommand(toolbarView, commandName, command) : this[commandName];
		if (controlView) {
			controlView = this[commandName] = toolbarView.createChildView(controlView);
			controlView.adjust('height', this.get('controlHeight'));
		} else {
			SC.error('WYSIWYGToolbarViewDelegate: Could not createView: ' + commandName + ' no class was found.');
		}
		return controlView;
	},

	toolbarViewButtonForCommand: function(toolbarView, key, command) {
		var buttonClass = this[key];
		if (buttonClass) {
			buttonClass = buttonClass.extend({
				command: command
			});
		} else {
			buttonClass = this.get('exampleView').extend({
				layout: {
					width: 30
				},
				icon: command.get('icon'),
				command: command,
				toolTip: command.get('toolTip'),
				action: 'invokeCommand',
				target: this,
				keyEquivalent: command.get('keyEquivalent'),
				isSelectedBinding: SC.Binding.oneWay('.parentView.controller.is' + command.commandName.classify())
			});
		}
		return buttonClass;
	},

	invokeCommand: function(source) {
		this.get('controller').invokeCommand(source);
	},

	/**
	 * @property {SC.WYSIWYGSelectView} default control for handling paragraph
	 *           styles (p, h1, h2 etc)
	 */
	styles: SC.WYSIWYGSelectView,

	/**
	 * @property {SC.ButtonView) default control for handling commands.
	 */
	exampleView: SC.ButtonView
};
