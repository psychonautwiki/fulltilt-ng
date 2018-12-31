import { Euler } from "./euler";
import { RotationMatrix } from "./rotationMatrix";
import { RotationAxis } from "./types";
import { degToRad } from "./constants";
import { sign } from "./utils";

export class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor ( x: number, y: number, z: number, w: number ) {
        this.set( x, y, z, w );
    }

    set ( x: number, y: number, z: number, w: number ) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 1;
    };

    copy ( quaternion: Quaternion ) {
        this.x = quaternion.x;
        this.y = quaternion.y;
        this.z = quaternion.z;
        this.w = quaternion.w;
    };

    setFromEuler ( euler: Euler ) {
        const _z = ( euler.alpha || 0 ) * degToRad;
        const _x = ( euler.beta || 0 ) * degToRad;
        const _y = ( euler.gamma || 0 ) * degToRad;

        const _z_2 = _z / 2;
        const _x_2 = _x / 2;
        const _y_2 = _y / 2;

        const cX = Math.cos( _x_2 );
        const cY = Math.cos( _y_2 );
        const cZ = Math.cos( _z_2 );
        const sX = Math.sin( _x_2 );
        const sY = Math.sin( _y_2 );
        const sZ = Math.sin( _z_2 );

        this.set(
            sX * cY * cZ - cX * sY * sZ, // x
            cX * sY * cZ + sX * cY * sZ, // y
            cX * cY * sZ + sX * sY * cZ, // z
            cX * cY * cZ - sX * sY * sZ  // w
        );

        this.normalize();

        return this;
    };

    setFromRotationMatrix ( matrix: RotationMatrix ) {
        const R = matrix.elements;

        this.set(
            0.5 * Math.sqrt( 1 + R[0] - R[4] - R[8] ) * sign( R[7] - R[5] ), // x
            0.5 * Math.sqrt( 1 - R[0] + R[4] - R[8] ) * sign( R[2] - R[6] ), // y
            0.5 * Math.sqrt( 1 - R[0] - R[4] + R[8] ) * sign( R[3] - R[1] ), // z
            0.5 * Math.sqrt( 1 + R[0] + R[4] + R[8] )                        // w
        );

        return this;

    };

    multiply ( quaternion: Quaternion ) {
        this.copy(
            Quaternion.multiplyQuaternions( this, quaternion )
        );

        return this;
    }

    rotateX ( angle: number ) {
        this.copy(
            Quaternion.rotateByAxisAngle(
                this,
                [ 1, 0, 0 ],
                angle
            )
        );

        return this;
    }

    rotateY ( angle: number ) {
        this.copy(
            Quaternion.rotateByAxisAngle(
                this,
                [ 0, 1, 0 ],
                angle
            )
        );

        return this;

    }

    rotateZ ( angle: number ) {
        this.copy(
            Quaternion.rotateByAxisAngle(
                this,
                [ 0, 0, 1 ],
                angle
            )
        );

        return this;
    }

    normalize () {
        return Quaternion.normalize( this );
    }

    static multiplyQuaternions( a: Quaternion, b: Quaternion ) {
        const multipliedQuat = Quaternion.empty();

        const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
        const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

        multipliedQuat.set(
            qax * qbw + qaw * qbx + qay * qbz - qaz * qby, // x
            qay * qbw + qaw * qby + qaz * qbx - qax * qbz, // y
            qaz * qbw + qaw * qbz + qax * qby - qay * qbx, // z
            qaw * qbw - qax * qbx - qay * qby - qaz * qbz  // w
        );

        return multipliedQuat;
    }

    static normalize ( q: Quaternion ) {
        const len = Math.sqrt(
            q.x * q.x
            + q.y * q.y
            + q.z * q.z
            + q.w * q.w
        );

        if ( len === 0 ) {
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
    }

    static rotateByAxisAngle (
        targetQuaternion: Quaternion,
        axis: RotationAxis,
        angle: number
    ) {
        const transformQuaternion = Quaternion.empty();

        const halfAngle = ( angle || 0 ) / 2;
        const sA = Math.sin( halfAngle );

        transformQuaternion.set(
            ( axis[ 0 ] || 0 ) * sA, // x
            ( axis[ 1 ] || 0 ) * sA, // y
            ( axis[ 2 ] || 0 ) * sA, // z
            Math.cos( halfAngle )    // w
        );

        return Quaternion.normalize(
            Quaternion.multiplyQuaternions( targetQuaternion, transformQuaternion )
        );
    };

    static empty() {
        return new Quaternion(
            0, 0, 0, 0
        );
    }
};