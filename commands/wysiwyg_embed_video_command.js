// ==========================================================================
// Project:   SproutCore WYSIWYG
// Copyright: ©2012 Matygo Educational Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_command');
sc_require('commands/wysiwyg_picker_command_support');
sc_require('panes/wysiwyg_video_picker_pane');

/**
 * @class
 * 
 * Embeds a Youtube or Vimeo link at the current location
 * 
 * TODO: Add a PILE of validation
 */
SC.WYSIWYGEmbedVideoCommand = SC.Object.extend(SC.WYSIWYGCommand, SC.WYSIWYGPickerCommandSupport, {

	commandName: 'embedVideo',

	/**
	 * @property {String} URL of the video to be embeded
	 */
	url: '',

	pickerPane: SC.WYSIWYGVideoPickerPane,

	commitCommand: function(original, controller) {
		original(controller);
		var insert = this.preview(400);
		if (insert) {
			controller.insertHtmlHtmlAtCaret(insert);
		}
		this.set('url', '');
	}.enhance(),

	cancelCommand: function(original) {
		this.set('url', '');
	}.enhance(),

	preview: function(width, height) {
		if (!width) width = 400;
		if (!height) height = Math.round(width / 1.778);
		return this._extractEmbedCode(width, height);
	},

	_extractEmbedCode: function(width, height) {
		var url = this.get('url'), ret = '', id = '';

		id = this._extractYoutubeId(url);
		if (id) ret = this._youtubeString;

		if (!ret) {
			id = this._extractVimeoId(url);
			if (id) ret = this._vimeoString;
		}

		if (!ret) {
			id = this._extractWistiaId(url);
			if (id) ret = this._wystiaString;
		}

		if (ret && id) {
			ret = ret.fmt({
				id: id,
				width: width,
				height: height
			});
		};
		return ret;
	},

	_vimeoString: '<iframe class="vimeo-player" src="https://player.vimeo.com/video/%{id}" width="%{width}px" height="%{height}px" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>',

	_youtubeString: '<iframe class="youtube-player" type="text/html" width="%{width}px" height="%{height}px" src="https://www.youtube.com/embed/%{id}" frameborder="0"></iframe>',

	_wystiaString: '<iframe class="wistia-player" width="%{width}px" height="%{height}px" src="https://app.wistia.com/embed/medias/%{id}" frameborder="0"></iframe>',

	_youtubeRegex: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i,

	_vimeoRegex: /vimeo.com\/(\d+)/i,

	_wistiaRegex: /https?:\/\/(.+)?(wistia\.com|wi\.st)\/((medias|embed|ifrane)\/)+(.*)/,

	_extractYoutubeId: function(url) {
		var id = '', youtubeId = url.match(this._youtubeRegex);
		if (youtubeId && youtubeId[1]) {
			id = youtubeId[1];
		}
		return id;
	},

	_extractVimeoId: function(url) {
		var vimeoId = this._vimeoRegex.exec(url), id = '';
		if (vimeoId && vimeoId[1]) {
			id = vimeoId[1];
		}
		return id;
	},

	_extractWistiaId: function(url) {
		var wistiaId = this._wistiaRegex.exec(url), id = '';
		if (wistiaId) {
			id = wistiaId[wistiaId.length - 1];
		}
		return id;
	}

});
SC.WYSIWYGCommandFactory.registerCommand(SC.WYSIWYGEmbedVideoCommand);
