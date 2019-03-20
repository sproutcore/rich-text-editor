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
  /** @private */
  classNames: 'sc-wysiwyg-editor',

  /**
   The editor's current value, including markup.

   @type String
   @default NO
   */
  value: null,

  /**
    Whether the editor is presently editable.

    @type Boolean
    @default YES
  */
  isEnabled: YES,

  /**
   A padding, in pixels, that is added to the editor element.

   @type Number
   @default 20
   */
  documentPadding: 20,

  /** @deprecated Use `hint` instead. */
  defaultValue: null,

  /** @private
   When running unit tests, a link click may trigger a call to `window.open`.

   This flag allows the view to prevent this since we don't want unit tests actually
   opening windows.

   @type Boolean
   @default YES
   */
  _followRedirects: YES,

  /**
   A text hint displayed when no value is present.

   Note that the hint will not update when changed. For dynamic hints, add 'hint' to
   your view's displayProperties.

   @type String
   @default ''
   */
  hint: function() {
    // This is only a calculated property to enable a deprecation notice. Feel free to override it
    // in your own code.
    var defaultValue = this.get('defaultValue');

    //@if(debug)
    if (!SC.none(defaultValue)) {
      SC.warn("Developer Warning: The SC.WYSIWYGEditorView property `defaultValue` has been renamed `hint`. Please update your views.");
    }
    //@endif

    return defaultValue || '';
  }.property('defaultValue').cacheable(),

  /**
    This value is added to the bottom of the view's height. This works around a problem where
    a new line will cause the view to jump up before jumping back down.

    @type Number
    @default 25
  */
  lineHeight: 25,

  /**
    Set to true to paste the content of the clipboard as plain text.

   @type Boolean
   @default NO
   */
  pasteAsPlainText: NO,

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
   We want the editor to respond to key events when it is enabled

   @type Boolean
   */
  acceptsFirstResponder: function() {
    return this.get('isEnabledInPane');
  }.property('isEnabledInPane').cacheable(),

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private */
  displayProperties: ['contentEditable', 'hintIsVisible'],

  /** @private */
  contentEditable: function() {
    return this.get('isEnabledInPane') ? 'true' : 'false';
  }.property('isEnabledInPane').cacheable(),

  /** @private */
  hintIsVisible: function() {
    // FAST PATH: first responder = no hint.
    if (this.get('hasFirstResponder')) return false;

    var value = this.get('value');
    // TODO: Make this better than a short list of things we've seen browsers stick in empty contenteditable elements.
    return !value || value === '<br>' || value === '<p><br></p>';
  }.property('hasFirstResponder').cacheable(),

  /** @private */
  render: function (context) {
    var wysiwygView = this.get('wysiwygView'),
      editorClassNames = wysiwygView.get('editorClassNames'),
      value = this.get('value'),
      padding = this.get('documentPadding');

    // The contenteditable element itself.
    context = context.begin().addClass('sc-wysiwyg-editor-inner');
      if (editorClassNames) context.addClass(SC.makeArray(editorClassNames).join(' '));
      context.setAttr('contenteditable', this.get('contentEditable'));
      if (!SC.none(padding)) context.addStyle('padding', padding);
      if (!SC.none(value)) context.push(value);
    context = context.end();

    // The hint.
    context = context.begin().addClass('sc-wysiwyg-editor-hint');
      context.setClass({ 'sc-hidden': !this.get('hintIsVisible') });
      if (!SC.none(padding)) context.addStyle('padding', padding);
      context.push(SC.RenderContext.escapeHTML(this.get('hint') || ''));
    context = context.end();
  },

  /** @private */
  update: function (jquery) {
    jquery.find('.sc-wysiwyg-editor-inner')
      .attr('contenteditable', this.get('contentEditable'));
    jquery.find('.sc-wysiwyg-editor-hint')
      .text(this.get('hint') || '')
      .setClass({ 'sc-hidden': !this.get('hintIsVisible') });
  },

  /** @private */
  init: function () {
    sc_super();

    this.undoManager = SC.AutoGroupUndoManager.create({
      groupLapse: 1000
    });

    document.execCommand('defaultParagraphSeparator', false, 'p');
  },

  /** @private */
  _isEnabledInPaneDidChange: function() {
    // Firefox: Disable image resizing
    if (SC.browser.isMozilla) {
      this.invokeLast(function () {
        // need to make sure editor is actually editable, otherwise Firefox will
        // throw an error if no element on the page is contentEditable
        if (this.get("isEnabledInPane")) {
            document.execCommand("enableObjectResizing", false, false);
        }
      });
    }
  }.observes('isEnabledInPane'),

  /** @private */
  destroy: function () {
    this.undoManager.destroy();
    sc_super();
  },

  /** @private */
  didCreateLayer: function () {
    // Cache element references.
    this.$inner = this.$().find('.sc-wysiwyg-editor-inner');
    this.$hint = this.$().find('.sc-wysiwyg-editor-hint');

    // Hook up extra events.
    SC.Event.add(this.$inner, 'focus', this, 'focus');
    SC.Event.add(this.$hint, 'click', this, 'focus');
    SC.Event.add(this.$inner, 'blur', this, 'blur');
    SC.Event.add(this.$inner, 'paste', this, 'paste');

    // Handle 'input' events such as making a selection from the
    // autocorrect menu when a misspelled word is right-clicked
    SC.Event.add(this.$inner, 'input', this, function() {
        SC.RunLoop.begin();
        this.notifyDomValueChange();
        SC.RunLoop.end();
    });
  },

  /** @private */
  willDestroyLayer: function () {
    // Clear element references.
    this.$inner = null;
    this.$hint = null;

    // Unhook the events.
    SC.Event.remove(this.$inner, 'focus', this, 'focus');
    SC.Event.remove(this.$hint, 'click', this, 'focus');
    SC.Event.remove(this.$inner, 'blur', this, 'blur');
    SC.Event.remove(this.$inner, 'paste', this, 'paste');
  },

  viewDidResize: function() {
    sc_super();
    var width = this.getPath('frame.width'),
        previousWidth = this._previousWidth;
    if (width === previousWidth) return;
    this._previousWidth = width;
    this.invokeNext(this.updateFrameHeight);
  },

  /** @private Whether the hint is currently visible. */
  _hintIsVisible: NO,

  /**
   Whether or not the value has been changed by the editor

   @property {Boolean}
   @private
   */
  _changeByEditor: false,

  /*
    The time when loading of images, fonts, etc. may have been triggered
    by a value or visibility change.

    @property {Boolean}
    @private
  */
  _valueChangeTriggerTime: null,

  /** @private
   Syncronize the value with the dom.
   */
  _valueDidChange: function () {
    if (!this._changeByEditor) {
      // If we're not the first responder, an external force may have changed the hint's visibility. (Note that
      // the hasFirstResponder check may essentially duplicate the _changeByEditor check and may not be needed.)
      if (!this.get('hasFirstResponder')) this.notifyPropertyChange('hintIsVisible');
      // If the layer isn't yet available, we wait a cycle for it to be created.
      if (this.get('layer')) {
        this._doUpdateValue();
      } else {
        this.invokeNext(this._doUpdateValue);
      }
    }
    this._changeByEditor = false;
    this._valueChangeTriggerTime = new Date().getTime();
    this.scheduleHeightUpdate();
  }.observes('value'),

  _doUpdateValue: function() {
    var value = this.get('value') || '';
    try {
      this.$inner.html(value);
    }
    catch(e) {
      SC.Logger.error('Error while updating the rich text editor content: '+e.message);
    }
    this.resetUndoStack();
    this.updateFrameHeight();
  },

  /**
   @private notify the dom that values have been updated.
   */
  notifyDomValueChange: function () {
    var value = this.get('value'),
      html = this.$inner.html(); // get the value from the inner document

    html = html.replaceAll('&gt;', '>').replaceAll('&lt;', '<');

    if (value !== html) {
      this._changeByEditor = true;
      this.set('value', html);
      this.registerUndo(value);
    }

    this.updateState();
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
    // minHeight may be NaN when the view is destroy
    if (!this.get('minHeight')) return;

    var calcHeight = this.computeHeight();
    this.adjust('height', Math.max(calcHeight, this.get('minHeight')));
  }.observes('minHeight'),

  /** @private
   Method to compute the height of the the editor.

   @return {Number}
   */
  computeHeight: function () {

    // If there's no editable content, bail.
    if(!this.$inner || !this.$inner[0]) { return 0; }

    // Get the height of the editable element.
    var layer = this.$inner[0];

    // We need to add enough height that there's room for a carriage return before we go offscreen.
    var padding = (this.get('lineHeight')) - (this.get('documentPadding') || 0);

    // (Constrain the padding delta to positive numbers.)
    padding = Math.max(padding, 0);

    return layer.clientHeight + padding;
  },

  /** @private
   Since we can't really know when the elements displayed in the editor are
   loaded (images, fonts, ...) we run a rapid but slowing set of updates over
   the course of ten seconds in hopes of catching any reflows in the act.
   This is particularly useful at initialization, but also if we drag or
   resize an image.

   Since scheduling height updates is useless when we're detached from the
   DOM, we defer scheduled updates until then.
   */
  scheduleHeightUpdate: function () {
    // GATEKEEP: If we're detached, set up an observer on isVisibleInWindow and wait.
    // Note: the reason we don't just observe isVisibleInWindow all the time is that
    // if no height update was scheduled during detachment there's no reason to schedule
    // it on attachment.
    if (!this.get('isVisibleInWindow')) {
      if (!this._isWaitingOnVisible) {
        this.addObserver('isVisibleInWindow', this, this.scheduleHeightUpdate);
        this._isWaitingOnVisible = YES; //sigh flags
      }
      return;
    }

    // If we were waiting for visibility, then clean up and update the DOM trigger time.
    if (this._isWaitingOnVisible) {
      this.removeObserver('isVisibleInWindow', this, this.scheduleHeightUpdate);
      this._isWaitingOnVisible = NO;
      this._valueChangeTriggerTime = new Date().getTime();
    }

    var currentTime = new Date().getTime(),
        gap = currentTime - this._valueChangeTriggerTime + 10;
    // (Adding ten milliseconds slows the initially high rate of updates; improves
    // performance without slowing apparent reaction time or impacting schedule
    // of later, slower updates.)

    if (gap < 10000) {
      this.updateFrameHeight();
      this.invokeOnceLater('scheduleHeightUpdate', gap);
    }
  },

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
    var ret = false;
    try {
      if (document.queryCommandSupported(commandName) && document.queryCommandEnabled(commandName)) {
          ret = document.queryCommandState(commandName);
      }
    }
    catch (e) {
      SC.error('Querying for command state failed: ' + commandName);
    }
    return ret;
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

   @param commandName
   @returns {Boolean}
   */
  queryCommandValue: function (commandName) {
    var ret = false;
    try {
      if (document.queryCommandSupported(commandName) && document.queryCommandEnabled(commandName)) {
          ret = document.queryCommandValue(commandName);
      }
    }
    catch (e) {
      SC.error('Querying for command value failed: ' + commandName);
    }
    return ret;
  },

  /**
   Insert some html at the current caret position

   @param html {String} html to be inserted
   */
  insertHtmlAtCaret: function (html, notify) {
    var didInsertNode = false;

    if (document.getSelection) {
      var sel = this.getSelection(),
        range;

      // If there is no range, we add the html at the end of the editor.
      // This may be usefull when inserting images.
      if (!sel.rangeCount) {
        this.setCaretAtEditorEnd();
      }

      if (sel.getRangeAt && sel.rangeCount) {
        // If any text is selected, remove it.
        range = sel.getRangeAt(0);

        // If the range is outside the editor then set it back
        if (!this.rangeIsInsideEditor(range)) {
          range = this.selectNodeContents();
        }

        range.deleteContents();

        //https://github.com/ilyabirman/Likely/issues/69
        // If the range is outside the editor then set it back
        if (!this.rangeIsInsideEditor(range)) {
          range = this.selectNodeContents();
        }

        // The dummy div element is used to turn the HTML into DOM, which is then removed and appended to
        // the element fragment (frag).
        var el = document.createElement("div"),
          frag = document.createDocumentFragment(),
          node = null,
          lastNode = null;

        el.innerHTML = html;

        while (node = el.firstChild) {
          lastNode = frag.appendChild(node);
        }

        // The fragment, now full of the DOM we generated from html goes into the document at range.
        range.insertNode(frag);
        didInsertNode = true;

        // If we actually inserted anything, move the cursor to the end.
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

    if (notify !== false) this.notifyDomValueChange();

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
    var editor = this.$inner[0];

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
  selectNodeContents: function (layer) {
    layer = layer || this.$inner[0];
    var range = this.createRange();

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

    // If user hits a link in the editor's HTML while not editing,
    //  instead of becoming `firstResponder`, open the link in a new window
    if(
      evt.target.hasOwnProperty('tagName')
      && evt.target.tagName === 'A'
      && !this.get('hasFirstResponder')
    ) {
      if(this.get('_followRedirects')) { window.open(evt.target.href, '_blank'); }

      // Instead of returning NO, indicate the view handled the event specially
      evt.preventDefault();
    }
    else if (evt.target === this.get('layer')) {
      this._mouseDownOutsideOfEditor = YES; // TODO: yeah this is kind of hacky
      this.becomeFirstResponder();
      this.setCaretAtEditorEnd();
    }
    else {
      this._mouseDown = YES;

      // Making a copy of the event so that we can use it later without fear the
      // event will be cleared.
      // NOTE: SC.Event now only caches one event object by event type.
      // https://github.com/sproutcore/sproutcore/commit/36b18d31bb378ee5211f124f176b2a19c9629a63#diff-4ac32a78649ca5bdd8e0ba38b7006a1e
      this._mouseDownEvent = SC.copy(evt);

      evt.allowDefault();
      this.updateState();
    }

    return YES;
  },

  /** @private*/
  mouseDragged: function (evt) {
    if (!this._mouseDownOutsideOfEditor) {
      this.startDrag();
      this._mouseDragged = true;
    }
    return YES;
  },

  /** @private*/
  mouseUp: function (evt) {
    if (!this._mouseDownOutsideOfEditor) {
      evt.allowDefault();
      this.updateState();
      this._mouseDownEvent = null;
    }
    this._mouseDownOutsideOfEditor = NO;
    return YES;
  },


  /** @private */
  touchStart: function(evt) {
    evt.allowDefault();
    this._mouseDown = YES;
    return YES;
  },
  /** @private */
  touchesDragged: function(evt, touchesForView) {
    // If we have focus, just allow the event to go back through to the browser.
    if (this.get('hasFirstResponder')) {
      evt.allowDefault();
    }
    // If we've moved too much, we need to pass the touch back to the scroll view that it's presumably wrapped in.
    else {
      var deltaY = Math.abs(evt.pageY - evt.startY);
      if (deltaY > 4) {
        touchesForView.invoke('restoreLastTouchResponder');
      }
    }
    return YES;
  },
  /** @private */
  touchEnd: function(evt) {
    evt.allowDefault();
    this.updateState();
    this._mouseDownEvent = null;
    return YES;
  },

  /** @private*/
  didBecomeFirstResponder: function () {
    // Need closure on the inner element for unit test.
    //  Otherwise, the element is null by time `invokeNext` fires.
    var inner = this.$inner;
    this.invokeNext(function () {
      inner.focus();
    });
  },

  /** @private*/
  willLoseFirstResponder: function () {

    // There is an apparent bug in WebKit that prevents contenteditable elements from properly giving up
    // focus when told to blur. As a work around, we clear the selection, which frees up the element to blur.
    var sel = document.getSelection();
    sel.removeAllRanges();

    this.$inner.blur();
  },

  /** @private*/
  keyDown: function (evt) {
    var ret = this.interpretKeyEvents(evt) || this.performKeyEquivalent(evt.commandCodes()[0], evt);
    if (!ret) evt.allowDefault();
    return ret;
  },

  /** @private */
  keyUp: function (evt) {
    this.notifyDomValueChange();
    this.updateState();
    return YES;
  },

  /** @private */
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
    evt.allowDefault();
    return YES;
  },

  /** @private*/
  focus: function (evt) {
    SC.run(this.becomeFirstResponder, this);
  },

  /** @private*/
  blur: function (evt) {
    SC.run(this.resignFirstResponder, this);
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
      var didInsert = this.insertHtmlAtCaret(this._content, false);
      if (didInsert) {
        // TODO: TypeError: 'null' is not an object (evaluating 'this._target.parentNode.removeChild')
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

    this.undoManager.registerUndoAction(null, function () {
      that.$inner.html(value);
      that.notifyDomValueChange();
      that.setCaretAtEditorEnd();
    });
  },

  /** @private */
  resetUndoStack: function () {
    this.undoManager.reset();
  }

});
