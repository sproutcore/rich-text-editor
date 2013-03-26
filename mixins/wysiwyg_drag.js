/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */
// Framework:   SproutcoreWysiwyg
/**
 * @class
 *
 * This mixin add the ability to move img inside the editor
 *
 * @author Nicolas Badia - badia.nicolas@gmail.com
 */
SC.WYSIWYGDragMixin = {   

  mouseDown: function (evt) {
    var allowDrag = this.startDrag(evt);

    return allowDrag;
  },

  startDrag: function(evt) {
    var draggableElements = this.$().find('img'),
        target = this._target = evt.target,
        content = this._content = target.outerHTML;

    if (draggableElements.is(this._target)) {
      // If the browser doesn't support caretRangeFromPoint we can't compute where
      // to drop the img. 
      // rangy 1.3 will add a cross-browser solution for this.
      if (!document.caretRangeFromPoint) {
        // In this cas, we disable the drag
        evt.preventDefault();
        return false;
      }

      this._allowDrag = true;

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

  // TODO don't work well
  dragDidMove: function(drag, loc) {
    var range = document.caretRangeFromPoint(loc.x, loc.y);
    this.setRange(range);
  },

  mouseUp: function(evt) {
    if (this._allowDrag) {
      var range = document.caretRangeFromPoint(evt.clientX, evt.clientY);

      if (this.rangeIsInsideEditor(range)) {
        this.setRange(range);
        this._target.parentNode.removeChild(this._target);
        this.insertHtmlAtCaret(this._content);
      }
      
    }
    this.endDrag();
    return YES;
  },

  endDrag: function() {
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

  // Avoid showing an insertionPoint on a SC.listView
  dragSourceOperationMaskFor: function() {
    return SC.DRAG_NONE;
  },

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
  }

};

