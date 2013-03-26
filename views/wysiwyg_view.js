/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */
sc_require('views/wysiwyg_editor_view');
sc_require('views/wysiwyg_toolbar_view');
// Framework: SproutcoreWysiwyg

/**
 * @class
 *
 *
 * @extends SC.View
 * @extends SC.Control
 * @author Joe Gaudet - joe@learndot.com
 */
SC.WYSIWYGView = SC.View.extend({

    classNames: 'sc-wysiwyg-view',

    commands: [ 'styles', 'separator', 'insertImage', 'embedVideo', 'link', 'separator', 'bold', 'italic', 'underline', 'separator', 'insertOrderedList', 'insertUnorderedList', 'separator', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'separator', 'indent', 'outdent' ],

    value: '',

    acceptsFirstResponder: YES,

    classNameBindings: [ 'isFirstResponder:focus' ],

    
    // ..........................................................
    // VIEWS
    //
    
    childViews: [ 'editor', 'toolbar' ],

    /**
     * The toolbar that will be used for this view.
     *
     * @property {SC.WYSIWYGToolbarView}
     */
    toolbar: SC.WYSIWYGToolbarView.extend({
        editor: SC.outlet('parentView.editor'),
        commandsBinding: SC.Binding.oneWay('.parentView.commands'),
        layout: { top: 0, right: 0, left: 0, height: 32, }
    }),

    /**
     * The editor view
     *
     * @property {SC.ScrollView}
     */
    editor: SC.WYSIWYGEditorView.extend({
        layoutBinding: SC.Binding.oneWay('.parentView.toolbar.frame').transform(function(frame) {
            return { top: frame.height, right: 0, bottom: 0, left: 0 };
        }),
        wysiwygView: SC.outlet('parentView'),
        valueBinding: '.wysiwygView.value',
    }),


    // ..........................................................
    // EVENTS
    //

    mouseDown: function (evt) {
        evt.allowDefault();
        this.editor.updateState();
        return YES;
    },

    mouseUp: function (evt) {
        evt.allowDefault();
        this.becomeFirstResponder();
        this.editor.updateState();
        return YES;
    },

    keyUp: function (evt) {
        var ret = this.editor.keyUp(evt);
        this.editor.updateState();
        return ret;
    },

    didBecomeKeyResponderFrom: function () {
        this.editor.$().focus();
    },

    willLoseFirstResponder: function () {
        this.editor.$().blur();
    },

    // TODO: Fix this up to be a bit more sane.
    keyDown: function (evt) {
        evt.allowDefault();
        var ret = this.interpretKeyEvents(evt) || this.performKeyEquivalent(evt.commandCodes()[0], evt);
        return ret;
    },

    insertNewline: function (evt) {
        return this.insertText(null, evt);
    },

    insertText: function (chr, evt) {
        evt.allowDefault();
        return YES;
    },

    insertTab: function (evt) {
        evt.preventDefault();
        var nextKeyView = this.get('nextValidKeyView');
        if (nextKeyView) {
            nextKeyView.becomeFirstResponder();
        }
        return YES;
    },
});
