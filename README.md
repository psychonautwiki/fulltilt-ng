fulltilt-ng
==========

#### Dependency-free device orientation + motion detection, normalization and conversion library ####

<img src="https://i.imgur.com/xFrE9LM.gif" width=100%/>

fulltilt-ng is a TypeScript library that detects support for device orientation and device motion sensor data and then normalizes that data across different platforms for web applications to use within their own 'world' or 'game' based frames.

fulltilt-ng provides developers with three complementary device orientation sensor output representations – screen-adjusted Quaternions, Rotation Matrixes and Euler Angles – that can be used to create 2D or 3D experiences in web browsers that work consistently across all mobile web platforms and in all screen orientations.

This library also provides all the functions necessary to convert between different device orientation types. Orientation angle conversion is possible via this API from/to Device Orientation and Motion API-derived [Euler Angles](http://en.wikipedia.org/wiki/Euler_angles), [Rotation Matrices](http://en.wikipedia.org/wiki/Rotation_matrix) and/or [Quaternions](http://en.wikipedia.org/wiki/Quaternion) (i.e. from raw sensor inputs that supply intrinsic Tait-Bryan angles of type Z-X'-Y').

## Usage ##

You can request device orientation and motion sensor changes by calling either `FULLTILT.getDeviceOrientation()` or `FULLTILT.getDeviceMotion()`.

If the requested sensor is supported on the current device, the returned promise will resolve to either `FULLTILT.DeviceOrientation` or `FULLTILT.DeviceMotion`. This returned object can then be used to interact with the device's sensors via the FULLTILT APIs.

The promise will reject accordingly if the requested APIs are not available on the current device. In such circumstances it is recommended to provide manual fallback controls so users can still interact with your web page appropriately.

Here is a quick example of how to use fulltilt-ng:

```javascript
import { FULLTILT } from 'fulltilt-ng';

(async () => {
    try {
        const deviceOrientation = await FULLTILT.getDeviceOrientation({
            type: 'world'
        });

        const draw = () => {
            if (deviceOrientation) {
                const quaternion = deviceOrientation.getScreenAdjustedQuaternion();
                const matrix = deviceOrientation.getScreenAdjustedMatrix();
                const euler = deviceOrientation.getScreenAdjustedEuler();
        
                console.log(
                    quaternion,
                    matrix,
                    euler
                );
            }

            requestAnimationFrame(draw);
        };

        draw();
    } catch(err) {
        // device orientation not supported
    }
})();
```

## Notes ##

* This project is based on the original implementation “[Full Tilt](https://github.com/adtile/Full-Tilt)”
* [W3C DeviceOrientation Events Spec](http://w3c.github.io/deviceorientation/spec-source-orientation.html)

---

Originally copyright (c) 2015 Adtile Technologies Inc. under CC BY-NC 4.0 license.

MIT License

Copyright (c) 2019 Kenan Sulayman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.