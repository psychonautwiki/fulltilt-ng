import { Euler } from "./euler";
import { Quaternion } from "./quaternion";
import { RotationAxis } from "./types";
export declare class RotationMatrix {
    elements: Float32Array;
    constructor(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number);
    setFromEuler(euler: Euler): this;
    setFromQuaternion(q: Quaternion): this;
    multiply(matrix: RotationMatrix): this;
    rotateX(angle: number): this;
    rotateY(angle: number): this;
    rotateZ(angle: number): this;
    normalize(): RotationMatrix;
    identity(): this;
    set(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): void;
    copy(matrix: RotationMatrix): void;
    static multiplyMatrices(a: RotationMatrix, b: RotationMatrix): RotationMatrix;
    static normalize(matrix: RotationMatrix): RotationMatrix;
    static rotateByAxisAngle(targetRotationMatrix: RotationMatrix, axis: RotationAxis, angle: number): RotationMatrix;
    static empty(): RotationMatrix;
}
