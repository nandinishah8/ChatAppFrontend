import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css'],
})
export class ConversationComponent implements OnInit {
  currentUserId: number;
  currentReceiverId!: number;
  currentReceiver: any = {};
  messages: any[] = [];
  messageContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private chatService: ChatService,
    private http: HttpClient
  ) {
    this.currentUserId = this.userService.getLoggedInUser();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const userId = +params['userId'];
      this.currentReceiverId = userId;

      console.log('currentReceiverId:', this.currentReceiverId);

      this.getMessages(this.currentReceiverId);

      this.userService.retrieveUsers().subscribe((res) => {
        this.currentReceiver = res.find(
          (user) => user.UserId === this.currentReceiverId
        );
      });
    });
  }

  getMessages(userId: number) {
    this.messages = [];
    console.log(userId);

    this.chatService.getMessages(userId).subscribe(
      (res) => {
        console.log('getMessages response:', res);
        this.messages = res;
      }
      // (error) => {
      //   console.error('getMessages error:', error);
      //   if (error.error == 'Conversation not found') {
      //     this.messages = [];
      //   }
      // }
    );
    console.log('getMessages messages:', this.messages);
  }

  sendMessage() {
    console.log(this.messageContent);
    let body = {
      receiverId: this.currentReceiver.userId,
      content: this.messageContent,
    };
    this.chatService.sendMessage(body).subscribe((res) => {
      this.getMessages(this.currentReceiver.userId);
      this.messageContent = '';
    });
  }

  onContextMenu(event: MouseEvent, message: any) {
    event.preventDefault();
    if (message.senderId === this.currentUserId) {
      message.isEvent = !message.isEvent;
    }
  }

  onEditMessage(message: any) {
    if (message.senderId === this.currentUserId) {
      message.editMode = true;
      message.editedContent = message.content;
      message.showContextMenu = true; // Add a property to control the context menu visibility
    }
  }
  onDeleteMessage(message: any) {
    if (message.senderId === this.currentUserId) {
      message.deleteMode = true;
      message.showContextMenu = true; // Add a property to control the context menu visibility
    }
  }
}
