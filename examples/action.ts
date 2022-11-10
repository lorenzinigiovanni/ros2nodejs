/* eslint-disable no-console */

import { Ros } from '../src/Ros';
import { Action } from '../src/Action';

export async function action(): Promise<void> {
    // CONNECT TO ROSBRIDGE SERVER

    console.log('Connecting to ROS');
    const ros = new Ros('ws://localhost:9090');
    ros.open();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // ACTION
    console.log('Creating action client');
    const rotateAction = new Action(
        ros,
        '/turtle1/rotate_absolute',
        'turtlesim/RotateAbsolute',
    );

    console.log('Sending goal');
    rotateAction.sendGoal({
        theta: 1.57,
    }, (result: any) => {
        console.log('Result:', result);
    }, (error: any) => {
        console.log('Error:', error);
    }, (feedback: any) => {
        console.log('Feedback:', feedback);
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Cancelling goal');
    rotateAction.cancelGoal((result: any) => {
        console.log('Cancel result:', result);
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Destroying client');
    rotateAction.destroyClient();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // CLOSE CONNECTION

    console.log('Desconnecting from ROS');
    ros.close();
}
