// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
/**
 * @class
 * 
 * Reopened to resolve a problem where the item height was not being passed
 * through to the items used for the menu
 * 
 */
SC.SelectView.reopen({

	/**
	 * render method
	 * 
	 * @private
	 */
	render: function(context, firstTime) {
		sc_super();

		var escapeHTML, layoutWidth, items, len, nameKey, iconKey, valueKey, separatorKey, showCheckbox, currentSelectedVal, shouldLocalize, isSeparator, itemList, isChecked, idx, name, icon, value, item, itemEnabled, isEnabledKey, emptyName, isSameRecord;

		items = this.get('items') || [];
		items = this.sortObjects(items);
		len = items.length;

		// Get the nameKey, iconKey and valueKey set by the user
		nameKey = this.get('itemTitleKey');
		iconKey = this.get('itemIconKey');
		valueKey = this.get('itemValueKey');
		separatorKey = this.get('itemSeparatorKey');
		showCheckbox = this.get('showCheckbox');
		isEnabledKey = this.get('itemIsEnabledKey');
		escapeHTML = this.get('escapeHTML');

		// get the current selected value
		currentSelectedVal = this.get('value');

		// get the localization flag.
		shouldLocalize = this.get('localize');

		// itemList array to set the menu items
		itemList = [];

		// to set the 'checkbox' property of menu items
		isChecked = YES;

		// index for finding the first item in the list
		idx = 0;

		// Add the empty name to the list if applicable
		emptyName = this.get('emptyName');

		if (!SC.none(emptyName)) {
			emptyName = shouldLocalize ? SC.String.loc(emptyName) : emptyName;
			emptyName = escapeHTML ? SC.RenderContext.escapeHTML(emptyName) : emptyName;

			item = SC.Object.create({
				separator: NO,
				title: emptyName,
				icon: null,
				value: null,
				isEnabled: YES,
				checkbox: NO,
				target: this,
				action: 'displaySelectedItem'
			});

			if (SC.none(currentSelectedVal)) {
				this.set('title', emptyName);
			}

			// Set the items in the itemList array
			itemList.push(item);
		}

		items.forEach(function(object) {
			if (object || object === 0) {

				// get the separator
				isSeparator = separatorKey ? (object.get ? object.get(separatorKey) : object[separatorKey]) : NO;

				if (!isSeparator) {
					// Get the name value. If value key is not specified convert
					// obj
					// to string
					name = nameKey ? (object.get ? object.get(nameKey) : object[nameKey]) : object.toString();

					// @if(debug)
					// Help the developer if they don't define a matching
					// itemTitleKey.
					if (!name) {
						SC.warn("Developer Warning: SC.SelectView: Every item, other than separator items, should have the '%@' property defined!".fmt(nameKey));
						name = '';
					}
					// @endif
					// localize name if specified.
					name = shouldLocalize ? SC.String.loc(name) : name;
					name = escapeHTML ? SC.RenderContext.escapeHTML(name) : name;

					// Get the icon value
					icon = iconKey ? (object.get ? object.get(iconKey) : object[iconKey]) : null;
					if (SC.none(object[iconKey])) icon = null;

					// get the value using the valueKey or the object
					value = valueKey ? (object.get ? object.get(valueKey) : object[valueKey]) : object;

					if (!SC.none(currentSelectedVal) && !SC.none(value)) {

						// If the objects in question are records, we should
						// just their storeKeys
						isSameRecord = false;
						if (SC.kindOf(currentSelectedVal, SC.Record) && SC.kindOf(value, SC.Record)) {
							isSameRecord = currentSelectedVal.get('storeKey') === value.get('storeKey');
						}

						if (currentSelectedVal === value || isSameRecord) {
							this.set('title', name);
							this.set('icon', icon);
						}
					}

					// Check if the item is currentSelectedItem or not
					if (value === this.get('value')) {

						// set the _itemIdx - To change the prefMatrix
						// accordingly.
						this.set('_itemIdx', idx);
						isChecked = !showCheckbox ? NO : YES;
					} else {
						isChecked = NO;
					}

					// Check if the item is enabled
					itemEnabled = (object.get ? object.get(isEnabledKey) : object[isEnabledKey]);
					if (NO !== itemEnabled) itemEnabled = YES;

					// Set the first non-separator selectable item from the list
					// as the
					// default selected item
					if (SC.none(this._defaultVal) && itemEnabled) {
						this._defaultVal = value;
						this._defaultTitle = name;
						this._defaultIcon = icon;
					}
				}

				item = SC.Object.create({
					separator: isSeparator,
					title: name,
					icon: icon,
					value: value,
					isEnabled: itemEnabled,
					checkbox: isChecked,
					target: this,
					action: 'displaySelectedItem',
					height: object.get('height')
				});

				// Set the items in the itemList array
				itemList.push(item);

			}

			idx += 1;

			this.set('_itemList', itemList);
		}, this);

		if (firstTime) {
			this.invokeLast(function() {
				var value = this.get('value');
				if (SC.none(value)) {
					if (SC.none(emptyName)) {
						this.set('value', this._defaultVal);
						this.set('title', this._defaultTitle);
						this.set('icon', this._defaultIcon);
					} else
						this.set('title', emptyName);
				}
			});
		}

		// Set the preference matrix for the menu pane
		this.changeSelectPreferMatrix(this.get("_itemIdx"));

	}

});
