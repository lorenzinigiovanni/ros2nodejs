/* eslint-disable no-console */

import { Ros } from '../src/Ros';
import { Topic } from '../src/Topic';

export async function topic(): Promise<void> {
    // CONNECT TO ROSBRIDGE SERVER

    console.log('Connecting to ROS');
    const ros = new Ros('ws://localhost:9090');
    ros.open();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TOPIC SUBSCRIBE

    console.log('Subscribing to /turtle1/pose');
    const pose = new Topic(ros, '/turtle1/pose', 'turtlesim/Pose');
    pose.subscribe(callback);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Unsubscribing to /turtle1/pose');
    pose.unsubscribe(callback);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TOPIC PUBLISH

    console.log('Pusblishing to /test');
    const test = new Topic(ros, '/test', 'std_msgs/String');

    for (let i = 0; i < 10; i++) {
        test.publish({ data: 'Hello world!' });
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // CLOSE CONNECTION

    console.log('Desconnecting from ROS');
    ros.close();
}

function callback(message: any): void {
    console.log(message);
}
