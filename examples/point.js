require(["../build/sekvens"], function (sekvens) {
	function pointExample1() {
		var element = document.getElementById("point-example-1");
		sekvens.fromPoint({ x: 0, y: 0 })
			.to({ x: 0, y: 300 }, 2000)
			.to({ x: 300, y: 300 }, 2000)
			.to({ x: 0, y: 0 }, 2000)
			.repeat()
			.settings({ defaultEasing: sekvens.easeInOutQuint })
			.on(function (point) {
				element.style.left = point.x + "px";
				element.style.top = point.y + "px";
			}).go();
	}
	pointExample1();
});