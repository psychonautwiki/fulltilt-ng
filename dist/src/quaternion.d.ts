import { Euler } from "./euler";
import { RotationMatrix } from "./rotationMatrix";
import { RotationAxis } from "./types";
export declare class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x: number, y: number, z: number, w: number);
    set(x: number, y: number, z: number, w: number): void;
    copy(quaternion: Quaternion): void;
    setFromEuler(euler: Euler): this;
    setFromRotationMatrix(matrix: RotationMatrix): this;
    multiply(quaternion: Quaternion): this;
    rotateX(angle: number): this;
    rotateY(angle: number): this;
    rotateZ(angle: number): this;
    normalize(): Quaternion;
    static multiplyQuaternions(a: Quaternion, b: Quaternion): Quaternion;
    static normalize(q: Quaternion): Quaternion;
    static rotateByAxisAngle(targetQuaternion: Quaternion, axis: RotationAxis, angle: number): Quaternion;
    static empty(): Quaternion;
}
