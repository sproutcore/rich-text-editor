/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */

SC.WYSIWYGSelectView = SC.PopupButtonView.extend({
    titleBinding: SC.Binding.transform(function (value) {
        value = SproutCoreWysiwyg.styles.findProperty('value', value);
        if (!value) {
            value = {
                title: "Paragraph"
            };
        }
        return value.title.replace(/<[^>]+>([^<]+)<[^>]+>/, '$1');
    }).oneWay('.parentView.controller.currentStyle'),

    layout: {
        width: 120
    },

    _instantiateMenu: function () {
        var menu = this.get('menu');
        if (!menu || !menu.isClass) return;
        this.menu = menu.create({
            button: this
        });
        this._setupMenu();
    },

    formatBlock: function (source) {
        this.command.set('argument', '<%@>'.fmt(source.selectedItem.value.toUpperCase()));
        var controller = this.getPath('parentView.controller');
        if (controller) controller.invokeCommand(this);
    },

    menu: SC.MenuPane.extend({
        layout: {
            width: SC.browser.isMac ? 240 : 260
        },
        menuHeightPadding: 0,
        items: function () {
            var button = this.button;
            return SproutCoreWysiwyg.styles.map(function (values) {
                return SC.Object.create(values, {
                    target: button,
                    shortcut: function () {
                        return SproutCoreWysiwyg.beautifyShortcut(this.get('keyEquivalent'));
                    }.property()
                });
            });
        }.property().cacheable(),

        exampleView: SC.MenuItemView.extend({
            classNames: 'sc-wysiwyg-menu-item',
            escapeHTML: NO,
            render: function (context) {
                sc_super();
                context.addStyle({
                    lineHeight: this.get('layout').height + 'px'
                });
            }

        })
    })
});
