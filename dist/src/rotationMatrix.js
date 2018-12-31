"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var RotationMatrix = /** @class */ (function () {
    function RotationMatrix(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        this.elements = new Float32Array(9);
        // Initialize object values
        this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33);
    }
    RotationMatrix.prototype.setFromEuler = function (euler) {
        var _z = (euler.alpha || 0) * constants_1.degToRad;
        var _x = (euler.beta || 0) * constants_1.degToRad;
        var _y = (euler.gamma || 0) * constants_1.degToRad;
        var cX = Math.cos(_x);
        var cY = Math.cos(_y);
        var cZ = Math.cos(_z);
        var sX = Math.sin(_x);
        var sY = Math.sin(_y);
        var sZ = Math.sin(_z);
        //
        // ZXY-ordered rotation matrix construction.
        //
        this.set(cZ * cY - sZ * sX * sY, // 1,1
        -cX * sZ, // 1,2
        cY * sZ * sX + cZ * sY, // 1,3
        cY * sZ + cZ * sX * sY, // 2,1
        cZ * cX, // 2,2
        sZ * sY - cZ * cY * sX, // 2,3
        -cX * sY, // 3,1
        sX, // 3,2
        cX * cY // 3,3
        );
        this.normalize();
        return this;
    };
    ;
    RotationMatrix.prototype.setFromQuaternion = function (q) {
        var sqw = q.w * q.w;
        var sqx = q.x * q.x;
        var sqy = q.y * q.y;
        var sqz = q.z * q.z;
        this.set(sqw + sqx - sqy - sqz, // 1,1
        2 * (q.x * q.y - q.w * q.z), // 1,2
        2 * (q.x * q.z + q.w * q.y), // 1,3
        2 * (q.x * q.y + q.w * q.z), // 2,1
        sqw - sqx + sqy - sqz, // 2,2
        2 * (q.y * q.z - q.w * q.x), // 2,3
        2 * (q.x * q.z - q.w * q.y), // 3,1
        2 * (q.y * q.z + q.w * q.x), // 3,2
        sqw - sqx - sqy + sqz // 3,3
        );
        return this;
    };
    RotationMatrix.prototype.multiply = function (matrix) {
        this.copy(RotationMatrix.multiplyMatrices(this, matrix));
        return this;
    };
    ;
    RotationMatrix.prototype.rotateX = function (angle) {
        this.copy(RotationMatrix.rotateByAxisAngle(this, [1, 0, 0], angle));
        return this;
    };
    RotationMatrix.prototype.rotateY = function (angle) {
        this.copy(RotationMatrix.rotateByAxisAngle(this, [0, 1, 0], angle));
        return this;
    };
    RotationMatrix.prototype.rotateZ = function (angle) {
        this.copy(RotationMatrix.rotateByAxisAngle(this, [0, 0, 1], angle));
        return this;
    };
    RotationMatrix.prototype.normalize = function () {
        return RotationMatrix.normalize(this);
    };
    RotationMatrix.prototype.identity = function () {
        this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        return this;
    };
    RotationMatrix.prototype.set = function (m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        this.elements[0] = m11 || 1;
        this.elements[1] = m12 || 0;
        this.elements[2] = m13 || 0;
        this.elements[3] = m21 || 0;
        this.elements[4] = m22 || 1;
        this.elements[5] = m23 || 0;
        this.elements[6] = m31 || 0;
        this.elements[7] = m32 || 0;
        this.elements[8] = m33 || 1;
    };
    RotationMatrix.prototype.copy = function (matrix) {
        this.elements[0] = matrix.elements[0];
        this.elements[1] = matrix.elements[1];
        this.elements[2] = matrix.elements[2];
        this.elements[3] = matrix.elements[3];
        this.elements[4] = matrix.elements[4];
        this.elements[5] = matrix.elements[5];
        this.elements[6] = matrix.elements[6];
        this.elements[7] = matrix.elements[7];
        this.elements[8] = matrix.elements[8];
    };
    RotationMatrix.multiplyMatrices = function (a, b) {
        var matrix = RotationMatrix.empty();
        var aE = a.elements;
        var bE = b.elements;
        matrix.set(aE[0] * bE[0] + aE[1] * bE[3] + aE[2] * bE[6], aE[0] * bE[1] + aE[1] * bE[4] + aE[2] * bE[7], aE[0] * bE[2] + aE[1] * bE[5] + aE[2] * bE[8], aE[3] * bE[0] + aE[4] * bE[3] + aE[5] * bE[6], aE[3] * bE[1] + aE[4] * bE[4] + aE[5] * bE[7], aE[3] * bE[2] + aE[4] * bE[5] + aE[5] * bE[8], aE[6] * bE[0] + aE[7] * bE[3] + aE[8] * bE[6], aE[6] * bE[1] + aE[7] * bE[4] + aE[8] * bE[7], aE[6] * bE[2] + aE[7] * bE[5] + aE[8] * bE[8]);
        return matrix;
    };
    RotationMatrix.normalize = function (matrix) {
        var R = matrix.elements;
        // Calculate matrix determinant
        var determinant = R[0] * R[4] * R[8]
            - R[0] * R[5] * R[7]
            - R[1] * R[3] * R[8]
            + R[1] * R[5] * R[6]
            + R[2] * R[3] * R[7]
            - R[2] * R[4] * R[6];
        // Normalize matrix values
        R[0] /= determinant;
        R[1] /= determinant;
        R[2] /= determinant;
        R[3] /= determinant;
        R[4] /= determinant;
        R[5] /= determinant;
        R[6] /= determinant;
        R[7] /= determinant;
        R[8] /= determinant;
        matrix.elements = R;
        return matrix;
    };
    RotationMatrix.rotateByAxisAngle = function (targetRotationMatrix, axis, angle) {
        var transformMatrix = RotationMatrix.empty();
        transformMatrix.identity(); // reset transform matrix
        var validAxis = false;
        var sA = Math.sin(angle);
        var cA = Math.cos(angle);
        if (axis[0] === 1 && axis[1] === 0 && axis[2] === 0) { // x
            validAxis = true;
            transformMatrix.elements[4] = cA;
            transformMatrix.elements[5] = -sA;
            transformMatrix.elements[7] = sA;
            transformMatrix.elements[8] = cA;
        }
        if (axis[1] === 1 && axis[0] === 0 && axis[2] === 0) { // y
            validAxis = true;
            transformMatrix.elements[0] = cA;
            transformMatrix.elements[2] = sA;
            transformMatrix.elements[6] = -sA;
            transformMatrix.elements[8] = cA;
        }
        if (axis[2] === 1 && axis[0] === 0 && axis[1] === 0) { // z
            validAxis = true;
            transformMatrix.elements[0] = cA;
            transformMatrix.elements[1] = -sA;
            transformMatrix.elements[3] = sA;
            transformMatrix.elements[4] = cA;
        }
        if (validAxis) {
            return RotationMatrix.normalize(RotationMatrix.multiplyMatrices(targetRotationMatrix, transformMatrix));
        }
        return targetRotationMatrix;
    };
    RotationMatrix.empty = function () {
        return new RotationMatrix(0, 0, 0, 0, 0, 0, 0, 0, 0);
    };
    return RotationMatrix;
}());
exports.RotationMatrix = RotationMatrix;
//# sourceMappingURL=rotationMatrix.js.map