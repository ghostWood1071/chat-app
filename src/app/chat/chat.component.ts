import { AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { RealtimeService } from '../services/realtime.service';
import { webSocket } from 'rxjs/webSocket';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { User } from '../entities/User';
import { ToastrService } from 'ngx-toastr';
import { ScrollBotDirective } from '../directives/scroll-bot.directive';
import {config} from '../../env/env.config' 
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked{
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public screenSize:Array<number>; 
  public formFindContact: FormGroup;
  public founded:boolean = false;
  public user: User;
  public isMade:boolean = true;
  public notifies:Array<any>;
  public friends: Array<any>;
  public friend: any;
  public stories: Array<any>
  public account: any;
  public chatForm: FormGroup;
  public friendPage: number;
  public messPage: number;
  public scroll: ScrollBotDirective;
  public apiHost:string;
  public myself: any;
  constructor(private chatService:RealtimeService, private apiService: ApiService, private toast: ToastrService){
    this.apiHost = config.API_URL;
  }
  ngAfterViewChecked(): void {
    // this.scrollToBottom()
  }

  ngOnInit(): void {
    this.screenSize = [window.innerWidth, window.innerHeight];
    this.notifies = [];
    this.friends = [];
    this.friendPage = 0;
    this.messPage = 0;
    this.stories = [];
    this.account = localStorage.getItem("account");
    let chatBox = document.getElementById('chat-component');
    let friendBox = document.getElementById('friend-component');
    if(chatBox && friendBox){
      chatBox.style.height = (this.screenSize[1] - 250)+"px" ;
      friendBox.style.height = (this.screenSize[1] - 250)+"px";
    }
    
    this.formFindContact = new FormGroup({
      account: new FormControl()
    });

    this.chatForm = new FormGroup({
      mess: new FormControl()
    })

    this.chatService.connect().subscribe((data)=>{
      if(data.type > 2 && data.type < 4 || data.type == 5)
        this.notifies.push(data)
      else if (data.type == 4){
        if(this.friend){
          if(this.friend.account == data.sender)
            this.stories.push(data);
        }
        else{
          let index =  this.friends.findIndex(x=>x.account==data.sender);
          let friend = this.friends[index]
          if(friend){
            if (!friend.waiting)
              friend.waiting = [];
            friend.waiting.push(data) 
            this.friends.unshift(this.friends.splice(index, 1)[0]); 
          }
          else{
            this.apiService.execute({
              method: 'GET',
              url: "/api/user/find/"+data.sender
            }).subscribe((newsender)=>{
              newsender.waiting = [data]
              this.friends.unshift(newsender)
            },(err)=>{

            })
          }
          
        }
        
      }
        
    }, (error)=>{
      this.toast.error("your connection has been disconnected!")
    });

    this.apiService.execute({
      method: 'GET',
      url: '/api/user/find/'+localStorage.getItem('account'),
    }).subscribe((data)=>{
      this.myself = data;
    }, (err)=>{
      
    })

    this.apiService.execute({
      method: 'GET',
      url: '/api/user/friends/'+this.friendPage,
      auth: true
    }).subscribe((data)=>{
      this.friends = data;
    }, (err)=>{
      this.toast.error(err.data)
    })

    this.scrollToBottom();
  }

  public sendMessage(): void{
    if(this.chatForm.value.mess == ""  ||  this.chatForm.value.mess == null)
      return;
    // let accountReceive = 'string';
    let message = {
      type: 4,
      receiver: this.friend.account,
      content: this.chatForm.value.mess,
      sender: localStorage.getItem('account')
    }
    this.stories.push(message);
    this.chatService.sendMessage(message);
    this.chatForm.controls['mess'].setValue("");
    // let elem = document.getElementById('chat-component');
    this.scrollToBottom();
  }

  public find():void{
    if (this.formFindContact.value.account == localStorage.getItem('account')){
      this.toast.warning("make friend with yourself? you're so funny :))))")
      return
    }
    this.apiService.execute({
      method: 'GET',
      url: '/api/user/find/'+this.formFindContact.value.account.trim(),
    }).subscribe((data)=>{
      this.founded = true;
      this.user = data as User;
    }, (err)=>{
      console.log(err);
    })
  }

  public findChange(): void {
    this.founded = false;
    this.isMade = true;
  }

  public makeFriend(account: string): void {
    this.chatService.sendMessage({
      type: 3,
      receiver: account,
      sender: localStorage.getItem('account'),
      content: "nice to meet you"
    });
    this.isMade = false;
  }

  public showNotifies():void {
    
  }

  public accept(i: number):void{
    this.chatService.sendMessage({
      type: 5,
      content: 'accepted',
      receiver: this.notifies[i].sender,
      sender: localStorage.getItem('account')
    });
    this.notifies.splice(i, 1)
  }

  public deny(i: number):void{
    this.notifies.splice(i, 1)
  }

  public selectFriend(i:number){
    this.messPage = 0;
    this.friend = this.friends[i];
    this.stories = [];
    this.friend.waiting = undefined;
    this.apiService.execute({
      method: 'GET',
      auth: true,
      url: '/api/story/get-story/'+this.friend.account+"/"+localStorage.getItem("account")+"/"+this.messPage
    }).subscribe((data)=>{
      data = data.reverse()
      for(let row of data){
        this.stories.push(row)
      }
    }, (err)=>{
      this.toast.error(err.data);
    })
  }

  public chatPos(account:string){
    if (account == localStorage.getItem('account'))
      return 'chat-right';
    return 'chat-left';
  }

  public logOut(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("account");
    window.location.reload();
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    // if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 1) {
    if (event.target.scrollTop == 0) {
      this.messPage+=1;
      this.apiService.execute({
        method: 'GET',
        url: '/api/story/get-story/'+this.friend.account+"/"+localStorage.getItem("account")+"/"+this.messPage,
        auth: true
      }).subscribe((data)=>{
          if (data.length>0){
            data = data.reverse();
            data.concat(this.stories);
            this.stories = data;
        }
      }, (err)=>{
        console.log(err);
      })
    }
  }

  scrollToEnd(event:any){
    console.log("okc");
    
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 1) {
      this.friendPage+=1;
      this.apiService.execute({
        method: 'GET',
        url: '/api/user/friends/'+this.friendPage,
        auth: true
      }).subscribe((data)=>{
        this.friends = this.friends.concat(data)
      }, (err)=>{
        this.toast.error(err.data)
      })
    }
  }

}
