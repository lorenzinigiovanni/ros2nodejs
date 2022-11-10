import { Ros } from './Ros';

export class Action {
    ros: Ros;
    name: string;
    actionType: string;

    constructor(
        ros: Ros,
        name: string,
        actionType: string,
    ) {
        this.ros = ros;
        this.name = name;
        this.actionType = actionType;
    }

    sendGoal(
        goal: any,
        successCallback?: (result: any) => void,
        failedCallback?: (error: any) => void,
        feedbackCallback?: (feedback: any) => void,
    ): void {
        const ID = this.ros.getRandomUUID();

        this.ros.on(ID, (message: any) => {
            if (message.response_type === 'feedback') {
                feedbackCallback?.(message.values);
            } else if (message.response_type === 'result') {
                successCallback?.(message.values);
            } else {
                failedCallback?.(message.values);
            }
        });

        this.ros.send({
            op: 'send_goal',
            id: ID,
            action_name: this.name,
            action_type: this.actionType,
            feedback: true,
            goal_msg: goal,
        });
    }

    destroyClient(): void {
        this.ros.send({
            op: 'destroy_client',
            action_type: this.actionType,
        });
    }

    cancelGoal(callback?: (result: any) => void): void {
        const ID = this.ros.getRandomUUID();

        this.ros.on(ID, (message: any) => {
            callback?.(message.values);
        });

        this.ros.send({
            op: 'cancel_goal',
            id: ID,
            action_type: this.actionType,
        });
    }

}
