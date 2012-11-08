# SproutCore WYSIWYG Editor

A basic WYSIWYG editor for SproutCore.

![ScreenShot](https://raw.github.com/joegaudet/sproutcore-wysiwyg/master/screen-shot.png)

## Features

- Basic WYSIWYG editing (bold, italic, underline, ul, ol, alignment, indenting, linking, block formating)
- Basic image inserting
- Basic video (youtube/vimeo) embeding
- Compatible with the SC view layer (unlike all other editors)
- Extensible

## Basic Usage
You can add the SproutCore WYSIWYG to your existing views the same as you would any control:

	MYApp.MyView = SC.View.extend({
		childViews: ['editor'],
		
		editor: SC.WYSIWYGView.extend({
			valueBinding: 'MyApp.myController.content'
		})
	})

## Specifying Commands 
To specify which commands you would like to be available inside the toolbar, simply add them to the commands list.

	MYApp.MyView = SC.View.extend({
		childViews: ['editor'],
		
		editor: SC.WYSIWYGView.extend({
			commands: [ 'link', 'bold', 'italic', 'underline'],
			valueBinding: 'MyApp.myController.content'
		})
	})

## Add Commands
To create a custom command, create an object which mixes in SC.WYSIWYGCommand and add it to the command factory.

	MyApp.MyCommand = SC.Object.extend(SC.WYSIWYGCommand, {
		commandName: 'myMagicCommand',
		execute: function(source, controller) {
			// do some stuff
		}
	});
	SC.WYSIWYGCommandFactory.registerCommand(MyApp.MyCommand);

Once it is registered with the command factory, you can simply add it to the command list in the WYSIWYGView.

	MYApp.MyView = SC.View.extend({
		childViews: ['editor'],
		
		editor: SC.WYSIWYGView.extend({
			commands: [ 'link', 'bold', 'italic', 'underline', 'myMagicCommand'],
			valueBinding: 'MyApp.myController.content'
		})
	})

## Controller API

The SC.WYSIWYGController controller provides a facade for interacting with the editor, which is a thin wrapper around an iframe with edit mode enabled.

To determine if a command has been executed against the current selection use the following command (detailed: https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html):

	queryCommandState: function(command)

To determine the command value (if available) of the current selection:

	queryCommandValue: function(command)

To execute and arbitrary command against the editor:

	execCommand: function(commandName, showDefaultUI, value)

To insert arbitrary html at the current location:

	insertHtmlHtmlAtCaret: function(html)
	

## TODOs

- Add some tests boy howdy
- refine the video embed command
- refine the image embed command
- refine the link command
- full screen support ?
- image / file uploading (probably with the sproutcore-fileupload framework)
- clean up the way the styles are enumerated / displayed (kindof brittle with the css + js views)