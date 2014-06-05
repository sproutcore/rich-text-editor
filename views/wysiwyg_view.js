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

/** @class
  A convenience view combining an editor view with a toolbar view, hooked up correctly.

  @extends SC.View
  @extends SC.Control
  @author Joe Gaudet - joe@learndot.com
*/
SC.WYSIWYGView = SC.View.extend(SC.Control, {

  /** @private */
  classNames: 'sc-wysiwyg-view',

  /**
    The value of the editor.
    You may also set the value using a content object and a contentValueKey.

    @type String
  */
  value: '',

  /**
    The commands to display in the toolbar

    @type Array
  */
  commands: ['styles', 'separator', 'insertImage', 'embedVideo', 'link', 'separator', 'bold', 'italic', 'underline', 'separator', 'insertOrderedList', 'insertUnorderedList', 'separator', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'separator', 'indent', 'outdent'],

  /**
    @property {String}
    @default ''
    @see SC.WYSIWYGEditorView#defaultValue
  */
  defaultValue: '',

  /**
    @property {Number}
    @default 20
    @see SC.WYSIWYGEditorView#documentPadding
  */
  documentPadding: 20,

  /**
    Whether the editor view and toolbars are enabled.

    @property {Boolean}
    @default YES
   */
  isEditable: YES,

  /**
    @type Boolean
    @default NO
    @see SC.WYSIWYGEditorView#forceLineBreaks
  */
  forceLineBreaks: NO,

  /**
    @type Boolean
    @default NO
    @see SC.WYSIWYGEditorView#pasteAsPlainText
  */
  pasteAsPlainText: NO,

  /**
    Class name or array of class names to add to the RTE editor

    @property {Array|String}
    @default null
  */
  editorClassNames: null,

  contentKeys: {
    contentValueKey: 'value',
    contentErrorKey: 'error',
    contentIsInErrorKey: 'isInError'
  },

  // .......................................................
  // VIEWS
  //

  childViews: ['scrollView', 'toolbar'],

  /**
    The toolbar that will be used for this view.

    @property {SC.WYSIWYGToolbarView}
  */
  toolbar: SC.WYSIWYGToolbarView.extend({
    editor: SC.outlet('parentView.scrollView.contentView'),
    commandsBinding: SC.Binding.oneWay('.parentView.commands'),
    isEnabledBinding: SC.Binding.oneWay('.parentView.isEditable')
  }),

  /**
    Container for the editor view

    @property {SC.ScrollView}
  */
  scrollView: SC.ScrollView.extend({
    layoutBinding: SC.Binding.oneWay('.parentView.toolbar.frame').transform(function (frame) {
      return { top: frame.height, right: 0, bottom: 0, left: 0
      };
    }),

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
        SC.run(function(){
          this.get('parentView').scrollTo($this.scrollLeft(), $this.scrollTop());
        }, this);
        return YES;
      }
    }),

    contentView: SC.WYSIWYGEditorView.extend({
      // Adds class names from the wrapper view. (TODO: See if we can't do this with a simple classNames binding.)
      init: function() {
        sc_super();

        var wysiwygView = this.get('wysiwygView'),
            editorClassNames = wysiwygView.get('editorClassNames');

        if (editorClassNames) {
          editorClassNames = SC.makeArray(editorClassNames);
          this.classNames.pushObjects(editorClassNames);
        }
      },

      wysiwygView: SC.outlet('parentView.parentView.parentView'),

      update: function() {
        var wysiwygView = this.get('wysiwygView');
        if (wysiwygView) wysiwygView.$().setClass('focus', this.get('isFirstResponder'));

        sc_super();
      },

      valueBinding: '.wysiwygView.value',

      isEnabledBinding: SC.Binding.oneWay('.wysiwygView.isEditable'),

      defaultValue: SC.outlet('wysiwygView.defaultValue'),

      documentPadding: SC.outlet('wysiwygView.documentPadding'),

      pasteAsPlainText: SC.outlet('wysiwygView.pasteAsPlainText'),

      forceLineBreaks: SC.outlet('wysiwygView.forceLineBreaks'),

      minHeightBinding: SC.Binding.transform(function (frame) {
        return frame ? frame.height : 0;
      }).oneWay('.parentView.frame')
    })
  }),

  /** @private
    Pointer to the editorView, which is set to the contentView of the
    ScrollPane

    @property {SC.WYSIWYGEditorView}
  */
  editor: SC.outlet('scrollView.contentView'),

  /** @private
   *
   * Whether or not the editor is the current first responder
   *
   * @property {Boolean}
   */
  editorIsFirstResponder: NO,
  editorIsFirstResponderBinding: SC.Binding.oneWay('.scrollView.contentView.isFirstResponder'),

  /* @private
    Wire the editor focus style to the view.
   */
  classNameBindings: ['editorIsFirstResponder:focus'],

  // .......................................................
  // PRIVATE
  //

  destroy: function () {
    this.get('editor').resignFirstResponder();
    sc_super();
  }
});
