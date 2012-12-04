// ==========================================================================
// Project:   SproutCore WYSIWYG
// Copyright: ©2012 Matygo Educational Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals SC */
SproutCoreWysiwyg = SC.Object.create(
/** @scope SproutcoreWysiwyg.prototype */
{

	NAMESPACE: 'SproutcoreWysiwyg',
	VERSION: '1.0.2',

	styles: [ {
		title: 'Paragraph',
		value: 'p',
		height: 28
	}, {
		title: '<h1>Heading 1</h1>',
		value: 'h1',
		height: 40
	}, {
		title: '<h2>Heading 2</h2>',
		value: 'h2',
		height: 35
	}, {
		title: '<h3>Heading 3</h3>',
		value: 'h3',
		height: 35
	}, {
		title: '<h4>Heading 4</h4>',
		value: 'h4',
		height: 30
	}, {
		title: '<h5>Heading 5</h5>',
		value: 'h5',
		height: 24
	}, {
		title: '<h6>Heading 6</h6>',
		value: 'h6',
		height: 20
	} ],

	adjustContentSizes: function(view) {
		var width = view.get('frame').width;
		var $vimeoPlayer = view.$('.vimeo-player');
		$vimeoPlayer.attr('width', '100%');
		$vimeoPlayer.attr('height', Math.round($vimeoPlayer.width() * 0.56));

		var $youtubePlayer = view.$('.youtube-player');
		$youtubePlayer.attr('width', '100%');
		$youtubePlayer.attr('height', Math.round($youtubePlayer.width() * 0.56));

		var $youtubePlayer = view.$('.wistia-player');
		$youtubePlayer.attr('width', '100%');
		$youtubePlayer.attr('height', Math.round($youtubePlayer.width() * 0.56));

		var $images = view.$('img');
		$images.forEach(function(image) {
			var $image = SC.$(image);
			var widthAttr = $image.attr('width');
			if (widthAttr && parseInt(widthAttr.replace("px", '')) > (width * 0.90)) {
				$image.css({
					width: "90%",
					height: 'auto'
				});
			}
			else {
				$image.css({
					width: "auto",
					height: 'auto'
				});
			}
		});
	}
});
