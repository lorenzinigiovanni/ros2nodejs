import { Ros } from './Ros';

export class Service {
    ros: Ros;
    name: string;
    serviceType: string;
    isAdvertised = false;
    private serviceCallback?: (request: any, response: any) => boolean;

    constructor(
        ros: Ros,
        name: string,
        messageType: string,
    ) {
        this.ros = ros;
        this.name = name;
        this.serviceType = messageType;

        this.serviceResponse = this.serviceResponse.bind(this);
    }

    callService(request: any, callback?: (response: any) => void, failedCallback?: (error: any) => void): void {
        const ID = this.ros.getRandomUUID();

        this.ros.once(ID, (message: any) => {
            if (message.result !== undefined && message.result === false) {
                failedCallback?.(message.values);
            } else {
                callback?.(message.values);
            }
        });

        this.ros.send({
            op: 'call_service',
            id: ID,
            service: this.name,
            type: this.serviceType,
            args: request,
        });
    }

    advertise(callback: (request: any, response: any) => boolean): void {
        if (this.isAdvertised) {
            return;
        }

        this.serviceCallback = callback;

        this.ros.on(this.name, this.serviceResponse);
        this.ros.send({
            op: 'advertise_service',
            service: this.name,
            type: this.serviceType,
        });

        this.isAdvertised = true;
    }

    unadvertise(): void {
        if (!this.isAdvertised) {
            return;
        }

        this.ros.off(this.name, this.serviceResponse);
        this.ros.send({
            op: 'unadvertise_service',
            service: this.name,
        });

        this.isAdvertised = false;
    }

    private serviceResponse(request: any): void {
        const response = {};
        const success = this.serviceCallback?.(request.args, response);

        this.ros.send({
            op: 'service_response',
            service: this.name,
            values: response,
            result: success,
            id: request.id,
        });
    }

}
