// ==========================================================================
// Project:   SproutCore WYSIWYG 
// Copyright: C 2012 Matygo Education Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js) 
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
