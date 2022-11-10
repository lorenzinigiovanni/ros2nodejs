import { EventEmitter } from 'events';
import { Ros } from './Ros';

export class Topic extends EventEmitter {
    ros: Ros;
    name: string;
    messageType: string;
    subscribeId?: string;
    advertiseId?: string;

    constructor(
        ros: Ros,
        name: string,
        messageType: string,
    ) {
        super();
        this.ros = ros;
        this.name = name;
        this.messageType = messageType;

        this.onMessage = this.onMessage.bind(this);
    }

    subscribe(callback: (message: any) => void): void {
        this.on('message', callback);

        if (this.subscribeId) {
            return;
        }

        this.ros.on(this.name, this.onMessage);

        this.subscribeId = this.ros.getRandomUUID();
        this.ros.send({
            op: 'subscribe',
            id: this.subscribeId,
            topic: this.name,
            type: this.messageType,
        });
    }

    unsubscribe(callback: (message: any) => void): void {
        this.off('message', callback);

        if (this.listenerCount('message') > 0) {
            return;
        }

        if (!this.subscribeId) {
            return;
        }

        this.ros.off(this.name, this.onMessage);

        this.ros.send({
            op: 'unsubscribe',
            id: this.subscribeId,
            topic: this.name,
        });

        this.subscribeId = undefined;
    }

    advertise(): void {
        if (this.advertiseId) {
            return;
        }

        this.advertiseId = this.ros.getRandomUUID();
        this.ros.send({
            op: 'advertise',
            id: this.advertiseId,
            topic: this.name,
            type: this.messageType,
        });
    }

    unadvertise(): void {
        if (!this.advertiseId) {
            return;
        }

        this.ros.send({
            op: 'unadvertise',
            id: this.advertiseId,
            topic: this.name,
        });

        this.advertiseId = undefined;
    }

    publish(message: any): void {
        this.advertise();

        this.ros.send({
            op: 'publish',
            id: this.ros.getRandomUUID(),
            topic: this.name,
            msg: message,
        });
    }

    private onMessage(message: any): void {
        this.emit('message', message);
    }

}
