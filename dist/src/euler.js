"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rotationMatrix_1 = require("./rotationMatrix");
var constants_1 = require("./constants");
////// FULLTILT.Euler //////
var Euler = /** @class */ (function () {
    function Euler(alpha, beta, gamma) {
        this.set(alpha, beta, gamma);
    }
    Euler.prototype.set = function (alpha, beta, gamma) {
        this.alpha = alpha || 0;
        this.beta = beta || 0;
        this.gamma = gamma || 0;
    };
    Euler.prototype.copy = function (inEuler) {
        this.alpha = inEuler.alpha;
        this.beta = inEuler.beta;
        this.gamma = inEuler.gamma;
    };
    Euler.prototype.setFromRotationMatrix = function (matrix) {
        var R = matrix.elements;
        var _alpha;
        var _beta;
        var _gamma;
        if (R[8] > 0) { // cos(beta) > 0
            _alpha = Math.atan2(-R[1], R[4]);
            _beta = Math.asin(R[7]); // beta (-pi/2, pi/2)
            _gamma = Math.atan2(-R[6], R[8]); // gamma (-pi/2, pi/2)
        }
        else if (R[8] < 0) { // cos(beta) < 0
            _alpha = Math.atan2(R[1], -R[4]);
            _beta = -Math.asin(R[7]);
            _beta += (_beta >= 0) ? -constants_1.M_PI : constants_1.M_PI; // beta [-pi,-pi/2) U (pi/2,pi)
            _gamma = Math.atan2(R[6], -R[8]); // gamma (-pi/2, pi/2)
        }
        else { // R[8] == 0
            if (R[6] > 0) { // cos(gamma) == 0, cos(beta) > 0
                _alpha = Math.atan2(-R[1], R[4]);
                _beta = Math.asin(R[7]); // beta [-pi/2, pi/2]
                _gamma = -constants_1.M_PI_2; // gamma = -pi/2
            }
            else if (R[6] < 0) { // cos(gamma) == 0, cos(beta) < 0
                _alpha = Math.atan2(R[1], -R[4]);
                _beta = -Math.asin(R[7]);
                _beta += (_beta >= 0) ? -constants_1.M_PI : constants_1.M_PI; // beta [-pi,-pi/2) U (pi/2,pi)
                _gamma = -constants_1.M_PI_2; // gamma = -pi/2
            }
            else { // R[6] == 0, cos(beta) == 0
                // gimbal lock discontinuity
                _alpha = Math.atan2(R[3], R[0]);
                _beta = (R[7] > 0) ? constants_1.M_PI_2 : -constants_1.M_PI_2; // beta = +-pi/2
                _gamma = 0; // gamma = 0
            }
        }
        // alpha is in [-pi, pi], make sure it is in [0, 2*pi).
        if (_alpha < 0) {
            _alpha += constants_1.M_2_PI; // alpha [0, 2*pi)
        }
        // Convert to degrees
        _alpha *= constants_1.radToDeg;
        _beta *= constants_1.radToDeg;
        _gamma *= constants_1.radToDeg;
        // apply derived euler angles to current object
        this.set(_alpha, _beta, _gamma);
    };
    ;
    Euler.prototype.setFromQuaternion = function (q) {
        var _alpha = 0;
        var _beta = 0;
        var _gamma = 0;
        var sqw = q.w * q.w;
        var sqx = q.x * q.x;
        var sqy = q.y * q.y;
        var sqz = q.z * q.z;
        var unitLength = sqw + sqx + sqy + sqz; // Normalised == 1, otherwise correction divisor.
        var wxyz = q.w * q.x + q.y * q.z;
        var epsilon = 1e-6; // rounding factor
        if (wxyz > (0.5 - epsilon) * unitLength) {
            _alpha = 2 * Math.atan2(q.y, q.w);
            _beta = constants_1.M_PI_2;
            _gamma = 0;
        }
        if (wxyz < (-0.5 + epsilon) * unitLength) {
            _alpha = -2 * Math.atan2(q.y, q.w);
            _beta = -constants_1.M_PI_2;
            _gamma = 0;
        }
        if (wxyz >= (-0.5 + epsilon) * unitLength) {
            var aX = sqw - sqx + sqy - sqz;
            var aY = 2 * (q.w * q.z - q.x * q.y);
            var gX = sqw - sqx - sqy + sqz;
            var gY = 2 * (q.w * q.y - q.x * q.z);
            if (gX > 0) {
                _alpha = Math.atan2(aY, aX);
                _beta = Math.asin(2 * wxyz / unitLength);
                _gamma = Math.atan2(gY, gX);
            }
            else {
                _alpha = Math.atan2(-aY, -aX);
                _beta = -Math.asin(2 * wxyz / unitLength);
                _beta += _beta < 0 ? constants_1.M_PI : -constants_1.M_PI;
                _gamma = Math.atan2(-gY, -gX);
            }
        }
        // alpha is in [-pi, pi], make sure it is in [0, 2*pi).
        if (_alpha < 0) {
            _alpha += constants_1.M_2_PI; // alpha [0, 2*pi)
        }
        // Convert to degrees
        _alpha *= constants_1.radToDeg;
        _beta *= constants_1.radToDeg;
        _gamma *= constants_1.radToDeg;
        // apply derived euler angles to current object
        this.set(_alpha, _beta, _gamma);
    };
    ;
    Euler.prototype.rotateX = function (angle) {
        Euler.rotateByAxisAngle(this, [1, 0, 0], angle);
        return this;
    };
    Euler.prototype.rotateY = function (angle) {
        Euler.rotateByAxisAngle(this, [0, 1, 0], angle);
        return this;
    };
    Euler.prototype.rotateZ = function (angle) {
        Euler.rotateByAxisAngle(this, [0, 0, 1], angle);
        return this;
    };
    Euler.rotateByAxisAngle = function (targetEuler, axis, angle) {
        var matrix = rotationMatrix_1.RotationMatrix.empty();
        matrix.setFromEuler(targetEuler);
        targetEuler.setFromRotationMatrix(rotationMatrix_1.RotationMatrix.rotateByAxisAngle(matrix, axis, angle));
        return targetEuler;
    };
    Euler.empty = function () {
        return new Euler(0, 0, 0);
    };
    return Euler;
}());
exports.Euler = Euler;
;
//# sourceMappingURL=euler.js.map