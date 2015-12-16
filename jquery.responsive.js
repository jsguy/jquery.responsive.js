/* 
    jquery responsive - make elements responsive, by dynamically adding class names to them based on width.

    Copyright (C) 2015 jsguy

    https://github.com/jsguy/jquery.responsive.js

    MIT Licensed http://en.wikipedia.org/wiki/MIT_License
*/
(function($){
    var defaultOptions = {
            baseClassName: "responsive",
            prefixClasses: false,
            prefixSeparator: "-",
            addBaseClassNameToElement: true,
            applyStepClasses: true,
            step: 32,
            start: 128,
            end: 960,
            //  Name: min, max - use null for no min/max, eg:
            //  desktop: {min: 960}
            breaks: {}
        },
        //  Shortcur for prefixing classnames if required
        pf = function(className, options){
            return options.prefixClasses?
                options.baseClassName + options.prefixSeparator + className:
                className;
        },
        applyClasses = function ($el, width, options) {
            if(options.addBaseClassNameToElement) {
                $el.addClass(options.baseClassName);
            }

            //  Remove any old classes
            removeClasses($el, options);

            $.each(options.breaks, function (key, o) {
                var className = pf(key, options);

                if (!((typeof o.min !== "undefined" && width < o.min) || (typeof o.max !== "undefined" && width > o.max))) {
                    $el.addClass(className);
                }
            });

            if(options.applyStepClasses) {
                for(var i = options.start; i < options.end + 1; i += options.step) {
                    if(width > i) {
                        $el.addClass(pf("gt-" + i, options));
                    }
                    if(width < i) {
                        $el.addClass(pf("lt-" + i, options));
                    }
                }
            }
        },
        removeClasses = function($el, options){
            $.each(options.breaks, function (key, o) {
                var className = pf(key, options);

                //  Remove any old classes
                $el.removeClass(className);
            });
            if(options.applyStepClasses) {
                //  Remove old gt/lt classes
                $el.removeClass(function(index, css){
                    //  Create regex that optionally uses prefixed classes
                    var classReg = new RegExp("(^|\\s)("+pf("lt", options)+"|"+pf("gt", options)+")-\\d+\\S+", "g");
                    return (css.match(classReg) || []).join(' ');
                });
            }
        },
        watchList = [],
        addWatch = function($el, options){
            watchList.push({
                $el: $el,
                options: options,
                width: $el.innerWidth()
            });
        },
        removeWatch = function($el){
            $.each(watchList, function(idx, watch){
                if(watch.$el.is($el)) {
                    watchList.splice(idx,1);
                    return;
                }
            });
        },
        getWatch = function($el){
            var myWatch;
            $.each(watchList, function(idx, watch){
                if(watch.$el.is($el)) {
                    myWatch = watch;
                    return false;
                }
            });
            return myWatch;
        },
        getDataOptions = function($el, args){
            var data = $el.data(args? args.baseClassName || defaultOptions.baseClassName: defaultOptions.baseClassName),
                options = {};

            if(data && data !== "") {
                try{
                    options = eval('('+data+')');
                } catch(ex){
                    window.console && window.console.warn("jquery.responsify options error: " +ex, $el);
                }
            }
            return options;
        },
        responsive = function($el, args) {
            args = args || {};
            var options = $.extend({}, defaultOptions, args);
            applyClasses($el, $el.innerWidth(), options);
            addWatch($el, options);
        },
        debounceTimeout = 500,
        watchElements = function() {
            $.each(watchList, function(idx, watch){
                if(watch.width !== watch.$el.innerWidth()) {
                    watch.width = watch.$el.innerWidth();
                    applyClasses(watch.$el, watch.width, watch.options);
                }
            });
            setTimeout(watchElements, debounceTimeout);
        };

    //  Run our watch method
    watchElements();

    $.fn.responsive = function(args){
        $(this).each(function(idx, el) {
            var $el = $(el),
                dataOptions = getDataOptions($el, args);

            if(dataOptions){
                args = $.extend({}, dataOptions, args);
            }

            responsive($el, args);
        });
    };

    $.fn.unresponsive = function(){
        $(this).each(function(idx, el) {
            var $el = $(el),
                watch = getWatch($el);
            if(watch) {
                removeWatch($el);
                removeClasses($el, watch.options);
                if(watch.options.addBaseClassNameToElement) {
                    $el.removeClass(watch.options.baseClassName);
                }
            }
        });
    };

    //  Find all data-responsive elements and watch them
    $(function(){
        $("[data-" + defaultOptions.baseClassName + "]").each(function(idx, el){
            var $el = $(el),
                options = getDataOptions($el);
            $el.responsive(options);
        });
    }) 

}(jQuery));