"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var DeviceMotion = /** @class */ (function () {
    function DeviceMotion() {
        var _this = this;
        this.handleDeviceMotionChange = function (event) {
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
        this.active = false;
        this.data = null;
        this._callbacks = [];
        // initial value
        this.screenOrientationAngle = constants_1.screenOrientationAngle;
    }
    DeviceMotion.prototype.start = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        if (callback && typeof callback === 'function') {
            this._callbacks.push(callback);
        }
        if (this.active) {
            return;
        }
        if (this.screenOrientationAngle) {
            window.screen.orientation.addEventListener('change', this.handleScreenOrientationChange, false);
        }
        else {
            window.addEventListener('orientationchange', this.handleScreenOrientationChange, false);
        }
        window.addEventListener('devicemotion', this.handleDeviceMotionChange, false);
        this.active = true;
    };
    DeviceMotion.prototype.stop = function () {
        if (!this.active) {
            return;
        }
        window.removeEventListener('devicemotion', this.handleDeviceMotionChange, false);
        this.active = false;
    };
    DeviceMotion.prototype.listen = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        this.start(callback);
    };
    DeviceMotion.prototype.getScreenAdjustedAcceleration = function () {
        var accData = this.data
            && this.data.acceleration
            ? this.data.acceleration
            : { x: 0, y: 0, z: 0 };
        var screenAccData = {
            x: 0,
            y: 0,
            z: 0
        };
        switch (this.screenOrientationAngle) {
            case constants_1.SCREEN_ROTATION_90:
                screenAccData.x = -accData.y;
                screenAccData.y = accData.x;
                break;
            case constants_1.SCREEN_ROTATION_180:
                screenAccData.x = -accData.x;
                screenAccData.y = -accData.y;
                break;
            case constants_1.SCREEN_ROTATION_270:
            case constants_1.SCREEN_ROTATION_MINUS_90:
                screenAccData.x = accData.y;
                screenAccData.y = -accData.x;
                break;
            default: // SCREEN_ROTATION_0
                screenAccData.x = accData.x;
                screenAccData.y = accData.y;
                break;
        }
        screenAccData.z = accData.z;
        return screenAccData;
    };
    DeviceMotion.prototype.getScreenAdjustedAccelerationIncludingGravity = function () {
        var accGData = this.data
            && this.data.accelerationIncludingGravity
            ? this.data.accelerationIncludingGravity
            : { x: 0, y: 0, z: 0 };
        var screenAccGData = {
            x: 0,
            y: 0,
            z: 0
        };
        switch (this.screenOrientationAngle) {
            case constants_1.SCREEN_ROTATION_90:
                screenAccGData.x = -accGData.y;
                screenAccGData.y = accGData.x;
                break;
            case constants_1.SCREEN_ROTATION_180:
                screenAccGData.x = -accGData.x;
                screenAccGData.y = -accGData.y;
                break;
            case constants_1.SCREEN_ROTATION_270:
            case constants_1.SCREEN_ROTATION_MINUS_90:
                screenAccGData.x = accGData.y;
                screenAccGData.y = -accGData.x;
                break;
            default: // SCREEN_ROTATION_0
                screenAccGData.x = accGData.x;
                screenAccGData.y = accGData.y;
                break;
        }
        screenAccGData.z = accGData.z;
        return screenAccGData;
    };
    DeviceMotion.prototype.getScreenAdjustedRotationRate = function () {
        var rotRateData = this.data
            && this.data.rotationRate
            ? this.data.rotationRate
            : { alpha: 0, beta: 0, gamma: 0 };
        var screenRotRateData = {
            alpha: 0,
            beta: 0,
            gamma: 0
        };
        var rotAlpha = rotRateData.alpha || 0;
        var rotBeta = rotRateData.beta || 0;
        var rotGamma = rotRateData.gamma || 0;
        switch (this.screenOrientationAngle) {
            case constants_1.SCREEN_ROTATION_90:
                screenRotRateData.beta = -rotGamma;
                screenRotRateData.gamma = rotBeta;
                break;
            case constants_1.SCREEN_ROTATION_180:
                screenRotRateData.beta = -rotBeta;
                screenRotRateData.gamma = -rotGamma;
                break;
            case constants_1.SCREEN_ROTATION_270:
            case constants_1.SCREEN_ROTATION_MINUS_90:
                screenRotRateData.beta = rotGamma;
                screenRotRateData.gamma = -rotBeta;
                break;
            default: // SCREEN_ROTATION_0
                screenRotRateData.beta = rotBeta;
                screenRotRateData.gamma = rotGamma;
                break;
        }
        screenRotRateData.alpha = rotAlpha;
        return screenRotRateData;
    };
    DeviceMotion.prototype.getLastRawEventData = function () {
        return this.data || {};
    };
    return DeviceMotion;
}());
exports.DeviceMotion = DeviceMotion;
//# sourceMappingURL=deviceMotion.js.map