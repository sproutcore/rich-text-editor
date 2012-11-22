// ==========================================================================
// Project:   SproutCore WYSIWYG
// Copyright: ©2012 Matygo Educational Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('panes/wysiwyg_command_picker_pane');
SC.WYSIWYGLinkPickerPane = SC.WYSIWYGPickerPane.extend({

	layout: {
		height: 104,
		width: 260
	},

	contentView: SC.View.extend({
		childViews: [ 'linkText', 'url', 'ok', 'cancel' ],

		becomeFirstResponder: function() {
			this.get('linkText').becomeFirstResponder();
		},

		linkText: SC.TextFieldView.extend({
			hint: 'Link Text',
			valueBinding: '.pane.command.linkText',
			layout: {
				top: 5,
				left: 5,
				right: 5,
				height: 28,
			}
		}),

		url: SC.TextFieldView.extend({
			hint: 'Link Url',
			valueBinding: '.pane.command.url',
			layout: {
				top: 38,
				left: 5,
				right: 5,
				height: 28,
			}
		}),

		ok: SC.ButtonView.extend(SC.AutoResize, {
			layout: {
				bottom: 5,
				left: 5,
				height: 28
			},
			title: 'Ok',
			isDefault: YES,
			action: 'ok',
			target: SC.outlet('pane')
		}),

		cancel: SC.ButtonView.extend(SC.AutoResize, {
			layout: {
				bottom: 5,
				right: 5,
				height: 28
			},
			title: 'Cancel',
			action: 'cancel',
			target: SC.outlet('pane')
		})
	})
});
