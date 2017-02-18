require(["../build/sekvens"], function (sekvens) {
  function pointExample1() {
    var element = document.getElementById("point-example-1");
    var duration = 1000;
    sekvens.fromPoint({ x: 0, y: 0 })
      .to({ x: 50, y: 100 }, duration)
      .to({ x: 100, y: 0 }, duration)
      .to({ x: 150, y: 100 }, duration)
      .to({ x: 200, y: 0 }, duration)
      .to({ x: 250, y: 100 }, duration)
      .to({ x: 300, y: 0 }, duration)
      .to({ x: 0, y: 0 }, duration)
      .repeat()
      .settings({ defaultEasing: sekvens.easeInOutQuint })
      .on(function (point) {
        element.style.left = point.x + "px";
        element.style.top = point.y + "px";
      }).go();
  }
  pointExample1();
});
