// ==========================================================================
// Project:   SproutCore WYSIWYG
// Copyright: ©2012 Matygo Educational Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('panes/wysiwyg_command_picker_pane');
SC.WYSIWYGVideoPickerPane = SC.WYSIWYGPickerPane.extend({

	layout: {
		height: 40,
		width: 390
	},

	contentView: SC.View.extend({
		childViews: [ 'textArea', 'types' ],

		textArea: SC.TextFieldView.extend({
			hint: 'Video Url',

			valueBinding: '.parentView.parentView.command.url',

			layout: {
				top: 5,
				right: 120,
				bottom: 5,
				left: 5
			},
			insertNewline: function() {
				this.get('pane').remove();
			}
		}),

		types: SC.SegmentedView.extend({
			layout: {
				height: 28,
				centerY: 0,
				width: 110,
				right: 5
			},
			classNames: [ 'sc-wysiwyg-segmented' ],
			itemIconKey: 'icon',
			itemValueKey: 'value',
			itemsBinding: SC.Binding.transform(function(types) {
				return types.map(function(type) {
					return {
						title: type,
						value: type,
						icon: type
					};
				});
			}).oneWay('.parentView.parentView.command.types'),
			valueBinding: '.parentView.parentView.command.type'
		})
	})
});
