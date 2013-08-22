;(function($) {
	var interpolate = function (source, target, shift) { 
		return (source + (target - source) * shift); 
	};

	var easing = function (pos) { 
	    // return (-Math.cos(pos * Math.PI) / 2) + .5;
	    
	    // taken from jQuery easing easeInOutQuad
	    var t = pos, b = 0, c= 1, d= 1;
	    if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	};

	$.scroll = function(endY, duration, easingF) {
		endY = endY || ($.os.android ? 1 : 0);
		duration = duration || 200;
		(typeof easingF === 'function') && (easing = easingF);

		var startY = window.pageYOffset,
			startT  = Date.now(),
			finishT = startT + duration;

		var animate = function() {
			var now = +(new Date()),
				shift = (now > finishT) ? 1 : (now - startT) / duration;

			window.scrollTo(0, interpolate(startY, endY, easing(shift)));

			(now > finishT) || setTimeout(animate, 15);
		};
	
		animate();
	};
}(Zepto));










$(function () {
	var scrollPos = { prev: 0, active: 0, offset: 100 },
		ITEM_SIZE = { width: 320, height: 400 };


	var cols;
	var positionItems = function () {
		// explicit positioning
		
		$('li', '#projectlist').each(function (i, elem) {
			var $this = $(this),
				index = $this.index(),
				totalWidth = $this.parent().width();

			cols = Math.floor(totalWidth/ITEM_SIZE.width);

			$this.css({
				position: 'absolute',
				left: (index%cols * ITEM_SIZE.width),
				top: (~~(index/cols) * ITEM_SIZE.height) + 1, // bug in zepto: '0' means null, unsets css and won't animate
				float: 'none'
			});
		});
	};
	positionItems();
	$(window).on('resize', positionItems);

	// events
	$('li', '#projectlist').click(function () {
		var list = $('#projectlist');
		var items = list.children();
		var activeDelta = 300; // vertical movement for modal
		var nextRowDelta = 400; // ... for the rest of the children

		if (list.hasClass('modal-active')) {
			// reset all
			var active = items.filter('.active');
			if (active.length) { 
				if (active.index() % cols == 0) activeDelta = 0;
				if ((active.index()) + 1 % cols == 0) nextRowDelta = 0;

				if ($('body')[0].scrollTop == scrollPos.active) {
					$.scroll(scrollPos.prev, 500);
				}

				positionItems('li');
				// active.css('top', parseInt(active.css('top')) - activeDelta);
				// active.css('left', active.parent('ul').width()/2 - 450/2);
				// items.slice(active.index() + 1).each(function (i) {
				// 	var item = $(this);
				// 	item.css('top', parseInt(item.css('top')) - (nextRowDelta + activeDelta));
				// });
				active.removeClass('active').css('height', '');
			}
			list.removeClass('modal-active');

		} else {
			// make this item active
			var self = $(this).addClass('active');
			
			if (self.index() % cols == 0) activeDelta = 0;
			if ((self.index() + 1) % cols == 0) nextRowDelta = 0;
			
			self.css('top', parseInt(self.css('top')) + activeDelta);
			self.css('left', self.parent('ul').width()/2 - 960/2);

			scrollPos.prev = $('body')[0].scrollTop;
			scrollPos.active = activeDelta + self.offset().top - $(window).height()/2 + 200;
			scrollPos.active = Math.max(0, ~~scrollPos.active);
			$.scroll(scrollPos.active, 500);
			// self.one('transitionEnd webkitTransitionEnd', function (ev) { $('body')[0].scrollTop = self.offset().top; });

			items.slice(self.index() + 1).each(function (i) {
				var item = $(this);
				// console.log('expand', i, this);
				item.css('top', parseInt(item.css('top')) + (nextRowDelta + activeDelta));
			});
			list.addClass('modal-active');
		}
	});	

	// fancy.init();

	setTimeout(function () {
		$('#projects').addClass('animated');
	}, 500);
});