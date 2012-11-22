// ==========================================================================
// Project:   SproutCore WYSIWYG
// Copyright: ©2012 Matygo Educational Incorporated operating as Learndot
// Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals SproutCoreWysiwyg */

describe('SC.WYSIWYGEmbedVideoCommand', function() {

	var command = SC.WYSIWYGEmbedVideoCommand.create();

	it("Should Propertly a youtube url", function() {
		expect(command._extractYoutubeId("http://www.youtube.com/sandalsResorts#p/c/54B8C800269D7C1B/0/FJUvudQsKCM")).toEqual("FJUvudQsKCM");
		expect(command._extractYoutubeId("http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo")).toEqual("1p3vcRhsYGo");
		expect(command._extractYoutubeId("http://youtu.be/NLqAF9hrVbY")).toEqual("NLqAF9hrVbY");
		expect(command._extractYoutubeId("http://www.youtube.com/embed/NLqAF9hrVbY")).toEqual("NLqAF9hrVbY");
		expect(command._extractYoutubeId("https://www.youtube.com/embed/NLqAF9hrVbY")).toEqual("NLqAF9hrVbY");
		expect(command._extractYoutubeId("http://www.youtube.com/v/NLqAF9hrVbY?fs=1&hl=en_US")).toEqual("NLqAF9hrVbY");
		expect(command._extractYoutubeId("http://www.youtube.com/watch?v=NLqAF9hrVbY")).toEqual("NLqAF9hrVbY");
		expect(command._extractYoutubeId("http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo")).toEqual("1p3vcRhsYGo");
		expect(command._extractYoutubeId("http://www.youtube.com/ytscreeningroom?v=NRHVzbJVx8I")).toEqual("NRHVzbJVx8I");
		expect(command._extractYoutubeId("http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo")).toEqual("1p3vcRhsYGo");
		expect(command._extractYoutubeId("http://www.youtube.com/watch?v=JYArUl0TzhA&feature=featured")).toEqual("JYArUl0TzhA");
	});

	it("Should Propertly a vimeo url", function() {
		// test
		expect(command._extractVimeoId("http://vimeo.com/42480177")).toEqual("42480177");
	});

	it("Should extract a wistia url", function() {
		expect(command._extractWistiaId("http://fast.wistia.com/embed/medias/46da5e2eb5")).toEqual("46da5e2eb5");
	});

	it("Should generate the proper preview", function() {
		command.set('url', "http://vimeo.com/42480177");
		expect(command.preview(400)).toEqual(command._vimeoString.fmt({
			id: 42480177,
			width: 400,
			height: Math.round(400 / 1.778)
		}));
	});

	it("Should generate the proper preview for youtube", function() {
		command.set('url', "http://www.youtube.com/v/NLqAF9hrVbY?fs=1&hl=en_US");
		expect(command.preview(400)).toEqual(command._youtubeString.fmt({
			id: "NLqAF9hrVbY",
			width: 400,
			height: Math.round(400 / 1.778)
		}));
	});

	it("Should generate the proper preview for wistia", function() {
		command.set('url', "http://fast.wistia.com/medias/46da5e2eb5");
		expect(command.preview(400)).toEqual(command._wystiaString.fmt({
			id: "46da5e2eb5",
			width: 400,
			height: Math.round(400 / 1.778)
		}));
	});

	it("Cancel by clearing the url", function() {
		command.set('url', "http://fast.wistia.com/medias/46da5e2eb5");
		command.cancelCommand();
		expect(command.get('url')).toEqual('');
	});

});