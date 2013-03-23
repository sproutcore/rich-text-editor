/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */
sc_require('controllers/wysiwyg_controller');
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
SC.WYSIWYGView = SC.View.extend(SC.ContentValueSupport, SC.Control, SC.InlineEditor, {

    contentKeys: {
        contentValueKey: 'value',
        contentErrorKey: 'error',
        contentIsInErrorKey: 'isInError'
    },

    acceptsFirstResponder: YES,

    classNames: 'sc-wysiwyg-view',

    classNameBindings: [ 'isFirstResponder:focus' ],

    childViews: [ 'scrollView', 'toolbar' ],

    isTextSelectable: YES,

    value: '',

    shouldRepaint: NO,

    commands: [ 'styles', 'separator', 'insertImage', 'embedVideo', 'link', 'separator', 'bold', 'italic', 'underline', 'separator', 'insertOrderedList', 'insertUnorderedList', 'separator', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'separator', 'indent', 'outdent' ],

    init: function () {
        sc_super();

        this.controller = this.controllerClass.create({
            wysiwygView: this,
            commands: this.get('commands'),
            editor: this.get('editor')
        });

        // TODO: fix this up
        var toolbarHeight = this.get('toolbarHeight');
        this.get('toolbar').adjust('height', toolbarHeight);
        this.get('scrollView').adjust('top', toolbarHeight);

    },

    destroy: function() {
        this.controller.destroy();

        return sc_super();
    },

    controllerClass: SC.WYSIWYGController,
    controller: null,

    toolbarFrameDidChange: function () {
        var tf = this.getPath('toolbar.frame');
        if (tf) {
            this.get('scrollView').adjust('top', tf.height);
        }
    }.observes('.toolbar.frame'),

    // -------- Views

    /**
     *
     * Pointer to the editorView, which is set to the contentView of the
     * ScrollPane
     *
     * @property {SC.WYSIWYGEditorView}
     */
    editor: SC.outlet('scrollView.contentView'),

    /**
     * The toolbar that will be used for this view.
     *
     * @property {SC.WYSIWYGToolbarView}
     */
    toolbar: SC.WYSIWYGToolbarView.extend({
        controller: SC.outlet('parentView.controller'),
        layout: {
            top: 0, right: 0, left: 0
        }
    }),

    /**
     * Container for the editor view
     *
     * @property {SC.ScrollView}
     */
    scrollView: SC.ScrollView.extend({
        acceptsFirstResponder: NO,
        layout: {
            top: 32,
            right: 0,
            bottom: 0,
            left: 0
        },

        containerView: SC.ContainerView.extend({

            didCreateLayer: function () {
                SC.Event.add(this.$(), 'scroll', this, this.scroll);
            },

            willDestroyLayer: function () {
                SC.Event.remove(this.$(), 'scroll', this, this.scroll);
            },

            // syncronizing scrolling
            scroll: function (evt) {
                var $this = this.$();
                this.get('parentView').scrollTo($this.scrollLeft(), $this.scrollTop());
                return YES;
            }

        }),

        contentView: SC.WYSIWYGEditorView.extend({

            wysiwygView: SC.outlet('parentView.parentView.parentView'),

            valueBinding: '.wysiwygView.value',

            minHeightBinding: SC.Binding.transform(function (frame) {
                return frame ? frame.height : 0;
            }).oneWay('.parentView.parentView.frame'),

            mouseUp: function (evt) {
                return this.get('wysiwygView').mouseUp(evt);
            },

            mouseDown: function (evt) {
                return this.get('wysiwygView').mouseDown(evt);
            },

            focus: function (evt) {
                // walk up the dom to find a scroll view that isn't the one containing
                // this one.
                var wysiwygView = this.get('wysiwygView'),
                    scroller = wysiwygView.$().closest('.sc-container-view'),
                    stored = scroller.scrollTop();

                wysiwygView.becomeFirstResponder();
                this.updateFrameHeight();

                this.invokeLast(function () {
                    scroller.scrollTop(stored);
                    wysiwygView.scrollToVisible();
                });
            },

            blur: function (evt) {

            }

        })
    }),

    mouseEntered: function () {
        this.invokeLast(function () {
            this.controller.recomputeDocumentHeight();
            this.controller.updateState();
        });
    },

    mouseDown: function (evt) {
        this.rePaint();
        evt.allowDefault();
        this.controller.updateState();
        return YES;
    },

    mouseUp: function (evt) {
        this.rePaint();
        evt.allowDefault();
        this.becomeFirstResponder();
        this.controller.updateState();
        return YES;
    },

    keyUp: function (evt) {
        this.rePaint();
        var ret = this.get('editor').keyUp(evt);
        this.controller.updateState();
        return ret;
    },

    didBecomeKeyResponderFrom: function () {
        this.get('editor').$().focus();
    },

    willLoseFirstResponder: function () {
        this.get('editor').$().blur();
    },

    // TODO: Fix this up to be a bit more sane.
    keyDown: function (evt) {
        evt.allowDefault();
        this.rePaint();
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

    rePaint: function () {
        this.get('editor').toggleProperty('shouldRepaint');
        this.invokeLater(function () {
            this.get('editor').toggleProperty('shouldRepaint');
        });
    }
});
