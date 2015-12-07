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

		sekvens.chain(sekvens.chain(move, move), move).repeat(10).go();
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
		var createFunc = function (id) {
			return function (value) {
				document.getElementById(id).style.marginLeft = value + "px";
			}
		}
		sekvens.from(0).to(500, 1500, sekvens.linear).on(createFunc("basic-example-4-1")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeOutQuad).on(createFunc("basic-example-4-2")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeInQuad).on(createFunc("basic-example-4-3")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeInOutQuad).on(createFunc("basic-example-4-4")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeInCubic).on(createFunc("basic-example-4-5")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeOutCubic).on(createFunc("basic-example-4-6")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeInOutCubic).on(createFunc("basic-example-4-7")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeInQuart).on(createFunc("basic-example-4-8")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeOutQuart).on(createFunc("basic-example-4-9")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeInOutQuart).on(createFunc("basic-example-4-10")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeInQuint).on(createFunc("basic-example-4-11")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeOutQuint).on(createFunc("basic-example-4-12")).repeat().go();
		sekvens.from(0).to(500, 1500, sekvens.easeInOutQuint).on(createFunc("basic-example-4-13")).repeat().go();
	}

	advancedExample1();
	advancedExample2();
	advancedExample3();
	advancedExample4();
});