/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_command');
sc_require('commands/wysiwyg_picker_command_support');
sc_require('panes/wysiwyg_image_picker_pane');

/**
  @class
  
  Inserts an image at the current location
  
  TODO: Support Image size
*/
SC.WYSIWYGInsertImageCommand = SC.Object.extend(SC.WYSIWYGCommand, SC.WYSIWYGPickerCommandSupport, {

	commandName: 'insertImage',

	keyEquivalent: 'ctrl_shift_i',

	/**
	  @property {String} URL the image to be inserted
	*/
	url: '',

	width: 0,

	height: 0,

	pickerPane: SC.WYSIWYGImagePickerPane,

	callback: null,

	sizeImageFromURL: function(callback) {
		this.callback = callback;
		var url = this.get('url');
		if (url) {
			SC.imageQueue.loadImage(url, this, 'imageDidLoad');
		}
	},

	commitCommand: function(original, editor) {
		original(editor);
		var url = this.get('url');
		if (url) {
			editor.insertHtmlAtCaret('<img src="%@" style="width: %@px; height: %@px" />'.fmt(url, this.width, this.height));
		}
		this.set('url', '');
	}.enhance(),

	imageDidLoad: function(imageUrl, image) {
		this.width = image.width;
		this.height = image.height;
		if (this.callback) {
			this.callback();
		}
	}

});

SC.WYSIWYGCommandFactory.registerCommand(SC.WYSIWYGInsertImageCommand);
