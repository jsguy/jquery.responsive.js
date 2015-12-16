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

            $.each(options.breaks, function (key, o) {
                var className = pf(key, options);

                //  Remove any old classes
                $el.removeClass(className);

                if (!((typeof o.min !== "undefined" && width < o.min) || (typeof o.max !== "undefined" && width > o.max))) {
                    $el.addClass(className);
                }
            });

            if(options.applyStepClasses) {
                //  Remove old gt/lt classes
                $el.removeClass(function(index, css){
                    //  Create regex that optionally uses prefixed classes
                    var classReg = new RegExp("(^|\\s)("+pf("lt", options)+"|"+pf("gt", options)+")-\\d+\\S+", "g");
                    return (css.match(classReg) || []).join(' ');
                });

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
            responsive($(el), args);
        });
    };

    $.fn.unresponsive = function(){
        $(this).each(function(idx, el) {
            removeWatch($(el));
        });
    };

    //  Find all data-responsive elements and watch them
    $(function(){
        $("[data-" + defaultOptions.baseClassName + "]").each(function(idx, el){
            var $el = $(el),
                data = $el.data(defaultOptions.baseClassName),
                options = {};

            if(data && data !== "") {
                try{
                    var options = eval('('+data+')');
                } catch(ex){
                    window.console && window.console.warn("jquery.responsify options error: " +ex, $el);
                }
            }
            $el.responsive(options);
        });
    }) 

}(jQuery));