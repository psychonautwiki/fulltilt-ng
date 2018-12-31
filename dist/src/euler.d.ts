import { RotationMatrix } from './rotationMatrix';
import { Quaternion } from './quaternion';
import { RotationAxis } from './types';
export declare class Euler {
    alpha: number;
    beta: number;
    gamma: number;
    constructor(alpha: number, beta: number, gamma: number);
    set(alpha: number, beta: number, gamma: number): void;
    copy(inEuler: Euler): void;
    setFromRotationMatrix(matrix: RotationMatrix): void;
    setFromQuaternion(q: Quaternion): void;
    rotateX(angle: number): this;
    rotateY(angle: number): this;
    rotateZ(angle: number): this;
    static rotateByAxisAngle(targetEuler: Euler, axis: RotationAxis, angle: number): Euler;
    static empty(): Euler;
}
