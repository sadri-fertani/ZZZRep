import { EventEmitter, Injectable, Inject } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr'
import { IMessage } from "src/models/IMessage";

@Injectable()
export class CommunicationService {

    messageReceived = new EventEmitter<IMessage>();
    connectionEstablished = new EventEmitter<Boolean>();

    private connectionIsEstablished = false;
    private _hubConnection: HubConnection;

    constructor(@Inject('BASE_URL') private baseUrl: string) {
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
    }

    private get Route(): string {
        return this.baseUrl;
    }

    sendMessage(message: IMessage) {
        this._hubConnection.invoke('NewMessage', message);
    }

    private createConnection() {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl(this.Route + 'MessageHub')
            .build();
    }

    private startConnection(): void {
        this._hubConnection
            .start()
            .then(() => {
                this.connectionIsEstablished = true;
                console.log('Hub connection started');
                this.connectionEstablished.emit(true);
            })
            .catch(err => {
                console.log('Error while establishing connection, retrying...');
                setTimeout(function () { this.startConnection(); }, 5000);
            });
    }

    private registerOnServerEvents(): void {
        this._hubConnection.on('MessageReceived', (data: any) => {
            this.messageReceived.emit(data);
        });
    }
}