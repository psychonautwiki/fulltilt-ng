"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var Quaternion = /** @class */ (function () {
    function Quaternion(x, y, z, w) {
        this.set(x, y, z, w);
    }
    Quaternion.prototype.set = function (x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 1;
    };
    ;
    Quaternion.prototype.copy = function (quaternion) {
        this.x = quaternion.x;
        this.y = quaternion.y;
        this.z = quaternion.z;
        this.w = quaternion.w;
    };
    ;
    Quaternion.prototype.setFromEuler = function (euler) {
        var _z = (euler.alpha || 0) * constants_1.degToRad;
        var _x = (euler.beta || 0) * constants_1.degToRad;
        var _y = (euler.gamma || 0) * constants_1.degToRad;
        var _z_2 = _z / 2;
        var _x_2 = _x / 2;
        var _y_2 = _y / 2;
        var cX = Math.cos(_x_2);
        var cY = Math.cos(_y_2);
        var cZ = Math.cos(_z_2);
        var sX = Math.sin(_x_2);
        var sY = Math.sin(_y_2);
        var sZ = Math.sin(_z_2);
        this.set(sX * cY * cZ - cX * sY * sZ, // x
        cX * sY * cZ + sX * cY * sZ, // y
        cX * cY * sZ + sX * sY * cZ, // z
        cX * cY * cZ - sX * sY * sZ // w
        );
        this.normalize();
        return this;
    };
    ;
    Quaternion.prototype.setFromRotationMatrix = function (matrix) {
        var R = matrix.elements;
        this.set(0.5 * Math.sqrt(1 + R[0] - R[4] - R[8]) * utils_1.sign(R[7] - R[5]), // x
        0.5 * Math.sqrt(1 - R[0] + R[4] - R[8]) * utils_1.sign(R[2] - R[6]), // y
        0.5 * Math.sqrt(1 - R[0] - R[4] + R[8]) * utils_1.sign(R[3] - R[1]), // z
        0.5 * Math.sqrt(1 + R[0] + R[4] + R[8]) // w
        );
        return this;
    };
    ;
    Quaternion.prototype.multiply = function (quaternion) {
        this.copy(Quaternion.multiplyQuaternions(this, quaternion));
        return this;
    };
    Quaternion.prototype.rotateX = function (angle) {
        this.copy(Quaternion.rotateByAxisAngle(this, [1, 0, 0], angle));
        return this;
    };
    Quaternion.prototype.rotateY = function (angle) {
        this.copy(Quaternion.rotateByAxisAngle(this, [0, 1, 0], angle));
        return this;
    };
    Quaternion.prototype.rotateZ = function (angle) {
        this.copy(Quaternion.rotateByAxisAngle(this, [0, 0, 1], angle));
        return this;
    };
    Quaternion.prototype.normalize = function () {
        return Quaternion.normalize(this);
    };
    Quaternion.multiplyQuaternions = function (a, b) {
        var multipliedQuat = Quaternion.empty();
        var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
        var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;
        multipliedQuat.set(qax * qbw + qaw * qbx + qay * qbz - qaz * qby, // x
        qay * qbw + qaw * qby + qaz * qbx - qax * qbz, // y
        qaz * qbw + qaw * qbz + qax * qby - qay * qbx, // z
        qaw * qbw - qax * qbx - qay * qby - qaz * qbz // w
        );
        return multipliedQuat;
    };
    Quaternion.normalize = function (q) {
        var len = Math.sqrt(q.x * q.x
            + q.y * q.y
            + q.z * q.z
            + q.w * q.w);
        if (len === 0) {
            q.x = 0;
            q.y = 0;
            q.z = 0;
            q.w = 1;
            return q;
        }
        q.x *= 1 / len;
        q.y *= 1 / len;
        q.z *= 1 / len;
        q.w *= 1 / len;
        return q;
    };
    Quaternion.rotateByAxisAngle = function (targetQuaternion, axis, angle) {
        var transformQuaternion = Quaternion.empty();
        var halfAngle = (angle || 0) / 2;
        var sA = Math.sin(halfAngle);
        transformQuaternion.set((axis[0] || 0) * sA, // x
        (axis[1] || 0) * sA, // y
        (axis[2] || 0) * sA, // z
        Math.cos(halfAngle) // w
        );
        return Quaternion.normalize(Quaternion.multiplyQuaternions(targetQuaternion, transformQuaternion));
    };
    ;
    Quaternion.empty = function () {
        return new Quaternion(0, 0, 0, 0);
    };
    return Quaternion;
}());
exports.Quaternion = Quaternion;
;
//# sourceMappingURL=quaternion.js.map