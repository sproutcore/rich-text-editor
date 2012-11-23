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
		var last = this.$().children().last();
		var ret = 0;
		if (last) {
			var position = last.position();
			if (position) {
				ret = position.top + last.height();
			}
		}
		return ret;
	}.property('value'),

	imageDidLoad: function() {
		this.notifyPropertyChange('calculatedHeight');
	},

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
		this._viewFrameDidChange();
		this.invokeLast(function() {
			this.notifyPropertyChange('calculatedHeight');
		});
	},

	valueDidChange: function() {
		var width = this.get('frame').width;
		var $vimeoPlayer = this.$('.vimeo-player');
		$vimeoPlayer.attr('width', '100%');
		$vimeoPlayer.attr('height', Math.round($vimeoPlayer.width() * 0.56));

		var $youtubePlayer = this.$('.youtube-player');
		$youtubePlayer.attr('width', '100%');
		$youtubePlayer.attr('height', Math.round($youtubePlayer.width() * 0.56));

		var $youtubePlayer = this.$('.wistia-player');
		$youtubePlayer.attr('width', '100%');
		$youtubePlayer.attr('height', Math.round($youtubePlayer.width() * 0.56));

		var $images = this.$('img');
		$images.forEach(function(image) {
			var $image = SC.$(image);
			var widthAttr = $image.attr('width');
			if (widthAttr && parseInt(widthAttr.replace("px", '')) > (width * 0.90)) {
				$image.css({
					width: "90%",
					height: 'auto'
				});
			} else {
				$image.css({
					width: "auto",
					height: 'auto'
				});
			}
		});

		var self = this;
		this.$('img').forEach(function(image) {
			SC.Event.add(image, 'load', self, self.imageDidLoad);
		});

	}.observes('value', 'frame'),

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
