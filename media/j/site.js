(function($) {
    $('.masterTooltip').hover(function() {
        var title = $(this).attr('title');
        $(this).data('tipText', title).removeAttr('title');
        $('<p class="tooltip"></p>').text(title).appendTo('body').fadeIn('slow');
        $('<p class="tiparrow"></p>').appendTo('.tooltip').fadeIn('slow')
    }, function() {
        $(this).attr('title', $(this).data('tipText'));
        $('.tooltip').remove()
    }).mousemove(function(e) {
        var mousex = e.pageX + 30;
        var mousey = e.pageY + 20;
        $('.tooltip').css({
            top: mousey,
            left: mousex
        })
    });
    var container, parts, windowHeight, leftMargin, finalHeadingPos, heading, documentHeight;
    var DISTANCE = 2000,
        COMPETENT = (!$.browser.msie || $.browser.version > 7);

    function init() {
        container = $('#parts');
        parts = container.find('img').not('#img-002_s1');
        windowHeight = $(window).height();
        $('#header').css('height', windowHeight - 300);
        $('#footer').css('height', Math.max(windowHeight / 2, $('#footer .inner').height()) + 'px');
        leftMargin = $('#header').offset().left;
        heading = $('#header h1');
        finalHeadingPos = windowHeight / 2 - heading.height() - 50;
        documentHeight = $('body').height();
        heading.css({
            position: 'fixed',
            top: 0,
            left: leftMargin + 'px'
        });
        var threshold = container.offset().top - windowHeight / 3;
        var count = parts.length;
        parts.each(function(i) {
            var me = $(this),
                posLeft = (parseInt(me.css('marginLeft')) + me.width() / 2) / container.width(),
                posTop = (parseInt(me.css('marginTop')) + me.height() / 2) / container.height();
            $(this).data('coords', {
                top: DISTANCE * posTop,
                left: DISTANCE * (posLeft - 0.5) * 4,
                origLeft: posLeft,
                origTop: posTop,
                angle: (posLeft > 0.5 ? -50 : 1) * Math.round(parseInt(me.css('marginTop')) / container.height() * 60 + 0),
                threshold: threshold + parseInt(me.css('marginTop'))
            })
        });
        parts.each(function() {
            var part = $(this),
                origLeft, origTop;
            part.draggable({
                start: function() {
                    part.data('moved', true)
                },
                scroll: true,
                stop: function() {
                    part.css({})
                }
            })
        })
    };

    function ease(value, max) {
        return Math.sin((value / max - 1) * Math.PI / 2) * max + max
    };
    var locked = false;

    function position() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop >= documentHeight - windowHeight - 10) {
            locked = true;
            $('#footer input.text').focus()
        } else if (scrollTop < 10 && locked) {
            locked = false;
            parts.each(function(i) {
                var coords = $(this).data('coords');
                $(this).stop().animate({
                    top: coords.top + 'px',
                    left: coords.left + 'px'
                }, 1000)
            })
        }
        if (locked) {
            parts.css({
                top: 0,
                left: 0,
                '-webkit-transform': 'rotate(0)',
                '-moz-transform': 'rotate(0)'
            })
        } else {
            parts.each(function(i) {
                var coords = $(this).data('coords'),
                    factor = Math.max(0, coords.threshold - scrollTop) / coords.threshold,
                    easedFactor = ease(factor, 0.5),
                    deg = Math.round(coords.angle * easedFactor),
                    rotate = 'rotate(' + deg + 'deg)';
                if ($(this).data('moved')) {
                    var func = 'css';
                    $(this).data('moved', false)
                } else {
                    var func = 'css'
                }
                $(this).stop()[func]({
                    top: coords.top * easedFactor + 'px',
                    left: coords.left * easedFactor + 'px',
                    '-webkit-transform': rotate,
                    '-moz-transform': rotate
                })
            })
        }
        var headingFactor = ease(scrollTop / (documentHeight - windowHeight), 1);
        heading.css({
            top: finalHeadingPos * Math.max(headingFactor * 4 - 3, 0) + 'px'
        });
        $('#footer .inner').css({
            top: 20 * ease(documentHeight - windowHeight - scrollTop, windowHeight) + 'px'
        })
    };

    function touchInit() {};
    $(function() {
        if ($('body').hasClass('home')) {
            $('#footer').css({
                height: $('#footer').height() + 'px'
            });
            $('#footer .inner').css({
                position: 'absolute',
                width: $('#footer').width() + 'px',
                top: 0,
                left: 0
            });
            if (Modernizr.touch) {
                touchInit()
            } else {
                init();
                $(window).resize(function() {
                    init();
                    if (COMPETENT) {
                        position()
                    }
                });
                if (COMPETENT) {
                    $(window).scroll(position);
                    position()
                }
            }
        }
    });
    $(window).load(function() {
        $('#header .loading').fadeOut(300, function() {
            if ($(window).scrollTop() < 50) {
                $('#parts').css({
                    top: ($(window).scrollTop() + 50) + 'px',
                    opacity: 1
                }).animate({
                    top: 0
                }, 300)
            } else {
                $('#parts').animate({
                    opacity: 1
                }, 300)
            }
            $('#header .content').fadeIn(300)
        });
        $('body').removeClass('loading')
    })
})(jQuery);