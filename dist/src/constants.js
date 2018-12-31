"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.M_PI = Math.PI;
exports.M_PI_2 = exports.M_PI / 2;
exports.M_2_PI = 2 * exports.M_PI;
// Degree to Radian conversion
exports.degToRad = exports.M_PI / 180;
exports.radToDeg = 180 / exports.M_PI;
exports.hasScreenOrientationAPI = window.screen
    && window.screen.orientation
    && window.screen.orientation.angle !== undefined
    && window.screen.orientation.angle !== null
    ? true
    : false;
exports.screenOrientationAngle = (exports.hasScreenOrientationAPI
    ? window.screen.orientation.angle
    : (window.orientation !== undefined
        ? isNaN(window.orientation)
            ? parseInt(window.orientation, 10)
            : window.orientation
        : 0)) * exports.degToRad;
exports.SCREEN_ROTATION_0 = 0;
exports.SCREEN_ROTATION_90 = exports.M_PI_2;
exports.SCREEN_ROTATION_180 = exports.M_PI;
exports.SCREEN_ROTATION_270 = exports.M_2_PI / 3;
exports.SCREEN_ROTATION_MINUS_90 = -exports.M_PI_2;
//# sourceMappingURL=constants.js.map