//
// extend Zepto with various functions
//
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
    var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
    endY = endY || (isAndroid ? 1 : 0);
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
}(jQuery));

//
// update scroll position on click
//
$(function () {
  var scrollPos = { prev: 0, active: 0, offset: 100 },
    itemSize = { width: 320, height: 400 };


  var cols;
  var positionItems = function () {
    // explicit positioning
    var totalWidth = $('#projectlist').parent().width();

    if (totalWidth >= 960) {
      cols = Math.floor(totalWidth/itemSize.width);
      itemSize.height = 400;
    } else {
      cols = 1;
      itemSize.height = 160;
    }

    $('#projectlist > li').each(function (i, elem) {
      var $this = $(this),
        index = $this.index();

      $this.css({
        position: 'absolute',
        left: (index%cols * itemSize.width) + 'px',
        top: (~~(index/cols) * itemSize.height) + 'px',
        float: 'none'
      });
    });
  };

  // removed for a fixed-width layout
  positionItems();
  // $(window).on('resize', positionItems);
  $(window).on('resize', debounce(positionItems, 100));

  // events
  $('#projectlist > li').click(function (ev) {
    // in case of .opentext links
    if ($(ev.target).prop('href'))
      return;

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
          $.scroll(scrollPos.prev, 75);
        }

        positionItems();
        active.removeClass('active').css('height', '');

        console.info('send', 'event', 'content-window', 'close', $(this).data('page'))
        ga && ga('send', 'event', 'content-window', 'close', $(this).data('page'));
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

      // moving this to css~~
      // items.slice(self.index() + 1).each(function (i) {
      //   var item = $(this);
      //   // console.log('expand', i, this);
      //   item.css('top', parseInt(item.css('top')) + (nextRowDelta + activeDelta));
      // });
      list.addClass('modal-active');

      console.info('send', 'event', 'content-window', 'open', self.data('page'))
      ga && ga('send', 'event', 'content-window', 'open', self.data('page'));

    }
  });

  // fancy.init();

  setTimeout(function () {
    $('#projects').addClass('animated');
  }, 500);
});

// track outbound links
$(function () {
  $(document).on('click', 'a[href^="http"]', function (ev) {
    console.info({
      eventCategory: 'outbound',
      eventAction: 'click',
      eventLabel: ev.target.href
    });
    ga && ga('send', 'event', {
      eventCategory: 'Outbound Link',
      eventAction: 'click',
      eventLabel: ev.target.href
    });
  })
})

// <https://davidwalsh.name/javascript-debounce-function>
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds.
 function debounce(func, wait, immediate) {
     var timeout;              //Why is this set to nothing?
     return function() {
         var context = this,
         args = arguments;
         clearTimeout(timeout);   // If timeout was just set to nothing, what can be cleared?
         timeout = setTimeout(function() {
              timeout = null;
              if (!immediate) func.apply(context, args);
         }, wait);
         if (immediate && !timeout) func.apply(context, args);  //This applies the original function to the context and to these arguments?
      };
 };
