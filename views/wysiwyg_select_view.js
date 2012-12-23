/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */

SC.WYSIWYGSelectView = SC.PopupButtonView.extend({
	titleBinding: SC.Binding.transform(function(value) {
		value = SproutCoreWysiwyg.styles.findProperty('value', value);
		if (!value) {
			value = {
				title: "Paragraph"
			};
		}
		return value.title.replace(/<[^>]+>([^<]+)<[^>]+>/, '$1');
	}).oneWay('.parentView.controller.currentStyle'),

	layout: {
		width: 120,
		height: SC.Theme.find(SC.defaultTheme).buttonRenderDelegate[SC.REGULAR_CONTROL_SIZE].height
	},

	_instantiateMenu: function() {
		var menu = this.get('menu');
		if (!menu || !menu.isClass) return;
		this.menu = menu.create({
			button: this
		});
		this._setupMenu();
	},

	formatBlock: function(source) {
		this.command.set('argument', '<%@>'.fmt(source.selectedItem.value.toUpperCase()));
		var controller = this.getPath('parentView.controller');
		if (controller) controller.invokeCommand(this);
	},

	menu: SC.MenuPane.extend({
		layout: {
			width: SC.browser.isMac ? 240 : 260
		},
		menuHeightPadding: 0,
		items: function() {
			var button = this.button;
			return SproutCoreWysiwyg.styles.map(function(values) {
				return SC.Object.create(values, {
					target: button,
					shortcut: function() {
						var keyEquivalent = this.get('keyEquivalent');
						if (keyEquivalent) {
							if (SC.browser.isMac) {
								keyEquivalent = keyEquivalent.replace('ctrl_', '⌘');
								keyEquivalent = keyEquivalent.replace('shift_', '⇧');
								keyEquivalent = keyEquivalent.replace('alt_', '⌥');
							}
							else {
								keyEquivalent = keyEquivalent.replace('ctrl_', 'Ctrl+');
								keyEquivalent = keyEquivalent.replace('shift_', 'Shift+');
								keyEquivalent = keyEquivalent.replace('alt_', 'Alt+');
							}
						}
						return keyEquivalent;
					}.property()
				});
			});
		}.property().cacheable(),

		exampleView: SC.MenuItemView.extend({
			classNames: 'sc-wysiwyg-menu-item',
			escapeHTML: NO,
			render: function(context) {
				sc_super();
				context.addStyle({
					lineHeight: this.get('layout').height
				});
			}

		})
	})
});
