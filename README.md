# jquery.responsive.js

This plugin allows you to make elements responsive, by dynamically adding class names to them based on width.

Example: http://jsguy.github.io/jquery.responsive.js/

## Usage

Include jQuery and jquery.responsive.js

```javascript
<script src="//code.jquery.com/jquery-1.10.2.js"></script>
<script src="//cdn.rawgit.com/jsguy/jquery.responsive.js/master/jquery.responsive.min.js"></script>
```

Then initialise your element like so:

```html
<div data-responsive>...</div>
```

Your element will now have responsive classnames applied, based on it's width.
For example if the element is larger than 128px, it will have "gt-128" as a class name, and if it is smaller than 192px in width, it will have "lt-192" as a class, plus anything in between, with steps of 32px up to lt-960. For example, say you have:

```html
<style>
.me { width: 250px; }
</style>
<div class="me" data-responsive></div>
```

Then the following classnames will be applied to the DIV:

```html
<div class="me responsive gt-128 gt-160 gt-192 gt-224 lt-256 lt-288 lt-320 lt-352 lt-384 lt-416 lt-448 lt-480 lt-512 lt-544 lt-576 lt-608 lt-640 lt-672 lt-704 lt-736 lt-768 lt-800 lt-832 lt-864 lt-896 lt-928 lt-960"></div>
```

Now you can use those class names to style your responsive content to within 32px accuracy!

You can pass in options like so:

```html
<div data-responsive="{step: 16}">...</div>
```

This will change the steps to 16px at a time for the class names.

You can also initialise elements diectly with javascript:

```javascript
$(document.body).responsive({step: 16});
```

This is useful, if you just want to emulate media queries, (eg: for IE8), or you have a single element that you want to make responsive, eg: a widget.

You can pass the following options to `.responsive()` or via `data-responsive`:

* **baseClassName** - _string_ for a classname to prefix, you must also set prefixClasses to true, default value is "responsive"
* **prefixClasses** - _boolean_ to set if we prefix all classnames with baseClassName, default is false
* **prefixSeparator** - _string_ to set what to separate the prefix class names, default is "-"
* **addBaseClassNameToElement** - _boolean_ to choose if we add the baseClassName to our responsive element, default is true
* **applyStepClasses** - _boolean_ to see if we add the stepped class names, ie: gt-NUMBER, lt-NUMBER, default is true
* **step** - _integer_ for how many pixels in between each step in step class names, default is 32
* **start** - _integer_ for what width to start applying class names - default is 128
* **end** - _integer_  for what width to stop applying class names, default is 960
* **breaks** - _object_ with custom breaks, default is {}

### Custom breaks

You can apply custom break class names, by specifying a `breaks` option like so:

```javascript
breaks: {
    "big": {
        min: 490
    }
}
```

This will add the classname "big" to your element when it is at least 490px wide.

## Use cases

There are a few different use cases where this library might be useful:

* You want to make an element responsive, as opposed to using media queries which respond only to screen size
```javascript
$('.me').responsive();
```
```css
.me.gt320 {color: #f8f8f8}
```

* You want to support IE8, (which doesn't honour media queries) - simply prefix the  body tag, and you can use the responsive class names
```javascript
$(document.body).responsive();
```
```css
body.gt320 {font-size: 1.1rem}
```

* You already have a custom set of responsive classes, but want control over when they are applied
```javascript
$(document.body).responsive({
    breaks: {
        "short": {
            max: 320
        },
        "tall": {
            min: 321,
            max: 960
        },
        "grande": {
            min: 961,
            max: 1280
        },
        "venti": {
            min: 1281
        }
    }
});
```
```css
body.venti {font-size: 20rem}
```


