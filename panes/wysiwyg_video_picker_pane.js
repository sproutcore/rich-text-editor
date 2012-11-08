// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('panes/wysiwyg_command_picker_pane');
SC.WYSIWYGVideoPickerPane = SC.WYSIWYGPickerPane.extend({

	layout: {
		height: 40,
		width: 350
	},

	contentView: SC.View.extend({
		childViews: [ 'textArea', 'types' ],

		textArea: SC.TextFieldView.extend({
			hint: 'Video Url',

			valueBinding: '.parentView.parentView.command.url',

			layout: {
				top: 5,
				right: 90,
				bottom: 5,
				left: 5
			},
			insertNewline: function() {
				this.get('pane').remove();
			}
		}),

		types: SC.SegmentedView.extend({
			layout: {
				height: 24,
				centerY: 0,
				width: 80,
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
