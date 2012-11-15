/**
 * @class
 * 
 * Stolen from the static content view
 * 
 */
SC.WYSIWYGStaticValueView = SC.View.extend(SC.StaticLayout, SC.ContentValueSupport, {
	classNames: [ 'sc-static-content-view', 'sc-wysiwyg-static-value-view' ],
	displayProperties: [ 'value' ],

	// ..........................................................
	// PROPERTIES
	//

	value: "<p><br /></p>",

	calculatedHeight: function() {
		return this.$()[0].scrollHeight;
	}.property('value'),

	// ..........................................................
	// METHODS
	//

	/**
	 * Because SproutCore has no way of knowing when the size of the content
	 * inside a StaticContentView has changed, you should call this method
	 * whenever an event that may change the size of the content occurs.
	 * 
	 * Note that if you change the content property, this will be recalculated
	 * automatically.
	 */
	valueLayoutDidChange: function() {

		this.adjust('height', this.get('frame').height / 2);

		this._viewFrameDidChange();

		this.invokeLast(function() {
			this.notifyPropertyChange('calculatedHeight');
		});
	},

	// ..........................................................
	// INTERNAL SUPPORT
	//

	/**
	 * @private Disable SproutCore management of view positioning.
	 */
	useStaticLayout: YES,

	/**
	 * @private Overrides SC.View's frame computed property, and returns a value
	 *          from the DOM. This value is cached to improve performance.
	 * 
	 * If the size of the content inside the view changes, you should call
	 * contentLayoutDidChange().
	 * 
	 * @property
	 */
	frame: function() {
		var layer = this.get('layer'), rect;

		if (!layer) return {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};

		if (layer.getBoundingClientRect && !SC.browser.isIE8OrLower) {
			rect = layer.getBoundingClientRect();

			return {
				x: 0,
				y: 0,
				width: rect.width,
				height: rect.height
			};
		} else {
			return {
				x: 0,
				y: 0,
				width: layer.clientWidth,
				height: layer.clientHeight
			};
		}
	}.property('value').cacheable(),

	/**
	 * @private Recalculate content frame if our parent view resizes.
	 */
	parentViewDidResize: function() {
		this.valueLayoutDidChange();
	},

	/**
	 * @private If the layer changes, make sure we recalculate the frame.
	 */
	didUpdateLayer: function() {
		this.valueLayoutDidChange();
	},

	/**
	 * @private Outputs the content property to the DOM.
	 * 
	 * @param {SC.RenderContext}
	 *            context
	 * @param {Boolean}
	 *            firstTime
	 */
	render: function(context, firstTime) {
		var content = this.get('value');
		context.push(content || '');
	},

	/** @private */
	touchStart: function(evt) {
		evt.allowDefault();
		return YES;
	},

	/** @private */
	touchEnd: function(evt) {
		evt.allowDefault();
		return YES;
	}

});
