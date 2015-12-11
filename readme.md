# Sekvens
Sekvens is a basic JavaScript animation library that has no DOM dependency. In fact it leaves the DOM manipulation to you. It works fine with most libraries like React, Knockout, Backbone, JQuery etc.

Sekvens is written in TypeScript and works with AMD, CommonJS and in the global namespace.

[Basic examples ](http://riax.se/sekvens/examples/basic.html)

[Advanced examples ](http://riax.se/sekvens/examples/advanced.html)

### Install with bower package manager
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
    console.log(value);
  }).go();
```

### Animate left 1000 px in 2000 ms using the easing "easeInOutQuint".
```javascript
var duration = 2000;
sekvens.from(0)
  .to(1000, duration, sekvens.easeInOutQuint)
  .to(0, duration).on(function (value) {
    document.getElementById("basic-example-2").style.marginLeft = value + "px";
  }).go();
```

### Use of to() multiple times and wait() to pause. The repeat() command will repeat forever. Repeat also takes an integer as an argument like repeat(5) will repeat 5 times.
```javascript
sekvens.from(0)
  .to(200, 250)
  .wait(500)
  .to(500, 250)
  .wait(500)
  .to(0, 100)
  .repeat()
  .on(function (value) {
    document.getElementById("basic-example-5").style.marginLeft = value + "px";
  }).done(function() {
		console.log("Animation finished");
  }).go();
```

### Use chain() to chain multiple animations together and the they will run in sequence. The repeat(2) command will repeat move 2 times and the repeat(10) command will repeat the whole chained sequence 10 times. Multiple chains can be nested.
```javascript
var duration = 1000;
var element = document.getElementById("advanced-example-2");
var move = sekvens.from(0)
  .to(1000, duration)
  .repeat(2)
  .to(0, duration).on(function (value) {
    element.style.marginLeft = value + "px";
  });

sekvens.chain(sekvens.chain(move, move), move).repeat(10).go();
```
### Easings can be applied as an argument to the to() function. "swing" is the default if no argument is specified.
```javascript
sekvens.from(0).to(1000, duration, sekvens.easeInOutQuint).on(function (value) {
  console.log(value);
}).go();

sekvens.linear
sekvens.swing
sekvens.easeOutQuad
sekvens.easeInQuad
sekvens.easeInOutQuad
sekvens.easeInCubic
sekvens.easeOutCubic
sekvens.easeInOutCubic
sekvens.easeInQuart
sekvens.easeOutQuart
sekvens.easeInOutQuart
sekvens.easeInQuint
sekvens.easeOutQuint
sekvens.easeInOutQuint

```

### The ES6 (Babel/TypeScript) syntax is slightly nicer :)

```javascript
sekvens.from(0)
  .to(5000, 100)
  .on(value => console.log(value))
  .go();
```