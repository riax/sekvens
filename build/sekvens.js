var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
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
    function from(value) {
        return new ValueAnimation(value);
    }
    exports.from = from;
    function chain() {
        var sequences = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sequences[_i - 0] = arguments[_i];
        }
        return new SequenceAnimation(sequences);
    }
    exports.chain = chain;
    var Sequence = (function () {
        function Sequence() {
            this.numberOfRepeats = 0;
            this.onCompleteCallbacks = [];
        }
        Sequence.prototype.repeat = function (count) {
            if (count === void 0) { count = Number.MAX_VALUE; }
            this.numberOfRepeats = count;
            return this;
        };
        Sequence.prototype.done = function (onComplete) {
            this.onCompleteCallbacks.push(onComplete);
            return this;
        };
        Sequence.prototype.executeOnComplete = function () {
            for (var _i = 0, _a = this.onCompleteCallbacks; _i < _a.length; _i++) {
                var callback = _a[_i];
                callback();
            }
        };
        return Sequence;
    })();
    exports.Sequence = Sequence;
    var SequenceAnimation = (function (_super) {
        __extends(SequenceAnimation, _super);
        function SequenceAnimation(sequences) {
            _super.call(this);
            this.sequences = sequences;
            this.currentIndex = 0;
        }
        SequenceAnimation.prototype.go = function (onGoComplete) {
            var _this = this;
            var repeatCount = 0;
            var execute = function (index) {
                var sequence = _this.sequences[index];
                sequence.go(function () {
                    var nextIndex = index + 1;
                    var shouldRepeat = repeatCount++ < _this.numberOfRepeats;
                    if (_this.sequences[nextIndex] !== undefined) {
                        execute(nextIndex);
                    }
                    else {
                        if (shouldRepeat) {
                            execute(0);
                        }
                        else {
                            onGoComplete && onGoComplete();
                            _this.executeOnComplete();
                        }
                        return;
                    }
                });
                _this.currentIndex = index;
            };
            this.sequences.length > 0 && execute(0);
        };
        SequenceAnimation.prototype.stop = function () {
            this.sequences[this.currentIndex].stop();
        };
        return SequenceAnimation;
    })(Sequence);
    exports.SequenceAnimation = SequenceAnimation;
    var ValueAnimation = (function (_super) {
        __extends(ValueAnimation, _super);
        function ValueAnimation(value) {
            _super.call(this);
            this.actions = [];
            this.sequence = null;
            this.initialValue = value;
        }
        ValueAnimation.prototype.to = function (to, duration, easing) {
            if (easing === void 0) { easing = exports.easeInOutCubic; }
            var initial = this.initialValue;
            var steps = duration / FPS_INTERVAL;
            var fraction = 1 / steps;
            var delta = to - this.initialValue;
            var currentFraction = 0;
            this.actions.push(function () {
                var value = initial + (easing(currentFraction += fraction) * delta);
                return {
                    isLast: Math.round(value) === to,
                    value: Math.round(value)
                };
            });
            this.initialValue = Math.round(to);
            return this;
        };
        ValueAnimation.prototype.wait = function (duration) {
            var steps = Math.floor(duration / FPS_INTERVAL);
            var stepCount = 0;
            this.actions.push(function () {
                return {
                    isLast: stepCount++ === steps,
                    value: null
                };
            });
            return this;
        };
        ValueAnimation.prototype.stop = function () {
            this.stopAnimation();
        };
        ValueAnimation.prototype.on = function (onStepComplete) {
            this.stepCompleteCallback = onStepComplete;
            return this;
        };
        ValueAnimation.prototype.go = function (onGoComplete) {
            var _this = this;
            var repeatCount = 0;
            var index = 0;
            this.sequence = this.sequence || this.createSequence(this.actions);
            this.startAnimation(function () {
                var value = _this.sequence[index++];
                if (value !== undefined) {
                    if (value !== null) {
                        _this.stepCompleteCallback && _this.stepCompleteCallback(value);
                    }
                }
                else {
                    if (++repeatCount < _this.numberOfRepeats) {
                        index = 0;
                    }
                    else {
                        _this.stop();
                        _this.executeOnComplete();
                        onGoComplete && onGoComplete();
                    }
                }
            });
        };
        ValueAnimation.prototype.startAnimation = function (callback) {
            this.animationId = setInterval(function () { return callback(); }, FPS_INTERVAL);
        };
        ValueAnimation.prototype.stopAnimation = function () {
            clearInterval(this.animationId);
            this.animationId = null;
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
        return ValueAnimation;
    })(Sequence);
    exports.ValueAnimation = ValueAnimation;
});
