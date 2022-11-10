/* eslint-disable no-console */

import { Ros } from '../src/Ros';
import { Param } from '../src/Param';

export async function param(): Promise<void> {
    // CONNECT TO ROSBRIDGE SERVER

    console.log('Connecting to ROS');
    const ros = new Ros('ws://localhost:9090');
    ros.open();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // PARAMS

    const parameter = new Param(ros, '/turtlesim:background_r');

    console.log('Get param');
    parameter.get((value: any) => {
        console.log(value);
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Set param to 255');
    parameter.set('255');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Get param');
    parameter.get((value: any) => {
        console.log(value);
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // CLOSE CONNECTION

    console.log('Desconnecting from ROS');
    ros.close();
}
