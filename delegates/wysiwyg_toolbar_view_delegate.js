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
 * Responsible for creating toolbar controls for command objects
 */
SC.WYSIWYGToolbarViewDelegate = {

    isWYSIWYGToolbarViewDelegate: YES,


    toolbarViewCreateControlForCommandNamed: function (toolbarView, commandName) {
        if (commandName === 'separator') {
            var separatorView = this.toolbarViewSeparator();
            return toolbarView.createChildView(separatorView);
        }

        var command = SC.WYSIWYGCommandFactory.commandFor(commandName),
            controlView;

        if (command) {
            controlView = this.toolbarViewButtonForCommand(toolbarView, commandName, command);

            if (controlView) {
                controlView = this[commandName] = toolbarView.createChildView(controlView);
                if (SC.ButtonView.hasSubclass(controlView.constructor)) {
                    controlView.adjust('height', SC.Theme.find(SC.defaultTheme).buttonRenderDelegate[SC.REGULAR_CONTROL_SIZE].height);
                }
            }
            else {
                SC.error('WYSIWYGToolbarViewDelegate: Could not createView: ' + commandName + ' no class was found.');
            }
        }
        else {
            SC.error('WYSIWYGToolbarViewDelegate: Could not find command for the commandName: ' + commandName);
        }
        
        
        return controlView;
    },

    toolbarViewButtonForCommand: function (toolbarView, key, command) {
        var editor = this.get('editor'),   
            exampleView = command.get('exampleView');

        
        var width = exampleView.prototype.layout.width || 30,
            buttonClass = exampleView.extend({
            layout: {
                width: width,
                height: SC.Theme.find(SC.defaultTheme).buttonRenderDelegate[SC.REGULAR_CONTROL_SIZE].height
            },
            icon: command.get('icon'),
            command: command,
            toolTip: command.get('toolTip'),
            target: this,
            action: 'invokeCommand',
            editor: editor,
            keyEquivalent: command.get('keyEquivalent'),

            init: function() {
                sc_super();
                if (this.editorStateDidChange) {
                    this.editor.addObserver('recomputeEditorState', this, 'editorStateDidChange');
                }
                
            },
            destroy: function() {
                if (this.editorStateDidChange) {
                    this.editor.removeObserver('recomputeEditorState', this, 'editorStateDidChange');
                }
                sc_super();
            },
        });
        return buttonClass;
    },

    toolbarViewSeparator: function () {
        var separator = SC.SeparatorView.extend({
            layout: { 
                top: 0, 
                bottom: 0, 
                height: SC.Theme.find(SC.defaultTheme).buttonRenderDelegate[SC.REGULAR_CONTROL_SIZE].height, 
                width: 3 }, 
            layoutDirection: SC.LAYOUT_VERTICAL, 
        });
        return separator;
    },


};
