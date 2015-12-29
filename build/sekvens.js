(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.sekvens = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    ;
    var swing = function swing(t) {
        return 0.5 - Math.cos(t * Math.PI) / 2;
    };
    var linear = function linear(t) {
        return t;
    };
    var easeInQuad = function easeInQuad(t) {
        return t * t;
    };
    var easeOutQuad = function easeOutQuad(t) {
        return t * (2 - t);
    };
    var easeInOutQuad = function easeInOutQuad(t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };
    var easeInCubic = function easeInCubic(t) {
        return t * t * t;
    };
    var easeOutCubic = function easeOutCubic(t) {
        return --t * t * t + 1;
    };
    var easeInOutCubic = function easeInOutCubic(t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };
    var easeInQuart = function easeInQuart(t) {
        return t * t * t * t;
    };
    var easeOutQuart = function easeOutQuart(t) {
        return 1 - --t * t * t * t;
    };
    var easeInOutQuart = function easeInOutQuart(t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    };
    var easeInQuint = function easeInQuint(t) {
        return t * t * t * t * t;
    };
    var easeOutQuint = function easeOutQuint(t) {
        return 1 + --t * t * t * t * t;
    };
    var easeInOutQuint = function easeInOutQuint(t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    };
    var FPS_INTERVAL = 1000 / 60;
    var rAF = window.requestAnimationFrame || requestAnimationFrameShim;
    function from(value) {
        ensureInteger(value);
        return new SingleValueAnimation(value);
    }
    function fromPoint(value) {
        ensurePoint(value);
        return new PointValueAnimation(value);
    }
    function chain() {
        for (var _len = arguments.length, groups = Array(_len), _key = 0; _key < _len; _key++) {
            groups[_key] = arguments[_key];
        }

        return new ChainedAnimation(groups);
    }

    var AnimationBase = (function () {
        function AnimationBase() {
            _classCallCheck(this, AnimationBase);

            this.numberOfRepeats = 0;
            this.onCompleteCallbacks = [];
        }

        _createClass(AnimationBase, [{
            key: "repeat",
            value: function repeat() {
                var count = arguments.length <= 0 || arguments[0] === undefined ? Number.MAX_VALUE : arguments[0];

                this.numberOfRepeats = count;
                return this;
            }
        }, {
            key: "done",
            value: function done(onComplete) {
                onComplete && ensureFunction(onComplete);
                this.onCompleteCallbacks.push(onComplete);
                return this;
            }
        }, {
            key: "executeOnComplete",
            value: function executeOnComplete() {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.onCompleteCallbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var callback = _step.value;

                        callback();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator["return"]) {
                            _iterator["return"]();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }]);

        return AnimationBase;
    })();

    var ChainedAnimation = (function (_AnimationBase) {
        _inherits(ChainedAnimation, _AnimationBase);

        function ChainedAnimation(groups) {
            _classCallCheck(this, ChainedAnimation);

            _get(Object.getPrototypeOf(ChainedAnimation.prototype), "constructor", this).call(this);
            this.groups = groups;
            this.currentIndex = 0;
        }

        _createClass(ChainedAnimation, [{
            key: "go",
            value: function go(onGoComplete) {
                var _this = this;

                onGoComplete && ensureFunction(onGoComplete);
                var repeatCount = 0;
                var execute = function execute(index) {
                    var animation = _this.groups[index];
                    animation.go(function () {
                        var nextIndex = index + 1;
                        var shouldRepeat = repeatCount++ < _this.numberOfRepeats;
                        if (_this.groups[nextIndex] !== undefined) {
                            execute(nextIndex);
                        } else {
                            if (shouldRepeat) {
                                execute(0);
                            } else {
                                !!onGoComplete && onGoComplete();
                                _this.executeOnComplete();
                            }
                            return;
                        }
                    });
                    _this.currentIndex = index;
                };
                this.groups.length > 0 && execute(0);
            }
        }, {
            key: "stop",
            value: function stop() {
                this.groups[this.currentIndex].stop();
            }
        }]);

        return ChainedAnimation;
    })(AnimationBase);

    var ValueAnimation = (function (_AnimationBase2) {
        _inherits(ValueAnimation, _AnimationBase2);

        function ValueAnimation(value) {
            _classCallCheck(this, ValueAnimation);

            _get(Object.getPrototypeOf(ValueAnimation.prototype), "constructor", this).call(this);
            this.sequence = null;
            this.actions = [];
            this.valueAnimationSettings = { defaultEasing: easeInOutCubic };
            this.initialValue = value;
        }

        _createClass(ValueAnimation, [{
            key: "stop",
            value: function stop() {
                this.stopAnimation();
            }
        }, {
            key: "on",
            value: function on(onStepComplete) {
                ensureFunction(onStepComplete);
                this.onStepComplete = onStepComplete;
                return this;
            }
        }, {
            key: "go",
            value: function go(onGoComplete) {
                var _this2 = this;

                onGoComplete && ensureFunction(onGoComplete);
                var repeatCount = 0;
                var index = 0;
                this.sequence = this.sequence || this.createSequence(this.actions);
                this.startAnimation(function () {
                    var value = _this2.sequence[index++];
                    if (value !== undefined) {
                        if (value !== null) {
                            _this2.onStepComplete && _this2.onStepComplete(value, _this2);
                        }
                    } else {
                        if (++repeatCount < _this2.numberOfRepeats) {
                            index = 0;
                        } else {
                            _this2.executeOnComplete();
                            !!onGoComplete && onGoComplete();
                            return false;
                        }
                    }
                    return true;
                });
            }
        }, {
            key: "settings",
            value: function settings(_settings) {
                this.valueAnimationSettings.defaultEasing = _settings.defaultEasing;
                return this;
            }
        }, {
            key: "wait",
            value: function wait(duration) {
                ensurePositiveNumber(duration);
                var numberOfSteps = snapToFPSInterval(duration) / FPS_INTERVAL;
                if (numberOfSteps === 0) return this;
                var stepCount = 0;
                this.actions.push(function () {
                    return {
                        isLast: stepCount++ === numberOfSteps,
                        value: null
                    };
                });
                return this;
            }
        }, {
            key: "createSequence",
            value: function createSequence(actions) {
                var values = [];
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = actions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var action = _step2.value;

                        var isLast = undefined;
                        do {
                            var result = action();
                            values.push(result.value);
                            isLast = result.isLast;
                        } while (!isLast);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                            _iterator2["return"]();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return values;
            }
        }, {
            key: "startAnimation",
            value: function startAnimation(onTick) {
                var _this3 = this;

                this.isTicking = true;
                var ticker = function ticker() {
                    if (onTick() && _this3.isTicking) {
                        rAF(ticker);
                    }
                    ;
                };
                rAF(ticker);
            }
        }, {
            key: "stopAnimation",
            value: function stopAnimation() {
                this.isTicking = false;
            }
        }]);

        return ValueAnimation;
    })(AnimationBase);

    var SingleValueAnimation = (function (_ValueAnimation) {
        _inherits(SingleValueAnimation, _ValueAnimation);

        function SingleValueAnimation(value) {
            _classCallCheck(this, SingleValueAnimation);

            _get(Object.getPrototypeOf(SingleValueAnimation.prototype), "constructor", this).call(this, value);
        }

        _createClass(SingleValueAnimation, [{
            key: "to",
            value: function to(_to, duration) {
                var easing = arguments.length <= 2 || arguments[2] === undefined ? this.valueAnimationSettings.defaultEasing : arguments[2];

                ensureInteger(_to);
                ensurePositiveNumber(duration);
                var delta = _to - this.initialValue;
                if (delta === 0) return this;
                var currentFraction = 0;
                var initial = this.initialValue;
                var fraction = calculateFrameFraction(duration);
                this.actions.push(function () {
                    var value = initial + easing(currentFraction += fraction) * delta;
                    var roundedValue = Math.round(value);
                    return {
                        isLast: roundedValue === Math.round(_to),
                        value: roundedValue
                    };
                });
                this.initialValue = Math.round(_to);
                return this;
            }
        }]);

        return SingleValueAnimation;
    })(ValueAnimation);

    var PointValueAnimation = (function (_ValueAnimation2) {
        _inherits(PointValueAnimation, _ValueAnimation2);

        function PointValueAnimation(value) {
            _classCallCheck(this, PointValueAnimation);

            _get(Object.getPrototypeOf(PointValueAnimation.prototype), "constructor", this).call(this, value);
        }

        _createClass(PointValueAnimation, [{
            key: "to",
            value: function to(_to2, duration) {
                var easing = arguments.length <= 2 || arguments[2] === undefined ? this.valueAnimationSettings.defaultEasing : arguments[2];

                ensurePoint(_to2);
                ensurePositiveNumber(duration);
                var deltaX = _to2.x - this.initialValue.x;
                var deltaY = _to2.y - this.initialValue.y;
                if (deltaX === 0 && deltaY === 0) return this;
                var currentFraction = 0;
                var initial = this.initialValue;
                var fraction = calculateFrameFraction(duration);
                this.actions.push(function () {
                    var easedFraction = easing(currentFraction += fraction);
                    var x = initial.x + easedFraction * deltaX;
                    var y = initial.y + easedFraction * deltaY;
                    var roundedValue = { x: Math.round(x), y: Math.round(y) };
                    return {
                        isLast: roundedValue.x === Math.round(_to2.x) && roundedValue.y === Math.round(_to2.y),
                        value: roundedValue
                    };
                });
                this.initialValue = { x: Math.round(_to2.x), y: Math.round(_to2.y) };
                return this;
            }
        }]);

        return PointValueAnimation;
    })(ValueAnimation);

    function calculateFrameFraction(duration) {
        var numberOfSteps = Math.max(snapToFPSInterval(duration), FPS_INTERVAL) / FPS_INTERVAL;
        return 1 / numberOfSteps;
    }
    function snapToFPSInterval(duration) {
        return Math.round(duration / FPS_INTERVAL) * FPS_INTERVAL;
    }
    function requestAnimationFrameShim(ticker) {
        return setTimeout(function () {
            ticker();
        }, FPS_INTERVAL);
    }
    function ensurePoint(input) {
        var isObject = typeof input === "object";
        if (!isObject || typeof input.x !== "number" || typeof input.y !== "number") throwTypeError("point", isObject ? JSON.stringify(input) : typeof input);
    }
    function ensureFunction(input) {
        if (typeof input !== "function") throwTypeError("function", typeof input);
    }
    function ensureInteger(input) {
        if (typeof input !== "number" || input % 1 !== 0) throwTypeError("integer", input);
    }
    function ensurePositiveNumber(input) {
        ensureInteger(input);
        if (input < 0) throwTypeError("positive number", input);
    }
    function throwTypeError(expected, got) {
        throw "Expeted " + expected + ", but got " + got;
    }

    exports.swing = swing;
    exports.linear = linear;
    exports.easeInQuad = easeInQuad;
    exports.easeOutQuad = easeOutQuad;
    exports.easeInOutQuad = easeInOutQuad;
    exports.easeInCubic = easeInCubic;
    exports.easeOutCubic = easeOutCubic;
    exports.easeInOutCubic = easeInOutCubic;
    exports.easeInQuart = easeInQuart;
    exports.easeOutQuart = easeOutQuart;
    exports.easeInOutQuart = easeInOutQuart;
    exports.easeInQuint = easeInQuint;
    exports.easeOutQuint = easeOutQuint;
    exports.easeInOutQuint = easeInOutQuint;
    exports.from = from;
    exports.fromPoint = fromPoint;
    exports.chain = chain;
    exports.AnimationBase = AnimationBase;
    exports.ChainedAnimation = ChainedAnimation;
    exports.ValueAnimation = ValueAnimation;
    exports.SingleValueAnimation = SingleValueAnimation;
    exports.PointValueAnimation = PointValueAnimation;
});