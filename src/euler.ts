import {RotationMatrix} from './rotationMatrix';
import {
    M_PI,
    M_PI_2,
    M_2_PI,
    radToDeg
} from './constants';
import { Quaternion } from './quaternion';
import { RotationAxis } from './types';

////// FULLTILT.Euler //////

export class Euler {
    alpha : number;
    beta: number;
    gamma: number;

    constructor ( alpha: number, beta: number, gamma: number ) {
        this.set( alpha, beta, gamma );
    }

    set ( alpha: number, beta: number, gamma: number ) {
        this.alpha = alpha || 0;
        this.beta  = beta  || 0;
        this.gamma = gamma || 0;
    }

    copy ( inEuler: Euler ) {
        this.alpha = inEuler.alpha;
        this.beta  = inEuler.beta;
        this.gamma = inEuler.gamma;
    }

    setFromRotationMatrix ( matrix: RotationMatrix ) {
        const R = matrix.elements;

        let _alpha: number;
        let _beta: number;
        let _gamma: number;

        if (R[8] > 0) { // cos(beta) > 0
            _alpha = Math.atan2(-R[1], R[4]);
            _beta  = Math.asin(R[7]); // beta (-pi/2, pi/2)
            _gamma = Math.atan2(-R[6], R[8]); // gamma (-pi/2, pi/2)

        } else if (R[8] < 0) {  // cos(beta) < 0
            _alpha = Math.atan2(R[1], -R[4]);
            _beta  = -Math.asin(R[7]);
            _beta  += (_beta >= 0) ? - M_PI : M_PI; // beta [-pi,-pi/2) U (pi/2,pi)
            _gamma = Math.atan2(R[6], -R[8]); // gamma (-pi/2, pi/2)
        } else { // R[8] == 0
            if (R[6] > 0) {  // cos(gamma) == 0, cos(beta) > 0
                _alpha = Math.atan2(-R[1], R[4]);
                _beta  = Math.asin(R[7]); // beta [-pi/2, pi/2]
                _gamma = - M_PI_2; // gamma = -pi/2

            } else if (R[6] < 0) { // cos(gamma) == 0, cos(beta) < 0

                _alpha = Math.atan2(R[1], -R[4]);
                _beta  = -Math.asin(R[7]);
                _beta  += (_beta >= 0) ? - M_PI : M_PI; // beta [-pi,-pi/2) U (pi/2,pi)
                _gamma = - M_PI_2; // gamma = -pi/2

            } else { // R[6] == 0, cos(beta) == 0

                // gimbal lock discontinuity
                _alpha = Math.atan2(R[3], R[0]);
                _beta  = (R[7] > 0) ? M_PI_2 : - M_PI_2; // beta = +-pi/2
                _gamma = 0; // gamma = 0
            }
        }

        // alpha is in [-pi, pi], make sure it is in [0, 2*pi).
        if (_alpha < 0) {
            _alpha += M_2_PI; // alpha [0, 2*pi)
        }

        // Convert to degrees
        _alpha *= radToDeg;
        _beta  *= radToDeg;
        _gamma *= radToDeg;

        // apply derived euler angles to current object
        this.set( _alpha, _beta, _gamma );
    };

    setFromQuaternion ( q: Quaternion ) {

        let _alpha, _beta, _gamma: number;

        const sqw = q.w * q.w;
        const sqx = q.x * q.x;
        const sqy = q.y * q.y;
        const sqz = q.z * q.z;

        const unitLength = sqw + sqx + sqy + sqz; // Normalised == 1, otherwise correction divisor.
        const wxyz = q.w * q.x + q.y * q.z;
        const epsilon = 1e-6; // rounding factor

        if (wxyz > (0.5 - epsilon) * unitLength) {
            _alpha = 2 * Math.atan2(q.y, q.w);
            _beta = M_PI_2;
            _gamma = 0;
        }
        
        if (wxyz < (-0.5 + epsilon) * unitLength) {
            _alpha = -2 * Math.atan2(q.y, q.w);
            _beta = -M_PI_2;
            _gamma = 0;
        }
        
        if (wxyz >= (-0.5 + epsilon) * unitLength) {
            const aX = sqw - sqx + sqy - sqz;
            const aY = 2 * (q.w * q.z - q.x * q.y);

            const gX = sqw - sqx - sqy + sqz;
            const gY = 2 * (q.w * q.y - q.x * q.z);

            if (gX > 0) {
                _alpha = Math.atan2(aY, aX);
                _beta  = Math.asin(2 * wxyz / unitLength);
                _gamma = Math.atan2(gY, gX);
            } else {
                _alpha = Math.atan2(-aY, -aX);
                _beta  = -Math.asin(2 * wxyz / unitLength);
                _beta  += _beta < 0 ? M_PI : - M_PI;
                _gamma = Math.atan2(-gY, -gX);
            }
        }

        // alpha is in [-pi, pi], make sure it is in [0, 2*pi).
        if (_alpha < 0) {
            _alpha += M_2_PI; // alpha [0, 2*pi)
        }

        // Convert to degrees
        _alpha *= radToDeg;
        _beta  *= radToDeg;
        _gamma *= radToDeg;

        // apply derived euler angles to current object
        this.set( _alpha, _beta, _gamma );
    };

    rotateX ( angle: number ) {
        Euler.rotateByAxisAngle(
            this, 
            [ 1, 0, 0 ],
            angle
        );

        return this;
    }

    rotateY ( angle: number ) {
        Euler.rotateByAxisAngle(
            this,
            [ 0, 1, 0 ],
            angle
        );

        return this;
    }

    rotateZ ( angle: number ) {
        Euler.rotateByAxisAngle(
            this,
            [ 0, 0, 1 ],
            angle
        );

        return this;
    }

    static rotateByAxisAngle(
        targetEuler: Euler,
        axis: RotationAxis,
        angle: number
    ) {
        const matrix = RotationMatrix.empty();

        matrix.setFromEuler( targetEuler );

        targetEuler.setFromRotationMatrix(
            RotationMatrix.rotateByAxisAngle(
                matrix, axis, angle
            )
        );

        return targetEuler;
    }

    static empty() {
        return new Euler(
            0, 0, 0
        );
    }
};