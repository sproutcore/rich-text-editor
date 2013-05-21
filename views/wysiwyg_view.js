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
  @class
  
  
  @extends SC.View
  @extends SC.Control
  @author Joe Gaudet - joe@learndot.com
*/
SC.WYSIWYGView = SC.View.extend(SC.Control, {

  classNames: 'sc-wysiwyg-view',

  /*
    Wire the editor focus style to the view
   */
  classNameBindings: ['editorIsFirstResponder:focus'],
  
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
    Text that will be set to the editor if the value is empty.

    @property {String}
    @default ''
  */
  defaultValue: '',

  /**
    Padding of the editor

    @property {Number}
    @default 20
  */
  documentPadding: 20,

  /**
    Set to true to paste the content of the clipboard as plain text.

    @type Boolean
    @default NO
  */
  pasteAsPlainText: NO,

  /**
    Text to be entered on a carraige return

    @property {String}
    @default '<p><br></p>'
  */
  carriageReturnText: '<p><br></p>',


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
    commandsBinding: SC.Binding.oneWay('.parentView.commands')
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

      valueBinding: '.wysiwygView.value',
      defaultValue: SC.outlet('wysiwygView.defaultValue'),
      documentPadding: SC.outlet('wysiwygView.documentPadding'),
      pasteAsPlainText: SC.outlet('wysiwygView.pasteAsPlainText'),
      carriageReturnText: SC.outlet('wysiwygView.carriageReturnText'),

      minHeightBinding: SC.Binding.transform(function (frame) {
        return frame ? frame.height : 0;
      }).oneWay('.parentView.frame')
    })
  }),

  /**
    Pointer to the editorView, which is set to the contentView of the
    ScrollPane
    
    @property {SC.WYSIWYGEditorView}
  */
  editor: SC.outlet('scrollView.contentView'),

    /**
     *
     * Whether or not the editor is the current first responder
     *
     * @property {Boolean}
     */
  editorIsFirstResponder: NO,
  editorIsFirstResponderBinding: SC.Binding.oneWay('.scrollView.contentView.isFirstResponder')


  // .......................................................
  // PRIVATE
  //

  destroy: function () {
    var editor = this.get('editor');
    editor.resignFirstResponder();
    sc_super();
  },
});
