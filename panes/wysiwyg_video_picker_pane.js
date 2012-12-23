/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */
sc_require('panes/wysiwyg_command_picker_pane');
SC.WYSIWYGVideoPickerPane = SC.WYSIWYGPickerPane.extend({

	layout: {
		height: 340,
		width: 440,
	},

	contentView: SC.View.extend({
		childViews: [ 'textArea', 'preview', 'ok', 'cancel' ],

		becomeFirstResponder: function() {
			this.get('textArea').becomeFirstResponder();
		},

		textArea: SC.TextFieldView.extend({
			hint: 'Video Url',

			valueBinding: '.pane.command.url',

			layout: {
				top: 5,
				right: 5,
				height: 40,
				left: 5
			}
		}),

		preview: SC.View.extend({
			layout: {
				top: 50,
				left: 5,
				right: 5,
				height: Math.round(430 / 1.778)
			},
			classNames: [ 'sc-wysiwyg-video-preview' ],
			urlBinding: SC.Binding.oneWay('.pane.command.url'),
			displayProperties: [ 'url' ],

			_previewText: '<p>Enter a URL from a supported provider and it will be embedded.</p><p>Supported Providers: </p><ul><li>Youtube</li><li>Vimeo</li><li>Wistia</li></ul>',

			update: function() {
				var preview = this.getPath('pane.command').preview(430);
				if (preview) {
					this.$().html(preview);
				} else {
					this.$().html(this._previewText);
				}
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
