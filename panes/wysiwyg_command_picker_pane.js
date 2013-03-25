/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */

SC.WYSIWYGPickerPane = SC.PickerPane.extend({
	pointerPos: 'perfectTop',

	editor: null,

	command: null,

	append: function() {
		sc_super();
		this.invokeLast(function() {
			this.get('contentView').becomeFirstResponder();
		});
	},

	cancel: function() {
		this.get('command').cancelCommand(this.get('editor'));
		this.remove();
	},

	ok: function() {
		this.get('command').commitCommand(this.get('editor'));
		this.remove();
	}
});
