// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('controllers/wysiwyg_controller');
sc_require('panes/wysiwyg_command_picker_pane');

/**
 * @mixin
 * 
 * Support for a command to popup a SC.PickerPane
 */
SC.WYSIWYGPickerCommandSupport = {

	/**
	 * Quack like a duck
	 */
	isWYSIWYGPickerCommandSupport: YES,

	/**
	 * @property {SC.WYSIWYGPickerPane} - the pane that is displayed.
	 */
	pickerPane: null,

	/**
	 * Wired up.
	 * 
	 * @param source
	 *            {SC.View}
	 * @param controller
	 *            {SC.WYSIWYGController}
	 */
	execute: function(source, controller) {
		this._popup(source, controller);
	},

	/**
	 * Executed by dismissing the pane
	 * 
	 * @param controller
	 *            {SC.WYSIWYGController}
	 */
	commitCommand: function(controller) {
		SC.info("Override me for custom behavior");
	},

	/**
	 * Pop up the panel
	 * 
	 * @param anchor
	 *            {SC.View}
	 * @param controller{SC.WYSIWYGController}
	 */
	_popup: function(anchor, controller) {
		if (this.pickerPane) this.pickerPane.create({
			controller: controller,
			command: this
		}).popup(anchor, SC.PICKER_POINTER, [ 2, 3, 0, 1, 2 ]);
	}
};
