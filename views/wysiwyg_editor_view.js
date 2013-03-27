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

  documentPadding: 20,

  /**
    Text to be entered on a carraige return
  */
  carriageReturnText: '<p><br></p>',

  /**
    @readOnly
    @property {SC.WYSIWYGView} 
  */
  wysiwygView: null,

  /**
    Min height of the frame
    Will be overighted to match the height of the container
  */
  minHeight: 200,

  isTextSelectable: YES,

  acceptsFirstResponder: YES,

  // ..........................................................
  // INTERNAL SUPPORT
  // 

  render: function (context) {
    context.setAttr('contentEditable', true);
    context.addStyle('padding', this.get('documentPadding'));
    context.push(this.get('carriageReturnText'));
  },

  update: function (jquery) {
    this.get('wysiwygView').$().setClass('focus', this.get('isFirstResponder'));

    jquery.css('padding', this.get('documentPadding'));
  },

  didCreateLayer: function () {
    SC.Event.add(this.$(), 'focus', this, 'focus');
    SC.Event.add(this.$(), 'blur', this, 'blur');
    SC.Event.add(this.$(), 'paste', this, 'paste');
  },

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

  /**
    Syncronize the value with the dom.
  */
  _valueDidChange: function () {
    var value = this.get('value') || '';
    if (!this._changeByEditor) {
      this.$().html(value);
      this.updateFrameHeight();
    }
    this._changeByEditor = false;
  }.observes('value'),

  /**
    @private notify the dom that values have been updated.
  */
  notifyDomValueChange: function () {
    // get the value from the inner document
    this._changeByEditor = true;
    this.set('value', this.$().html());
  },

  recomputeEditorState: NO,

  updateState: function () {
    this.notifyPropertyChange('recomputeEditorState');
  },

  /**
    Recompute frame height based on the size of the content inside of the
    editor
  */
  updateFrameHeight: function () {
    var lastNode = this.$().children().last();
    if (lastNode.length > 0) {
      var calcHeight = this.$().scrollTop() + lastNode.position().top + lastNode.height() + this.get('documentPadding');
      this.adjust('height', Math.max(calcHeight, this.get('minHeight')));
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
    this.updateState();
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

    } else {
      return document.queryCommandState(commandName);
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
    } else {
      return document.queryCommandValue(commandName);
    }
  },

  /**
    Insert some html at the current caret position
    
    @param html {String} html to be inserted
  */
  insertHtmlAtCaret: function (html) {
    if (document.getSelection) {
      var sel = window.getSelection(),
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

        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    } else if (document.selection && document.selection.type != "Control") {
      document.selection.createRange().pasteHTML(html);
    }

    this.notifyDomValueChange();
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
  restoreSavedSelection: function() {
    this.setRange(this._savedSelection);
  },

  /**
    Set a range to the selection
    All the current ranges will be removed first
    
    @param range
  */
  setRange: function (range) {
    if (range) {
      if (window.getSelection) {
        var sel = this.getSelection();
        if (sel.rangeCount > 0) sel.removeAllRanges();
        sel.addRange(range);
      } else if (document.selection && range.select) {
        range.select();
      }
    }
  },

  /**
    Get the current the selection
  */
  getSelection: function () {
    return document.selection || document.getSelection();
  },

  /**
    Get the first range from the selection
    
    @param range
  */
  getFirstRange: function () {
    if (document.getSelection) {
      var sel = document.getSelection();

      return sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    } else if (document.selection && document.selection.createRange) {
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
  respondsTo: function( methodName ) {
    if (this._mouseDown && methodName === 'mouseDragged') {
      this._mouseDown = NO;
      return NO;
    }
    return sc_super();
  },

  /** @private*/
  mouseEntered: function () {
    this.updateFrameHeight();
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
  keyDown: function (evt) {
    var ret = this.interpretKeyEvents(evt) || this.performKeyEquivalent(evt.commandCodes()[0], evt);
    if (!ret) evt.allowDefault();

    return ret;
  },

  /** @private*/
  keyUp: function (evt) {
    this.notifyDomValueChange();
    this.updateState();
    return YES;
  },

  /** @private*/
  insertNewline: function (evt) {
    if (this.queryCommandValue('formatBlock') === 'div') {
      this.execCommand('formatBlock', null, 'p');
      return YES;
    }
    return NO;
  },

  /** @private*/
  deleteBackward: function() {
    var first = this.$().children()[0];
    if (!first || first && first.nodeName === "BR") {
      this.insertHtmlAtCaret(this.get('carriageReturnText'));
      return YES;
    }
    return NO;
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
  paste: function (evt) {
    if (evt.clipboardData) {
      evt.preventDefault();
      var data = evt.clipboardData.getData('text/html');
      this.insertHtmlAtCaret(data.substring(data.indexOf('<body>'), data.indexOf('</body>')));
    }
    // doesn't support clipbaordData so lets do this, and remove any
    // horrible class and style information 
    else {
      evt.allowDefault();
    }

    // TODO: Rather then parse things lets actually traverse the dom.
    // bone head move.
    this.invokeNext(function () {
      this.notifyDomValueChange();
      var value = this.get('value');

      // handle IE pastes, which could include font tags
      value = value.replace(/<\/?font[^>]*>/gim, '');

      // also no ids
      value = value.replace(/id="[^"]+"/, '');

      // also no classes
      value = value.replace(/class="[^"]+"/, '');

      var matches = value.match(/style="([^"]+)"/g);
      if (matches) {
        for (var i = 0; i < matches.length; i++) {
          var subMatches = matches[i].match(/(text-align): [^;]+;/);
          value = value.replace(matches[i], subMatches ? subMatches.join('') : '');
        }
      }

      var links = value.match(/<a[^>]+>/g);
      if (links) {
        for (var i = 0; i < links.length; i++) {
          value = value.replace(links[i], links[i].replace(/target="[^"]+"/, '').replace('>', ' target="_blank">'));
        }
      }

      this.set('value', value);
    });
  },

  /** @private*/
  focus: function (evt) {
    this.becomeFirstResponder();
  },

  /** @private*/
  blur: function (evt) {
    this.resignFirstResponder();
  },


  // ..........................................................
  // DRAG
  // 

  /** @private*/
  startDrag: function() {
    var evt = this._mouseDownEvent,
        draggableElements = this.$().find('img'),
        target = evt.target,
        content = target.outerHTML;

    if (draggableElements.is(target)) {
      // If the browser doesn't support caretRangeFromPoint we can't compute where
      // to drop the img. 
      // rangy 1.3 will add a cross-browser solution for this.
      if (!document.caretRangeFromPoint) {
        // In this cas, we disable the drag
        evt.preventDefault();
        return false;
      }

      this._allowDrag = true;
      this._target = target;
      this._content = content;

      var dragViewLayer = target.cloneNode(false);
      dragViewLayer.className = dragViewLayer.className + ' sc-wysiwyg-drag-view';
      var dragView = this._dragView = SC.View.create({ 
        layer: dragViewLayer
      });
      dragView.adjust({ top: evt.pageY-5, left: evt.pageX-5 });
      dragView.createLayer();

      SC.Drag.start({
        event: evt,
        source: this,
        dragView: dragView,
        ghost: NO,
      });
    }
    else {
      this._allowDrag = false;
    }

    return this._allowDrag;
  },

  /** @private

    TODO don't work well
  */
  dragDidMove: function(drag, loc) {
    var range = document.caretRangeFromPoint(loc.x, loc.y);
    this.setRange(range);
  },

  /** @private*/
  dragDidEnd: function(drag, loc) {
    var range = document.caretRangeFromPoint(loc.x, loc.y);

    if (this.rangeIsInsideEditor(range)) {
      this.setRange(range);
      this._target.parentNode.removeChild(this._target);
      this.insertHtmlAtCaret(this._content);
    }

    this._allowDrag = this._target = this._content = null;

    if (this._dragView) {
      this._dragView.destroy();
      this._dragView = null;
    }

    if (this._dropzones) {
      this._dropzones.off('dragleave').off('drop');
      this._dropzones = null;
    }
  },

  /** @private

    Avoid showing the insertionPoint of a SC.listView if 
    we drag an image over a it.
  */
  dragSourceOperationMaskFor: function() {
    return SC.DRAG_NONE;
  }

});
