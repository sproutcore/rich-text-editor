// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
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
