import { Ros } from './Ros';
import { Service } from './Service';

export class Param {
    ros: Ros;
    name: string;

    constructor(
        ros: Ros,
        name: string,
    ) {
        this.ros = ros;
        this.name = name;
    }

    get(callback: (response: any) => void) {
        const paramClient = new Service(
            this.ros,
            '/rosapi/get_param',
            'rosapi_msgs/GetParam',
        );

        paramClient.callService({
            name: this.name,
        }, (response: any) => {
            const value = JSON.parse(response.value);
            callback(value);
        });
    }

    set(value: any, callback?: (response: any) => void) {
        const paramClient = new Service(
            this.ros,
            '/rosapi/set_param',
            'rosapi_msgs/SetParam',
        );

        paramClient.callService({
            name: this.name,
            value: JSON.stringify(value),
        }, callback);
    }

    delete(callback?: (response: any) => void) {
        const paramClient = new Service(
            this.ros,
            '/rosapi/delete_param',
            'rosapi_msgs/DeleteParam',
        );

        paramClient.callService({
            name: this.name,
        }, callback);
    }

}
