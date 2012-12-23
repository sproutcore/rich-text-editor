/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */
sc_require('panes/wysiwyg_command_picker_pane');
SC.WYSIWYGImagePickerPane = SC.WYSIWYGPickerPane.extend({

	layout: {
		height: 40,
		width: 260
	},

	contentView: SC.View.extend({
		childViews: [ 'textArea' ],

		textArea: SC.TextFieldView.extend({
			hint: 'Image Url',

			valueBinding: '.parentView.parentView.command.url',

			layout: {
				top: 5,
				right: 5,
				bottom: 5,
				left: 5
			},
			insertNewline: function() {
				var pane = this.get('pane');
				pane.get('command').sizeImageFromURL(function() {
					pane.remove();
				});
			}
		})
	})
});
