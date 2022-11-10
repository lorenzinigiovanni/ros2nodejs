import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { randomUUID } from 'crypto';

export class Ros extends EventEmitter {
    url: string;
    ws?: WebSocket;

    constructor(url: string) {
        super();
        this.url = url;

        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onMessage = this.onMessage.bind(this);
    }

    open(): void {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', this.onOpen);
        this.ws.on('close', this.onClose);
        this.ws.on('message', this.onMessage);
    }

    close(): void {
        this.ws?.close();
    }

    private onOpen(): void {
        this.emit('open');
    }

    private onClose(): void {
        this.emit('close');
    }

    private onMessage(data: any): void {
        const message = JSON.parse(data);

        if (message.op === 'publish') {
            this.emit(message.topic, message.msg);
        } else if (message.op === 'service_response') {
            this.emit(message.id, message);
        } else if (message.op === 'call_service') {
            this.emit(message.service, message);
        } else if (message.op === 'status') {
            if (message.id) {
                this.emit('status:' + message.id, message);
            } else {
                this.emit('status', message);
            }
        } else if (message.op === 'action_response') {
            this.emit(message.id, message);
        }
    }

    send(message: any): void {
        this.ws?.send(JSON.stringify(message));
    }

    getRandomUUID(): string {
        return randomUUID();
    }

}
