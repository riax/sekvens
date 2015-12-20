var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    ;
    exports.swing = function (t) { return 0.5 - Math.cos(t * Math.PI) / 2; };
    exports.linear = function (t) { return t; };
    exports.easeInQuad = function (t) { return t * t; };
    exports.easeOutQuad = function (t) { return t * (2 - t); };
    exports.easeInOutQuad = function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; };
    exports.easeInCubic = function (t) { return t * t * t; };
    exports.easeOutCubic = function (t) { return (--t) * t * t + 1; };
    exports.easeInOutCubic = function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; };
    exports.easeInQuart = function (t) { return t * t * t * t; };
    exports.easeOutQuart = function (t) { return 1 - (--t) * t * t * t; };
    exports.easeInOutQuart = function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; };
    exports.easeInQuint = function (t) { return t * t * t * t * t; };
    exports.easeOutQuint = function (t) { return 1 + (--t) * t * t * t * t; };
    exports.easeInOutQuint = function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; };
    var FPS_INTERVAL = 1000 / 60;
    var rAF = window.requestAnimationFrame || requestAnimationFrameShim;
    function from(value) {
        ensureInteger(value);
        return new SingleValueAnimation(value);
    }
    exports.from = from;
    function fromPoint(value) {
        ensurePoint(value);
        return new PointValueAnimation(value);
    }
    exports.fromPoint = fromPoint;
    function chain() {
        var groups = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            groups[_i - 0] = arguments[_i];
        }
        return new ChainedAnimation(groups);
    }
    exports.chain = chain;
    var AnimationBase = (function () {
        function AnimationBase() {
            this.numberOfRepeats = 0;
            this.onCompleteCallbacks = [];
        }
        AnimationBase.prototype.repeat = function (count) {
            if (count === void 0) { count = Number.MAX_VALUE; }
            this.numberOfRepeats = count;
            return this;
        };
        AnimationBase.prototype.done = function (onComplete) {
            onComplete && ensureFunction(onComplete);
            this.onCompleteCallbacks.push(onComplete);
            return this;
        };
        AnimationBase.prototype.executeOnComplete = function () {
            for (var _i = 0, _a = this.onCompleteCallbacks; _i < _a.length; _i++) {
                var callback = _a[_i];
                callback();
            }
        };
        return AnimationBase;
    })();
    exports.AnimationBase = AnimationBase;
    var ChainedAnimation = (function (_super) {
        __extends(ChainedAnimation, _super);
        function ChainedAnimation(groups) {
            _super.call(this);
            this.groups = groups;
            this.currentIndex = 0;
        }
        ChainedAnimation.prototype.go = function (onGoComplete) {
            var _this = this;
            onGoComplete && ensureFunction(onGoComplete);
            var repeatCount = 0;
            var execute = function (index) {
                var animation = _this.groups[index];
                animation.go(function () {
                    var nextIndex = index + 1;
                    var shouldRepeat = repeatCount++ < _this.numberOfRepeats;
                    if (_this.groups[nextIndex] !== undefined) {
                        execute(nextIndex);
                    }
                    else {
                        if (shouldRepeat) {
                            execute(0);
                        }
                        else {
                            !!onGoComplete && onGoComplete();
                            _this.executeOnComplete();
                        }
                        return;
                    }
                });
                _this.currentIndex = index;
            };
            this.groups.length > 0 && execute(0);
        };
        ChainedAnimation.prototype.stop = function () {
            this.groups[this.currentIndex].stop();
        };
        return ChainedAnimation;
    })(AnimationBase);
    exports.ChainedAnimation = ChainedAnimation;
    var ValueAnimation = (function (_super) {
        __extends(ValueAnimation, _super);
        function ValueAnimation(value) {
            _super.call(this);
            this.sequence = null;
            this.actions = [];
            this.valueAnimationSettings = { defaultEasing: exports.easeInOutCubic };
            this.initialValue = value;
        }
        ValueAnimation.prototype.stop = function () {
            this.stopAnimation();
        };
        ValueAnimation.prototype.on = function (onStepComplete) {
            ensureFunction(onStepComplete);
            this.onStepComplete = onStepComplete;
            return this;
        };
        ValueAnimation.prototype.go = function (onGoComplete) {
            var _this = this;
            onGoComplete && ensureFunction(onGoComplete);
            var repeatCount = 0;
            var index = 0;
            this.sequence = this.sequence || this.createSequence(this.actions);
            this.startAnimation(function () {
                var value = _this.sequence[index++];
                if (value !== undefined) {
                    if (value !== null) {
                        _this.onStepComplete && _this.onStepComplete(value, _this);
                    }
                }
                else {
                    if (++repeatCount < _this.numberOfRepeats) {
                        index = 0;
                    }
                    else {
                        _this.executeOnComplete();
                        !!onGoComplete && onGoComplete();
                        return false;
                    }
                }
                return true;
            });
        };
        ValueAnimation.prototype.settings = function (settings) {
            this.valueAnimationSettings.defaultEasing = settings.defaultEasing;
            return this;
        };
        ValueAnimation.prototype.wait = function (duration) {
            ensurePositiveNumber(duration);
            var numberOfSteps = snapToFPSInterval(duration) / FPS_INTERVAL;
            if (numberOfSteps === 0)
                return this;
            var stepCount = 0;
            this.actions.push(function () {
                return {
                    isLast: stepCount++ === numberOfSteps,
                    value: null
                };
            });
            return this;
        };
        ValueAnimation.prototype.createSequence = function (actions) {
            var values = [];
            for (var _i = 0; _i < actions.length; _i++) {
                var action = actions[_i];
                var isLast = void 0;
                do {
                    var result = action();
                    values.push(result.value);
                    isLast = result.isLast;
                } while (!isLast);
            }
            return values;
        };
        ValueAnimation.prototype.startAnimation = function (onTick) {
            var _this = this;
            this.isTicking = true;
            var ticker = function () {
                if (onTick() && _this.isTicking) {
                    rAF(ticker);
                }
                ;
            };
            rAF(ticker);
        };
        ValueAnimation.prototype.stopAnimation = function () {
            this.isTicking = false;
        };
        return ValueAnimation;
    })(AnimationBase);
    exports.ValueAnimation = ValueAnimation;
    var SingleValueAnimation = (function (_super) {
        __extends(SingleValueAnimation, _super);
        function SingleValueAnimation(value) {
            _super.call(this, value);
        }
        SingleValueAnimation.prototype.to = function (to, duration, easing) {
            if (easing === void 0) { easing = this.valueAnimationSettings.defaultEasing; }
            ensureInteger(to);
            ensurePositiveNumber(duration);
            var delta = to - this.initialValue;
            if (delta === 0)
                return this;
            var currentFraction = 0;
            var initial = this.initialValue;
            var fraction = calculateFrameFraction(duration);
            this.actions.push(function () {
                var value = initial + (easing(currentFraction += fraction) * delta);
                var roundedValue = Math.round(value);
                return {
                    isLast: roundedValue === Math.round(to),
                    value: roundedValue
                };
            });
            this.initialValue = Math.round(to);
            return this;
        };
        return SingleValueAnimation;
    })(ValueAnimation);
    exports.SingleValueAnimation = SingleValueAnimation;
    var PointValueAnimation = (function (_super) {
        __extends(PointValueAnimation, _super);
        function PointValueAnimation(value) {
            _super.call(this, value);
        }
        PointValueAnimation.prototype.to = function (to, duration, easing) {
            if (easing === void 0) { easing = this.valueAnimationSettings.defaultEasing; }
            ensurePoint(to);
            ensurePositiveNumber(duration);
            var deltaX = to.x - this.initialValue.x;
            var deltaY = to.y - this.initialValue.y;
            if (deltaX === 0 && deltaY === 0)
                return this;
            var currentFraction = 0;
            var initial = this.initialValue;
            var fraction = calculateFrameFraction(duration);
            this.actions.push(function () {
                var easedFraction = easing(currentFraction += fraction);
                var x = initial.x + (easedFraction * deltaX);
                var y = initial.y + (easedFraction * deltaY);
                var roundedValue = { x: Math.round(x), y: Math.round(y) };
                return {
                    isLast: roundedValue.x === Math.round(to.x) && roundedValue.y === Math.round(to.y),
                    value: roundedValue
                };
            });
            this.initialValue = { x: Math.round(to.x), y: Math.round(to.y) };
            return this;
        };
        return PointValueAnimation;
    })(ValueAnimation);
    exports.PointValueAnimation = PointValueAnimation;
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
        if (!isObject || typeof input.x !== "number" || typeof input.y !== "number")
            throwTypeError("point", isObject ? JSON.stringify(input) : typeof input);
    }
    function ensureFunction(input) {
        if (typeof input !== "function")
            throwTypeError("function", typeof input);
    }
    function ensureInteger(input) {
        if (typeof input !== "number" || input % 1 !== 0)
            throwTypeError("integer", input);
    }
    function ensurePositiveNumber(input) {
        ensureInteger(input);
        if (input < 0)
            throwTypeError("positive number", input);
    }
    function throwTypeError(expected, got) {
        throw "Expeted " + expected + ", but got " + got;
    }
});
