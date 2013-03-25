/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */

SC.WYSIWYGSelectView = SC.PopupButtonView.extend({
    title: null,

    editorStateDidChange: function() {
        var currentStyle = this.currentEditorStyle(),
            value = SproutCoreWysiwyg.styles.findProperty('value', currentStyle);

        if (!value) value = { title: "Paragraph" };
            
        var title = value.title.replace(/<[^>]+>([^<]+)<[^>]+>/, '$1');

        this.set('title', title);
    },

    currentEditorStyle: function () {
        var editor = this.get('editor'),
            style = editor.queryCommandValue('formatBlock') || 'p';
        // because IE is stupid;
        if (style === 'Normal') {
            style = "p";
        }
        else if (style.indexOf('Heading') !== -1) {
            style = style.replace('Heading ', 'h');
        }
        return style;
    },

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
        var toolbar = this.get('parentView');
        if (toolbar) toolbar.invokeCommand(this);
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