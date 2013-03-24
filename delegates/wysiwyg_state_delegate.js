/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */

/**
 * @class
 *
 * Provides a facade for binding to properties and interacting with the editor
 * window.
 */
SC.WYSIWYGStateDelegate = {

    recomputeEditorState: NO,

    updateState: function () {
        this.invokeLast(function () {
            if (this.getPath('wysiwygView.isFirstResponder')) {
                this.toggleProperty('recomputeEditorState');
            }
        });

    },

    isBold: function () {
        return this.queryCommandState('bold');
    }.property('recomputeEditorState'),

    isItalic: function () {
        return this.queryCommandState('italic');
    }.property('recomputeEditorState'),

    isUnderline: function () {
        return this.queryCommandState('underline');
    }.property('recomputeEditorState'),

    isJustifyLeft: function () {
        return this.queryCommandState('justifyLeft');
    }.property('recomputeEditorState'),

    isJustifyCenter: function () {
        return this.queryCommandState('justifyCenter');
    }.property('recomputeEditorState'),

    isJustifyRight: function () {
        return this.queryCommandState('justifyRight');
    }.property('recomputeEditorState'),

    isJustifyFull: function () {
        return this.queryCommandState('justifyFull');
    }.property('recomputeEditorState'),

    currentStyle: function () {
        var style = this.queryCommandValue('formatBlock') || 'p';
        // because IE is stupid;
        if (style === 'Normal') {
            style = "p";
        }
        else if (style.indexOf('Heading') !== -1) {
            style = style.replace('Heading ', 'h');
        }
        return style;
    }.property('recomputeEditorState'),



    formatBlock: function (format) {
        this.execCommand('formatBlock', null, format.value);
    },


    invokeCommand: function (source) {
        this.focus();
        
        var command = source.get('command');
        if (command) {
            command.execute(source, this);
        }
        this.notifyPropertyChange('recomputeEditorState');
    },



}
