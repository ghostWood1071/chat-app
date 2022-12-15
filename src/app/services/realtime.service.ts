import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';;
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import {config} from 'src/env/env.config'
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private socket: WebSocketSubject<any>;

  constructor() {
  }

  public connect(){
    if (!this.socket || this.socket.closed) {
      this.socket = this.getNewWebSocket();
    }
    return this.socket
  }

  private getNewWebSocket(){
    let token = localStorage.getItem("token");
    let url = config.SOCKET_URL+"?key="+token
    return webSocket(url);
  }

  public sendMessage(msg: any) {
    this.socket.next(msg);
  }

  public close(){
    this.socket.complete();
  }
}
