import { HttpClient } from '@angular/common/http';
import { Component, OnInit, numberAttribute } from '@angular/core';
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
  receiverId!: number;
  content!: string;
  editingMessage: any | null = null;
  id!: number;
  selectedUserId!: number;
  newMessageContent: any;
  userId: any;

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

    this.loadConversation(this.userId);
  }

  getMessages(userId: number) {
    this.messages = [];
    console.log(userId);

    this.chatService.getMessages(userId).subscribe((res) => {
      console.log('getMessages response:', res);
      this.messages = res;
    });
    console.log('getMessages messages:', this.messages);
  }

  sendMessage() {
    this.chatService
      .sendNewMessage(this.selectedUserId, this.newMessageContent)
      .subscribe(
        (res) => {
          // Message sent successfully, append the new message to the conversation history
          const newMessage = {
            senderId: this.selectedUserId,
            receiverId: this.userId,
            content: this.newMessageContent,
            timestamp: new Date().toISOString(),
          };
          this.messages.push(newMessage);
          // Clear the new message input field
          this.newMessageContent = '';
        },
        (error) => {
          console.log('error in sending message', error);
          // Display relevant error message to the user
        }
      );
  }

  onContextMenu(event: MouseEvent, message: any) {
    //console.log(message);

    event.preventDefault();
    if (message.senderId === this.currentUserId) {
      message.isEvent = !message.isEvent;
    }
    this.sendMessage();
  }

  loadConversation(userId: number) {
    this.selectedUserId = userId;
    // Make a GET request to fetch the conversation history from the backend API
    this.chatService
      .getMessages(this.currentUserId)
      .subscribe((messages) => (this.messages = messages));
    console.log();
    this.messageContent;
  }

  onRightClick(event: MouseEvent, message: any) {
    event.preventDefault(); // Prevent the default context menu from showing up

    if (message.userId === this.currentUserId) {
      // If the right-clicked message is sent by the current user, allow editing
      this.editingMessage = { ...message }; // Create a copy of the message to edit
    }
  }

  acceptEdit(message: any) {
    if (this.editingMessage) {
      // Make a PUT request to the backend API to update the message content
      this.chatService
        .updateMessage(this.editingMessage.id, this.editingMessage.content)
        .subscribe(
          (updatedMessage) => {
            // Update the message in the conversation history
            const index = this.messages.findIndex(
              (m) => m.id === updatedMessage.id
            );
            if (index !== -1) {
              this.messages[index] = updatedMessage;
            }

            this.editingMessage = null; // Clear the editingMessage variable
          },
          (error) => {
            console.log('Error updating message:', error);
            // Display a relevant error message to the user (e.g., using a toaster or notification service)
          }
        );
    }
  }

  cancelEdit(message: any) {
    this.editingMessage = null; // Clear the editingMessage variable without making any changes
  }
  // onAcceptEdit(message: any) {
  //   // Update the message content with edited content
  //   message.content = message.editedContent;
  //   message.editMode = false;
  //   console.log(message);
  //   this.chatService
  //     .editMessage(message.id, message.content)
  //     .subscribe((res) => {
  //       console.log(res);
  //     });
  // }

  // onDeclineEdit(message: any) {
  //   // Revert back to original content and close the inline editor
  //   message.editMode = false;
  // }

  // onEditMessage(message: any) {
  //   if (message.senderId === this.currentUserId) {
  //     message.editMode = true;
  //     message.editedContent = message.content;
  //     message.showContextMenu = true; // Add a property to control the context menu visibility
  //   }
  // }
  // onDeleteMessage(message: any) {
  //   if (message.senderId === this.currentUserId) {
  //     message.deleteMode = true;
  //     message.showContextMenu = true; // Add a property to control the context menu visibility
  //   }
  // }

  // onAcceptDelete(message: any) {
  //   this.chatService.deleteMessage(message.id).subscribe((res) => {
  //     console.log(res);
  //     this.getMessages(this.currentReceiver.userId);
  //   });
  // }

  // onDeclineDelete(message: any) {
  //   // Revert back to original content and close the inline editor
  //   message.deleteMode = false;
  // }
}
