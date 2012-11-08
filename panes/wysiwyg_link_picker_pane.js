// ==========================================================================
// Project:   SproutCore WYSIWYG 
// Copyright: C 2012 Matygo Education Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js) 
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('panes/wysiwyg_command_picker_pane');
SC.WYSIWYGLinkPickerPane = SC.WYSIWYGPickerPane.extend({

	layout: {
		height: 40,
		width: 260
	},

	contentView: SC.View.extend({
		childViews: [ 'textArea' ],

		textArea: SC.TextFieldView.extend({
			hint: 'Link Url',

			valueBinding: '.parentView.parentView.command.url',

			layout: {
				top: 5,
				right: 5,
				bottom: 5,
				left: 5
			},

			insertNewline: function() {
				this.get('pane').remove();
			}
		})
	})
});
