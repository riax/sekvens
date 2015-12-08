# Sekvens v0.0.1
Sekvens is a basic animation library that has no DOM dependency. In fact it leaves the DOM manipulation to you. It works fine with most JavaScript libraries like React, Knockout, Backbone, JQuery etc.

It is written in TypeScript and currently has an AMD dependency.

[Basic examples ](http://riax.se/sekvens/basic.html)

[Advanced examples ](http://riax.se/sekvens/advanced.html)

## Examples
```javascript
var duration = 1000;
sekvens.from(0)
  .to(1000, duration)
  .on(function (value) {
    console.log(value);
  }).go();
```

```javascript
var duration = 2000;
sekvens.from(0)
  .to(1000, duration, sekvens.easeInOutQuint)
  .to(0, duration).on(function (value) {
    document.getElementById("basic-example-2").style.marginLeft = value + "px";
  }).go();
```

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
  }).go();
```
```javascript
var duration = 1000;
var element = document.getElementById("advanced-example-2");
var move = sekvens.from(0)
  .to(1000, duration)
  .to(0, duration).on(function (value) {
    element.style.marginLeft = value + "px";
  });

sekvens.chain(sekvens.chain(move, move), move).repeat(10).go();
```
