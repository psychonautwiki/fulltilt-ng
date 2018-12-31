import { DeviceMotion } from "./deviceMotion";
import { DeviceOrientation } from "./deviceOrientation";

export function sign(orig_x: number) {
    const x = +orig_x;

    if (x === 0 || isNaN(x)) {
        return x;
    }

    return x > 0 ? 1 : -1;
}

export async function sensorCheck (sensor: DeviceMotion | DeviceOrientation) {
    if (!sensor) {
        return;
    }

    let tries = 0;

    while (true) {
        if (sensor && sensor.data) {
            return;
        }

        if (++tries === 20) {
            throw new Error('Did not receive data after 20 tries');
        }

        await (new Promise(res => setTimeout(res, 50)));
    }
}