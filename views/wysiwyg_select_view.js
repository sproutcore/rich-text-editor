// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
SC.WYSIWYGSelectView = SC.SelectView.extend({

	/**
	 * Prevent this field from stealing focus from the toolber
	 */
	acceptsFirstResponder: NO,

	isDefaultPosition: YES,

	layout: {
		width: 120
	},

	itemTitleKey: 'title',
	itemValueKey: 'value',

	items: SproutCoreWysiwyg.styles.map(function(values) {
		return SC.Object.create(values);
	}),

	escapeHTML: NO,

	currentStyleBinding: SC.Binding.oneWay('.parentView.controller.currentStyle'),
	currenStyleDidChange: function() {
		this._ignoreChange = true;
		this.set('value', this.get('currentStyle'));
	}.observes('currentStyle'),

	valueDidChange: function() {
		var value = this.get('value');
		if (value && !this._ignoreChange) {
			this.command.set('argument', '<%@>'.fmt(value.toUpperCase()));
			var controller = this.getPath('parentView.controller');
			if (controller) controller.invokeCommand(this);
		}
		this._ignoreChange = false;
	}.observes('value'),

	exampleView: SC.MenuItemView.extend({
		escapeHTML: NO,
		classNames: 'sc-wysiwyg-menu-item'
	}),

	_action: function() {
		sc_super();
		this.menu.adjust('width', 190);
	}
});
