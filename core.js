// ==========================================================================
// Framework:   SproutCoreWysiwyg
// Copyright: @2012 Joe Gaudet - joe@learndot.com.
// ==========================================================================
/*globals SC */
sc_require('wysiwyg_command');
SproutCoreWysiwyg = SC.Object.create(
/** @scope SproutcoreWysiwyg.prototype */
{

	NAMESPACE: 'SproutcoreWysiwyg',
	VERSION: '1.0.0',

	styles: [ {
		title: 'Paragraph',
		value: 'p',
		height: 20
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
	} ]
});
