require(["../build/sekvens"], function (sekvens) {
  function advancedExample1() {
    var duration = 1000;
    var element = document.getElementById("advanced-example-1");
    var move = sekvens.from(0)
      .to(1000, duration, sekvens.easeInOutQuint)
      .to(0, duration).on(function (value) {
        element.style.marginLeft = value + "px";
      });

    var rotate = sekvens.from(0)
      .to(360, duration)
      .to(0, duration)
      .on(function (value) {
        element.style.transform = "rotate(" + value + "deg)";
      });

    sekvens.chain(move, rotate).repeat().go();
  }

  function advancedExample2() {
    var duration = 1000;
    var element = document.getElementById("advanced-example-2");
    var move = sekvens.from(0)
      .to(1000, duration)
      .to(0, duration).on(function (value) {
        element.style.marginLeft = value + "px";
      });

    var rotate = sekvens.from(0)
      .to(360, duration)
      .to(0, duration)
      .on(function (value) {
        element.style.transform = "rotate(" + value + "deg)";
      });

    sekvens.chain(move, rotate, move).repeat(10).go();
  }

  function advancedExample3() {
    var duration = 1000;
    var element = document.getElementById("advanced-example-3");
    var move = sekvens.from(0)
      .to(1000, duration)
      .to(0, duration).on(function (value) {
        element.style.marginLeft = value + "px";
      });
    var rotate = sekvens.from(0)
      .to(360, duration)
      .to(0, duration)
      .on(function (value) {
        element.style.transform = "rotate(" + value + "deg)";
      });
    move.repeat().go();
    rotate.repeat().go();
  }

  function advancedExample4() {
    var duration = 5000;
    var easing = sekvens.linear;
    var element = document.getElementById("advanced-example-4");
    sekvens.chain(sekvens.from(0).to(255, duration, easing).on(function (value) {
      element.style.backgroundColor = "rgb(" + value + ",0,0)"
      element.textContent = element.style.backgroundColor;
    }), sekvens.from(0).to(255, duration, easing).on(function (value) {
      element.style.backgroundColor = "rgb(0," + value + ",0)"
      element.textContent = element.style.backgroundColor;
    }), sekvens.from(0).to(255, duration, easing).on(function (value) {
      element.style.backgroundColor = "rgb(0,0," + value + ")"
      element.textContent = element.style.backgroundColor;
    })).repeat().go();
  }

  advancedExample1();
  advancedExample2();
  advancedExample3();
  advancedExample4();
});
