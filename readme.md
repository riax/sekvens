# Sekvens
Sekvens is a basic ~5k (1.7k gzipped) JavaScript animation library that has no DOM dependency. In fact it leaves the DOM manipulation to you. It works fine with most libraries like React, Knockout, Backbone, JQuery etc. It also has support for basic 2D animations.

Sekvens is written in TypeScript and works with AMD, CommonJS and in the global namespace. TypeScript definition file is included.

[Basic examples ](http://riax.se/sekvens/examples/basic.html)

[Advanced examples ](http://riax.se/sekvens/examples/advanced.html)

[2D examples ](http://riax.se/sekvens/examples/point.html)

[Codepen example ](http://codepen.io/anon/pen/KVVPEy)

``` console
bower install sekvens
```

## Examples

### Animate from 0 to 1000 in 800 ms and print the result to the console. 
```javascript
var duration = 800;
sekvens.from(0)
  .to(1000, duration)
  .on(function (value) {
    /* 
      Use the "on" function to change the state of your animation. "On" will execute on every frame.
      E.g in ReactJS you will do setState({ whatEver: value }) or in KnockoutJS change
      an observable like whatEverObservable(value).
    */
    console.log(value); // prints 1,2,5,8 ... 999,100  
  }).go();
```

### Animate left 1000 px in 2000 ms using the easing "easeInOutQuint".
```javascript
var duration = 2000;
sekvens.from(0)
  .to(1000, duration, sekvens.easeInOutQuint) // Apply an easing function
  .to(0, duration)
  .on(function (value) {
    /* Here we change the margin of an entity through the standard DOM API */
    document.getElementById("basic-example-2").style.marginLeft = value + "px";
  }).go();
```

### Use of to(), wait() multiple times to build an animation sequence. Repeat will repeat the sequence. 
```javascript
sekvens.from(0)
  .to(200, 250)
  .wait(500) // "Wait" will pause the animation. Here we pause for 500 ms
  .to(500, 250)
  .wait(500)
  .to(0, 100)
  .settings({ defaultEasing: sekvens.easeInOutQuint }) // change the default easing function.
  .repeat() // Repeat forever
  .on(function (value) {
    document.getElementById("basic-example-5").style.marginLeft = value + "px";
  }).done(function() {
		console.log("Animation finished");
  }).go();
```

### Sekvens supports chaining of multiple animations to run them in sequence. Multiple chains can be nested.
```javascript
var duration = 1000;
var element = document.getElementById("advanced-example-2");
var move = sekvens.from(0)
                  .to(1000, duration)
                  .repeat(2) // Repeat two times
                  .to(0, duration).on(function (value) {
                    element.style.marginLeft = value + "px";
                  });

var innerChain = sekvens.chain(move, move);
sekvens.chain(innerChain, move) // Nested chaining
       .repeat(10).go(); 
```
### Easings can be applied as an argument to the to() function. "easeInOutCubic" is the default if no argument is specified.
```javascript
sekvens.from(0)
       .to(1000, duration, sekvens.easeInOutQuint)
       .on(function (value) {
          console.log(value);
        }).go();

// Available easings
sekvens.linear
sekvens.swing
sekvens.easeOutQuad
sekvens.easeInQuad
sekvens.easeInOutQuad
sekvens.easeInCubic
sekvens.easeOutCubic
sekvens.easeInOutCubic // The default easing
sekvens.easeInQuart
sekvens.easeOutQuart
sekvens.easeInOutQuart
sekvens.easeInQuint
sekvens.easeOutQuint
sekvens.easeInOutQuint
```

### 2D animation
```javascript
var element = document.getElementById("point-example-1");
sekvens.fromPoint({ x: 0, y: 0 }) // Use function fromPoint() instead of from()
  .to({ x: 0, y: 300 }, 2000)
  .to({ x: 300, y: 300 }, 2000)
  .to({ x: 0, y: 0 }, 2000)
  .repeat()
  .on(function (point) {
    element.style.left = point.x + "px";
    element.style.top = point.y + "px";
  }).go();
```

### The ES6 (Babel/TypeScript) syntax is slightly nicer :)

```javascript
sekvens.from(0)
  .to(5000, 100)
  .on(value => console.log(value))
  .go();
```

## Setup 
### Global namespace
Just reference sekvens-global.js or sekvens-global.min.js and use the global variable "sekvens".
```html
<script src="sekvens-global.min.js"></script>
<script>
  sekvens.from(0).to(100, 1000).on(function(value){ console.log(value) }).go();
</script>
```
### UMD (AMD & CommonJS)
Just reference sekvens.js or sekvens-min.js for UMD
```javascript
// AMD
require(["sekvens-min"], function (sekvens) {
  sekvens.from(0).to(100, 1000).on(function(value){ console.log(value) }).go();
});

// CommonJs
var sekvens = require("sekvens-min");
sekvens.from(0).to(100, 1000).on(function(value){ console.log(value) }).go();
```