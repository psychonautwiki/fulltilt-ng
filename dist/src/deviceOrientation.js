"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rotationMatrix_1 = require("./rotationMatrix");
var quaternion_1 = require("./quaternion");
var euler_1 = require("./euler");
var constants_1 = require("./constants");
var DeviceOrientation = /** @class */ (function () {
    function DeviceOrientation(options) {
        var _this = this;
        this.handleDeviceOrientationChange = function (event) {
            _this.data = event;
            _this._callbacks.forEach(function (callback) {
                return callback(event);
            });
        };
        this.handleScreenOrientationChange = function () {
            if (constants_1.hasScreenOrientationAPI) {
                _this.screenOrientationAngle = (window.screen.orientation.angle || 0) * constants_1.degToRad;
                return;
            }
            _this.screenOrientationAngle = (typeof window.orientation === 'string'
                ? parseInt(window.orientation, 10)
                : window.orientation
                    || 0) * constants_1.degToRad;
            return;
        };
        this.options = options; // by default use UA deviceorientation 'type' ('game' on iOS, 'world' on Android)
        this.alphaOffsetScreen = 0;
        this.alphaOffsetDevice = null;
        this.active = false;
        this.data = null;
        this._callbacks = [];
        this.screenOrientationAngle = constants_1.screenOrientationAngle;
        this._init();
    }
    DeviceOrientation.prototype._init = function () {
        var _this = this;
        var maxTries = 200;
        var successThreshold = 10;
        var tries = 0;
        var successCount = 0;
        // Create a game-based deviceorientation object (initial alpha === 0 degrees)
        if (this.options.type === 'game') {
            var setGameAlphaOffset_1 = function (evt) {
                if (evt.alpha !== null) { // do regardless of whether 'evt.absolute' is also true
                    _this.alphaOffsetDevice = new euler_1.Euler(evt.alpha, 0, 0);
                    _this.alphaOffsetDevice.rotateZ(-_this.screenOrientationAngle);
                    // Discard first {successThreshold} responses while a better compass lock is found by UA
                    if (++successCount >= successThreshold) {
                        window.removeEventListener('deviceorientation', setGameAlphaOffset_1, false);
                        return;
                    }
                }
                if (++tries < maxTries) {
                    return;
                }
                window.removeEventListener('deviceorientation', setGameAlphaOffset_1, false);
            };
            window.addEventListener('deviceorientation', setGameAlphaOffset_1, false);
            return;
        }
        if (this.options.type === 'world') {
            var setCompassAlphaOffset_1 = function (evt) {
                if (evt.absolute !== true
                    && evt.webkitCompassAccuracy !== undefined
                    && evt.webkitCompassAccuracy !== null
                    && +evt.webkitCompassAccuracy >= 0
                    && +evt.webkitCompassAccuracy < 50) {
                    var alphaOffsetDevice = new euler_1.Euler(evt.webkitCompassHeading || 0, 0, 0);
                    alphaOffsetDevice.rotateZ(_this.screenOrientationAngle);
                    _this.alphaOffsetDevice = alphaOffsetDevice;
                    _this.alphaOffsetScreen = _this.screenOrientationAngle;
                    // Discard first {successThreshold} responses while a better compass lock is found by UA
                    if (++successCount >= successThreshold) {
                        window.removeEventListener('deviceorientation', setCompassAlphaOffset_1, false);
                        return;
                    }
                }
                if (++tries >= maxTries) {
                    window.removeEventListener('deviceorientation', setCompassAlphaOffset_1, false);
                }
            };
            window.addEventListener('deviceorientation', setCompassAlphaOffset_1, false);
        }
        // else... use whatever orientation system the UA provides ('game' on iOS, 'world' on Android)
        0;
    };
    DeviceOrientation.prototype.start = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        if (callback && typeof callback === 'function') {
            this._callbacks.push(callback);
        }
        if (constants_1.hasScreenOrientationAPI) {
            window.screen.orientation.addEventListener('change', this.handleScreenOrientationChange, false);
        }
        else {
            window.addEventListener('orientationchange', this.handleScreenOrientationChange, false);
        }
        if (!this.active) {
            window.addEventListener('deviceorientation', this.handleDeviceOrientationChange, false);
            this.active = true;
        }
    };
    DeviceOrientation.prototype.stop = function () {
        if (this.active) {
            window.removeEventListener('deviceorientation', this.handleDeviceOrientationChange, false);
            this.active = false;
        }
    };
    DeviceOrientation.prototype.listen = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        this.start(callback);
    };
    DeviceOrientation.prototype.getFixedFrameQuaternion = function () {
        var euler = euler_1.Euler.empty();
        var matrix = rotationMatrix_1.RotationMatrix.empty();
        var quaternion = quaternion_1.Quaternion.empty();
        var orientationData = this.data || { alpha: 0, beta: 0, gamma: 0 };
        var adjustedAlpha = orientationData.alpha || 0;
        if (this.alphaOffsetDevice) {
            matrix.setFromEuler(this.alphaOffsetDevice);
            matrix.rotateZ(-this.alphaOffsetScreen);
            euler.setFromRotationMatrix(matrix);
            if (euler.alpha < 0) {
                euler.alpha += 360;
            }
            euler.alpha %= 360;
            adjustedAlpha -= euler.alpha;
        }
        euler.set(adjustedAlpha, orientationData.beta || 0, orientationData.gamma || 0);
        quaternion.setFromEuler(euler);
        return quaternion;
    };
    DeviceOrientation.prototype.getScreenAdjustedQuaternion = function () {
        var quaternion = this.getFixedFrameQuaternion();
        // Automatically apply screen orientation transform
        quaternion.rotateZ(-this.screenOrientationAngle);
        return quaternion;
    };
    DeviceOrientation.prototype.getFixedFrameMatrix = function () {
        var euler = euler_1.Euler.empty();
        var matrix = rotationMatrix_1.RotationMatrix.empty();
        var orientationData = this.data || { alpha: 0, beta: 0, gamma: 0 };
        var adjustedAlpha = orientationData.alpha || 0;
        if (this.alphaOffsetDevice) {
            matrix.setFromEuler(this.alphaOffsetDevice);
            matrix.rotateZ(-this.alphaOffsetScreen);
            euler.setFromRotationMatrix(matrix);
            if (euler.alpha < 0) {
                euler.alpha += 360;
            }
            euler.alpha %= 360;
            adjustedAlpha -= euler.alpha;
        }
        euler.set(adjustedAlpha, orientationData.beta || 0, orientationData.gamma || 0);
        matrix.setFromEuler(euler);
        return matrix;
    };
    ;
    DeviceOrientation.prototype.getScreenAdjustedMatrix = function () {
        var matrix = this.getFixedFrameMatrix();
        // Automatically apply screen orientation transform
        matrix.rotateZ(-this.screenOrientationAngle);
        return matrix;
    };
    DeviceOrientation.prototype.getFixedFrameEuler = function () {
        var euler = euler_1.Euler.empty();
        euler.setFromRotationMatrix(this.getFixedFrameMatrix());
        return euler;
    };
    DeviceOrientation.prototype.getScreenAdjustedEuler = function () {
        var euler = euler_1.Euler.empty();
        euler.setFromRotationMatrix(this.getScreenAdjustedMatrix());
        return euler;
    };
    DeviceOrientation.prototype.isAbsolute = function () {
        return (this.data && this.data.absolute === true) || false;
    };
    DeviceOrientation.prototype.getLastRawEventData = function () {
        return this.data || {};
    };
    return DeviceOrientation;
}());
exports.DeviceOrientation = DeviceOrientation;
//# sourceMappingURL=deviceOrientation.js.map