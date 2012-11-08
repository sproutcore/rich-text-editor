// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
SC.WYSIWYGPickerPane = SC.PickerPane.extend({
	pointerPos: 'perfectTop',

	controller: null,

	command: null,

	remove: function() {
		sc_super();
		this.get('command').commitCommand(this.get('controller'));
	}
});
