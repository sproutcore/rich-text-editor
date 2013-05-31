/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */
/**
 @class

   View class responsible for encapsulating the RTE editor built into modern
 browsers.

 https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
 http://msdn.microsoft.com/en-us/library/ms536419(v=vs.85).aspx
 https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html

 @extends SC.View
 @extends SC.Control
 @author Joe Gaudet - joe@learndot.com
 */
SC.WYSIWYGEditorView = SC.View.extend({
  classNames: 'sc-wysiwyg-editor',

  /**
   @type Number
   @default 20
   @see SC.WYSIWYGView#documentPadding
   */
  documentPadding: 20,

  /**
   @type String
   @default ''
   @see SC.WYSIWYGView#defaultValue
   */
  defaultValue: '',

  /**
   @type String
   @default '<p><br></p>'
   @see SC.WYSIWYGView#carriageReturnText
   */
  carriageReturnText: '<p><br></p>',

  /**
   @type Boolean
   @default NO
   @see SC.WYSIWYGView#pasteAsPlainText
   */
  pasteAsPlainText: NO,

  /**
   @readOnly
   @property {SC.WYSIWYGView}
   */
  wysiwygView: null,

  /**
   Min height of the frame
   Will be overighted to match the height of the container

   rotide   @readOnlyeeddiittoror
   @property {Number}
   */
  minHeight: 200,

  /**
   @type Boolean
   @default YES
   */
  isTextSelectable: YES,

  /**
   We want the editor to respond to key events

   @type Boolean
   @default YES
   */
  acceptsFirstResponder: YES,

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private */
  render: function (context) {
    context.setAttr('contentEditable', true);
    context.addStyle('padding', this.get('documentPadding'));
    context.push(this.get('carriageReturnText'));
  },

  /** @private */
  update: function (jquery) {
    this.get('wysiwygView').$().setClass('focus', this.get('isFirstResponder'));

    jquery.css('padding', this.get('documentPadding'));
  },

  /** @private */
  init: function () {
    sc_super();
    this.undoManager = SC.UndoManager.create();

    // Firefox: Disable image resizing
    if (SC.browser.isMozilla) {
      this.invokeLast(function () {
        document.execCommand("enableObjectResizing", false, false);
      });
    }
  },

  /** @private */
  destroy: function () {
    this.undoManager.destroy();
    sc_super();
  },

  /** @private */
  didCreateLayer: function () {
    SC.Event.add(this.$(), 'focus', this, 'focus');
    SC.Event.add(this.$(), 'blur', this, 'blur');
    SC.Event.add(this.$(), 'paste', this, 'paste');
  },

  /** @private */
  willDestroyLayer: function () {
    SC.Event.remove(this.$(), 'focus', this, 'focus');
    SC.Event.remove(this.$(), 'blur', this, 'blur');
    SC.Event.remove(this.$(), 'paste', this, 'paste');
  },

  /**
   Whether or not the value has been changed by the editor

   @property {Boolean}
   @private
   */
  _changeByEditor: false,

  /** @private
   Syncronize the value with the dom.
   */
  _valueDidChange: function () {
    var value = this.get('value') || this.get('defaultValue');
    if (!this._changeByEditor) {
      // if the value was changed as part of the setup,
      // sometimes the dom isn't ready, so we wait till
      // the next run loop
      this.invokeNext(function () {
        this.$().html(value);
        this.resetUndoStack();
      });
    }
    this._changeByEditor = false;
    this.set('_lastChangeTime', new Date().getTime());
  }.observes('value'),

  /**
   @private notify the dom that values have been updated.
   */
  notifyDomValueChange: function () {
    var value = this.get('value'),
      html = this.$().html(); // get the value from the inner document

    if (value !== html) {
      this._changeByEditor = true;
      this.set('value', html);
      this.registerUndo(value);
      this.updateState();
    }
  },

  /** @private
   Internal property used to update the state of the commands
   */
  recomputeEditorState: NO,

  /** @private */
  updateState: function () {
    this.notifyPropertyChange('recomputeEditorState');
  },

  /** @private
   Recompute frame height based on the size of the content inside of the
   editor
   */
  updateFrameHeight: function () {
    var calcHeight = this.computeHeight();
    this.adjust('height', Math.max(calcHeight, this.get('minHeight')));
  },

  /** @private
   Method to compute the height of the the editor.

   @return {Number}
   */
  computeHeight: function () {
    var layer = this.get('layer');
    if (!layer) return 0;

    var layerOverflow = layer.style.overflow,
      layerHeight = layer.style.height;
    layer.style.overflow = '';
    layer.style.height = '';
    var height = layer.offsetHeight;
    layer.style.height = layerHeight;
    layer.style.overflow = layerOverflow;
    return height;
  },

  /** @private
   Because we can't really know when the elements displayed in the editor
   are loads (images, fonts, ...) we schedule an update of the height of the
   editor during about 5s each time the value change.

   This is particularly useful at initialization, but also if we drag or
   resize an image.
   */
  scheduleHeightUpdate: function () {
    var currentTime = new Date().getTime(),
      gap = currentTime - this._lastChangeTime;

    if (gap < 10000) {
      this.updateFrameHeight();
      this.invokeOnceLater('scheduleHeightUpdate', gap);
    }
  }.observes('_lastChangeTime'),

  // ..........................................................
  // RTE SUPPORT
  //

  /**
   Call this method from a commandView to execute the its command

   @param commandView
   */
  invokeCommand: function (commandView) {
    this.focus();

    var command = commandView.get('command');
    if (command) {
      command.execute(commandView, this);
    }
  },

  /**
   Executes a command against the editor:

   https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
   http://msdn.microsoft.com/en-us/library/ms536419(v=vs.85).aspx
   https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html

   @param commandName
   @param showDefaultUI
   @param value
   */
  execCommand: function (commandName, showDefaultUI, value) {
    var ret = document.execCommand(commandName, showDefaultUI, value);
    this.notifyDomValueChange();
    return ret;
  },

  /**
   Determines whether or not a commandHasBeen executed at the current
   selection.

   TODO: refactor this mess

   @param commandName
   @returns {Boolean}
   */
  queryCommandState: function (commandName) {
    if (SC.browser.isMozilla) {
      var sel = this.getSelection();
      if (!sel || !sel.anchorNode) return;

      var aNode = sel.anchorNode;

      switch (commandName.toLowerCase()) {

        case 'bold':
          return this._searchForParentNamed(aNode, 'B');
          break;

        case 'italic':
          return this._searchForParentNamed(aNode, 'I');
          break;

        default:
          return '';
          break;
      }

    }
    else {
      var ret = false;
      try {
        ret = document.queryCommandState(commandName);
      }
      catch (e) {
        SC.error('Quering for command state failed: ' + commandName)
      }
      return ret;
    }
  },

  _searchForParentNamed: function (node, name) {
    while (node && (node.nodeName !== "P" || node.nodeName !== "DIV")) {
      if (node.nodeName === name) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  },

  /**
   Determines whether or not a commandHasBeen executed at the current
   selection.

   TODO: refactor this mess

   @param commandName
   @returns {Boolean}
   */
  queryCommandValue: function (commandName) {
    if (SC.browser.isMozilla) {
      var sel = this.getSelection();
      if (!sel || !sel.anchorNode) return;

      var node = sel.anchorNode;
      switch (commandName.toLowerCase()) {

        case 'formatblock':
          while (node && node.nodeName !== "DIV") {
            if (node.nodeName.match(/(P|H[1-6])/)) {
              return node.nodeName.toLowerCase();
            }
            node = node.parentNode;
          }
          return '';
          break;

        default:
          return '';
          break;
      }
    }
    else {
      return document.queryCommandValue(commandName);
    }
  },

  /**
   Insert some html at the current caret position

   @param html {String} html to be inserted
   */
  insertHtmlAtCaret: function (html) {
    var didInsertNode = false;

    if (document.getSelection) {
      var sel = this.getSelection(),
        range;

      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        var el = document.createElement("div"),
          frag = document.createDocumentFragment(),
          node = null,
          lastNode = null;

        el.innerHTML = html;

        while (node = el.firstChild) {
          lastNode = frag.appendChild(node);
        }

        range.insertNode(frag);
        didInsertNode = true;

        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
    else if (document.selection && document.selection.type != "Control") {
      document.selection.createRange().pasteHTML(html);
      didInsertNode = true;
    }

    this.notifyDomValueChange();

    return didInsertNode;
  },

  /**
   Set the current range of the selection

   @return range
   */
  saveSelection: function () {
    var range = this.getFirstRange();
    if (range) this._savedSelection = range;
    return this._savedSelection;
  },

  /**
   Restore the previously saved range
   */
  restoreSavedSelection: function () {
    this.setRange(this._savedSelection);
  },

  /**
   Create a new Range object.

   @return range
   */
  createRange: function () {
    if (document.getSelection) {
      return document.createRange();
    }
    else if (document.selection) { //IE 8 and lower
      return document.body.createTextRange();
    }
  },

  /**
   Set a range to the selection
   All the current ranges will be removed first

   @param range
   */
  setRange: function (range) {
    if (range) {
      if (document.getSelection) {
        var sel = this.getSelection();
        if (sel.rangeCount > 0) sel.removeAllRanges();
        sel.addRange(range);
      }
      else if (document.selection && range.select) {
        range.select();
      }
    }
  },

  /**
   Get the current the selection

   @return selection
   */
  getSelection: function () {
    return document.selection || document.getSelection();
  },

  /**
   Get the first range from the selection

   @return range
   */
  getFirstRange: function () {
    if (document.getSelection) {
      var sel = document.getSelection();

      return sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    }
    else if (document.selection && document.selection.createRange) {
      return document.selection.createRange();
    }
  },

  /**
   Determine is the passed range is inside the editor or not.

   @param range
   @return {Boolean}
   */
  rangeIsInsideEditor: function (range) {
    range = range.commonAncestorContainer;
    var editor = this.get('layer');

    while (range) {
      if (range === editor) {
        return true;
      }
      else range = range.parentNode;
    }
    return false;
  },

  /**
   Cross-browser method to select all the content of the editor

   @return range
   */
  selectNodeContents: function () {
    var layer = this.get('layer'),
      range = this.createRange();

    if (document.getSelection) {
      range.selectNodeContents(layer);
    }
    else if (document.selection) { //IE 8 and lower
      range.moveToElementText(layer);
    }
    return range;
  },

  /**
   Move the caret at the end to the editor
   */
  setCaretAtEditorEnd: function () {
    var range = this.selectNodeContents();
    range.collapse(false);
    this.setRange(range);
  },

  /**
   Reformats

   @param $element
   @param tagName
   @private
   @return reformated element
   */
  _formatElement: function ($element, tagName) {
    var newElement = $('<' + tagName + '/>').append($element.clone().get(0).childNodes);
    $element.replaceWith(newElement);
    return newElement;
  },

  formatNode: function ($element, tagName) {
    var newElement = $(tagName).append($element.clone().get(0).childNodes);
    $element.replaceWith(newElement);
    return newElement;
  },

  // ..........................................................
  // EVENTS
  //

  /** @private

   Hack to avoid the rootResponder to return NO to selectstart
   because the view handle mouseDragged
   */
  respondsTo: function (methodName) {
    if (this._mouseDown && methodName === 'mouseDragged') {
      this._mouseDown = NO;
      return NO;
    }
    return sc_super();
  },

  /** @private*/
  mouseDown: function (evt) {
    this._mouseDown = YES;
    this._mouseDownEvent = evt;
    evt.allowDefault();
    this.updateState();
    return YES;
  },

  /** @private*/
  mouseDragged: function (evt) {
    this.startDrag();
    return YES;
  },

  /** @private*/
  mouseUp: function (evt) {
    evt.allowDefault();
    this.updateState();
    this._mouseDownEvent = null;
    return YES;
  },

  /** @private*/
  didBecomeFirstResponder: function () {
    this.invokeNext(function () {
      this.$().focus();
    });
  },

  /** @private*/
  willLoseFirstResponder: function () {
    // Don't blur the editor when it lose its first responder. This avoid loosing the
    // selection in the case where the new first responder is a command.
    this.$().blur();
  },

  /** @private*/
  keyDown: function (evt) {
    var ret = this.interpretKeyEvents(evt) || this.performKeyEquivalent(evt.commandCodes()[0], evt);
    if (!ret) evt.allowDefault();
    return ret;
  },

  /** @private*/
  keyUp: function (evt) {
    console.log('key up');
    console.log(document.activeElement);

    // if there are no children lets format the selection with a paragraph
    if (this.$().children().length === 0) {
      document.execCommand('formatBlock', false, 'p');
    }
    this.notifyDomValueChange();
    this.updateState();
    return YES;
  },

  /** @private*/
  insertNewline: function (evt) {
    evt.allowDefault();
    return YES;
  },

  /** @private*/
  deleteBackward: function (evt) {
    evt.allowDefault();
    return YES;
  },

  deleteForward: function (evt) {
    evt.allowDefault();
    return YES;
  },

  moveLeftAndModifySelection: function (evt) {
    evt.allowDefault();
    return YES;
  },


  moveRightAndModifySelection: function (evt) {
    evt.allowDefault();
    return YES;
  },

  moveUpAndModifySelection: function (evt) {
    evt.allowDefault();
    return YES;
  },

  moveDownAndModifySelection: function (evt) {
    evt.allowDefault();
    return YES;
  },

  /** @private*/
  insertTab: function (evt) {
    evt.preventDefault();
    var nextKeyView = this.get('nextValidKeyView');
    if (nextKeyView) {
      nextKeyView.becomeFirstResponder();
    }
    return YES;
  },

  /** @private*/
  selectAll: function (evt) {
    evt.allowDefault();
    return YES;
  },

  /** @private */
  moveLeft: function (evt) {
    evt.allowDefault();
    return YES;
  },

  /** @private */
  moveRight: function (evt) {
    evt.allowDefault();
    return YES;
  },

  /** @private */
  moveUp: function (evt) {
    evt.allowDefault();
    return YES;
  },

  /** @private */
  moveDown: function (evt) {
    evt.allowDefault();
    return YES;
  },

  /** @private*/
  paste: function (evt) {
    // We need to use originalEvent to be able to access the clipboardData property
    var evt = evt.originalEvent,
      pasteAsPlainText = this.get('pasteAsPlainText');

    if (evt.clipboardData) {
      var data;
      if (pasteAsPlainText) {
        data = evt.clipboardData.getData('text');
      }
      else {
        data = evt.clipboardData.getData('text/html');
        if (data.indexOf('<body>') !== -1) {
          data = data.substring(data.indexOf('<body>'), data.indexOf('</body>'));
        }

        // some times text can be plain
        if (!data) {
          data = evt.clipboardData.getData('text');
        }
      }
      SC.run(function () {
        this.insertHtmlAtCaret(data);
      }, this);
      evt.preventDefault();
    }
    // doesn't support clipbaordData so lets do this, and remove any
    // horrible class and style information
    else {
      evt.allowDefault();
    }

    if (!pasteAsPlainText) {
      SC.run(function () {
        this.invokeNext(function () {
          this._normalizeMarkup(this.$().children());
          this._stripFormatting(this.$().children());
          this.notifyDomValueChange();
        });
      }, this);
    }
  },

  _normalizeMarkup: function (children) {
    var self = this;
    children.each(function (index, child) {
      var $child = $(child), nodeName = child.nodeName, fontWeight = $child.css('font-weight');

      // If it's a bold tag that for some odd reason has a normal
      // font weight lets un bold it.
      if (nodeName === 'B' && (fontWeight === 'normal' || fontWeight === 400)) {
        $child.children().unwrap();
      }

      // orphan spans lets remove em.
      if (nodeName === 'SPAN' && $child.text() === '') {
        $child.remove();
      }

      // No Font tags allowed
      if (nodeName === 'FONT') {
        $child.children().unwrap();
      }

      self._normalizeMarkup($child.children());
    });
  },

  _stripFormatting: function (children) {
    var self = this;
    children.each(function (index, child) {
      var $child = $(child),
        nodeName = child.nodeName,
        fontWeight = $child.css('font-weight'),
        textAlign = $child.css('text-align');

      // Make sure all anchors spawn new windows.
      if (nodeName === 'A') {
        $child.attr('target', '_blank');
      }

      // If it's a bold tag that for some odd reason has a normal
      // font weight lets un bold it.
      if (nodeName === 'B' && (fontWeight === 'normal' || fontWeight === 400)) {
        $child.children().unwrap();
      }

      // No Font tags allowed
      if (nodeName === 'FONT') {
        $child.children().unwrap();
      }

      $child.attr({
        'id': null,
        'style': null,
        'class': null
      });
      $child.css('text-align', textAlign);
      self._stripFormatting($child.children());
    });
  },

  firstTime: YES,
  /** @private*/
  focus: function (evt) {
    SC.run(function () {
      // sometimes it won't focus properly so we need to toggle the
      // focus blue
      if (this.firstTime) {
        this.firstTime = false;
        this.$().blur();
        this.$().focus();
      }
      else {
        this.becomeFirstResponder();
      }
    }, this);
  },

  /** @private*/
  blur: function (evt) {
    SC.run(function () {
      this.resignFirstResponder();
    }, this);
  },

  // ..........................................................
  // DRAG
  //

  /** @private*/
  startDrag: function () {
    if (this._didStartDrag) return true;
    var evt = this._mouseDownEvent,
      draggableElements = this.$().find('img'),
      target = evt.target,
      content = target.outerHTML;

    if (draggableElements.is(target)) {
      // If the browser doesn't support caretRangeFromPoint we can't compute where
      // to drop the img.
      // rangy 1.3 will add a cross-browser solution for this.
      if (!document.caretRangeFromPoint) {
        // In this case, we disable the drag
        evt.preventDefault();
        return false;
      }

      this._didStartDrag = true;
      this._target = target;
      this._content = content;

      var dragViewLayer = target.cloneNode(false);
      dragViewLayer.className = dragViewLayer.className + ' sc-wysiwyg-drag-view';
      var dragView = this._dragView = SC.View.create({
        layer: dragViewLayer
      });
      dragView.adjust({ top: evt.pageY - 5, left: evt.pageX - 5 });
      dragView.createLayer();

      SC.Drag.start({
        event: evt,
        source: this,
        dragView: dragView,
        ghost: NO,
      });
    }
    else {
      this._didStartDrag = false;
    }

    return this._didStartDrag;
  },

  /** @private*/
  dragDidMove: function (drag, loc) {
    // Prevent the dragView from being drag by the browser
    drag._lastMouseDraggedEvent.preventDefault();

    // Update the caret position to the place where the element will be drop
    // TODO The caret blink or is invisible
    var range = document.caretRangeFromPoint(loc.x, loc.y);
    this.setRange(range);
  },

  /** @private*/
  dragDidEnd: function (drag, loc) {
    var range = document.caretRangeFromPoint(loc.x, loc.y);

    if (this.rangeIsInsideEditor(range)) {
      this.setRange(range);
      var didInsert = this.insertHtmlAtCaret(this._content);
      if (didInsert) {
        this._target.parentNode.removeChild(this._target);
      }
      this.notifyDomValueChange();
    }

    this._didStartDrag = this._target = this._content = null;

    if (this._dragView) {
      this._dragView.destroy();
      this._dragView = null;
    }
  },

  /** @private

   Avoid showing the insertionPoint of a SC.listView if
   we drag an image over a it.
   */
  dragSourceOperationMaskFor: function () {
    return SC.DRAG_NONE;
  },

  // ..........................................................
  // UNDO MANAGER
  //

  /** @private */
  undoManager: null,

  /** @private*/
  undo: function (evt) {
    this.undoManager.undo();
    return YES;
  },

  /** @private */
  redo: function (evt) {
    this.undoManager.redo();
    return YES;
  },

  /** @private */
  registerUndo: function (value) {
    var that = this;

    this.undoManager.registerUndo(function () {
      that.$().html(value);
      that.notifyDomValueChange();
      that.setCaretAtEditorEnd();
    });
  },

  /** @private */
  resetUndoStack: function () {
    var undoManager = this.undoManager;
    undoManager.set('undoStack', null);
    undoManager.set('redoStack', null);
    this.updateState();
  }

});
