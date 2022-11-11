# ROS 2 Library for Node.js

Node library for ROS 2. This is an experimental library and is not yet ready for production use.

This library is similar to [roslibjs](https://github.com/RobotWebTools/roslibjs) but with full support for ROS 2.

## Installation

This is a Node.js module available through the npm registry.
Before installing, download and install Node.js.

Installation is done using the npm install command:

```sh
$ npm install ros2nodejs
```

## Features

ROS 2 Node.js library provides the following features:

-  [ROS 2 Topics](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Topics/Understanding-ROS2-Topics.html): subscribe and publish
-  [ROS 2 Services](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Services/Understanding-ROS2-Services.html): client and server
-  [ROS 2 Parameters](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Parameters/Understanding-ROS2-Parameters.html): get and set
-  [ROS 2 Actions](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Actions/Understanding-ROS2-Actions.html): client

## Quick Start

Connect to rosbridge server:

```ts
import { Ros } from 'ros2nodejs';

const ros = new Ros('ws://localhost:9090');
ros.open();
```

Subscribe to a topic:

```ts
const topic = new Topic(ros, '/turtle1/pose', 'turtlesim/Pose');
topic.subscribe((message) => {
  console.log('Received message on ' + topic.name + ': ' + message);
});
```

Publish to a topic:

```ts
const topic = new Topic(ros, '/chatter', 'std_msgs/String');
topic.publish({message: 'Hello World!'});
```

Call a service:

```ts
const service = new Service(ros, '/spawn', 'turtlesim/Spawn');
service.callService({
    x: 2,
    y: 2,
    theta: 0.2,
    name: '',
}, (response: any) => {
    console.log(response);
}, (error: any) => {
    console.log(error);
});
```

Service server:

```ts
const service = new Service(ros, '/my_spawn', 'turtlesim/Spawn');
service.advertise((request: any, response: any) => {
    console.log('Received request on ' + service.name + ': ' + request);
    response.name = 'MyBot';
    return true;
});
```

Action client:

```ts
const action = new Action(ros, '/turtle1/rotate_absolute', 'turtlesim/RotateAbsolute');
```

Send goal

```ts
action.sendGoal({
    theta: 1.57,
}, (result: any) => {
    console.log('Result:', result);
}, (error: any) => {
    console.log('Error:', error);
}, (feedback: any) => {
    console.log('Feedback:', feedback);
});
```

Cancel goal

```ts
action.cancelGoal((result: any) => {
    console.log('Cancel result:', result);
});
```

Destroy action client

```ts
action.destroyClient();
```

Get parameter:

```ts
const param = new Param(ros, '/turtlesim:background_r');
param.get((value: any) => {
    console.log('Background red:', value);
});
```

Set parameter:

```ts
const param = new Param(ros, '/turtlesim:background_r');
param.set(255);
```

## Examples

The examples available in the github repository are to be used with the ROS `turtlesim` package and the a modified [`rosbridge_server`](https://github.com/lorenzinigiovanni/rosbridge_suite.git) package.

In a machine with ROS 2 installed, run the following commands:

```sh
$ ros2 run turtlesim turtlesim_node
```

In another command prompt, run the following commands:


- Install the modified `rosbridge_server` package:

```sh
$ cd ros2_ws/src
$ git clone https://github.com/lorenzinigiovanni/rosbridge_suite.git
```

- build the package:

```sh
$ cd ros2_ws
$ colcon build
```

- source the setup file:

```sh
$ source install/local_setup.bash
```

- run the `rosbridge_server`:

```sh
$ ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

In the same machine or in another machine in the same network, run the following commands:

- Install node.js and create a new project:

```sh
$ npm init
```

- Install the `ros2nodejs` package:

```sh
$ npm install ros2nodejs
```

- In a new file, copy the code from the [example](examples/) you want to try and run it.

## People

This library is developed by:

- [Lorenzini Giovanni](https://www.lorenzinigiovanni.com/) [@lorenzinigiovanni](https://github.com/lorenzinigiovanni)
- Diego Planchenstainer [@diegoplanchenstainer](https://github.com/diegoplanchenstainer)

## License

[MIT](LICENSE)
