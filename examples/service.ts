/* eslint-disable no-console */

import { Ros } from '../src/Ros';
import { Service } from '../src/Service';

export async function service(): Promise<void> {
    // CONNECT TO ROSBRIDGE SERVER

    console.log('Connecting to ROS');
    const ros = new Ros('ws://localhost:9090');
    ros.open();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // SERVICE CALL

    console.log('Call service');
    const serviceClient = new Service(ros, '/spawn', 'turtlesim/Spawn');
    serviceClient.callService({
        x: 2,
        y: 2,
        theta: 0.2,
        name: '',
    }, (response: any) => {
        console.log(response);
    }, (error: any) => {
        console.log(error);
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // SERVICE SERVER

    console.log('Service server');
    const serviceServer = new Service(ros, '/my_spawn', 'turtlesim/Spawn');
    serviceServer.advertise(serviceCallback);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Unadvertise service');
    serviceServer.unadvertise();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // CLOSE CONNECTION

    console.log('Desconnecting from ROS');
    ros.close();
}

function serviceCallback(request: any, response: any): boolean {
    console.log(request);
    response['name'] = 'MyBot';
    return true;
}
