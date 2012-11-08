// ==========================================================================
// Project:   SproutCore WYSIWYG
// Copyright: ©2012 Matygo Educational Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js)
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
