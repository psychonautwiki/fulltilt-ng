import { DeviceOrientation, DeviceOrientationOptions } from './deviceOrientation';
import { sensorCheck } from './utils';
import { DeviceMotion } from './deviceMotion';

export class FULLTILT {
    static version = '1.0.0';

    static async getDeviceOrientation (options: DeviceOrientationOptions) {
        const sensor = new DeviceOrientation(options);

        sensor.start();

        try {
            await sensorCheck(sensor);

            return sensor;
        } catch (err) {
            sensor.stop();

            throw new Error(
                'DeviceOrientation is not supported'
            );
        }
    }

    static async getDeviceMotion () {
        const sensor = new DeviceMotion();

        sensor.start();

        try {
            await sensorCheck(sensor);

            return sensor;
        } catch (err) {
            sensor.stop();

            throw new Error(
                'DeviceMotion is not supported'
            );
        }
    }
};

if (window !== undefined) {
    window['FULLTILT'] = FULLTILT;
}