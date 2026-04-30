package com.example.mingle_market.controller;

import com.example.mingle_market.dto.ChatDto;
import com.example.mingle_market.dto.ChatRoomDto;
import com.example.mingle_market.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {
  
  private final ChatService chatService;
  private final SimpMessagingTemplate messagingTemplate;

  // 채팅방 생성, 조회
  @PostMapping("/api/chat/room")
  public ChatRoomDto getOrCreateRoom(@RequestBody ChatRoomDto room) {
    return chatService.getOrCreateRoom(room);
  }

  // 채팅방 목록
  @GetMapping("/api/chat/rooms/{userId}")
  public List<ChatRoomDto> getChatRooms(@PathVariable String userId) {
    return chatService.getChatRooms(userId);
  }

  // 메시지 목록
  @GetMapping("/api/chat/messages/{roomId}")
  public List<ChatDto> getMessages(@PathVariable Long roomId) {
    return chatService.getMessages(roomId);
  }

  // 메시지 전송
  @MessageMapping("/chat/{roomId}")
  public void sendMessage(@DestinationVariable Long roomId, ChatDto message) {
    System.out.println("메세지 수신 : " + message.getText());
    message.setRoomId(roomId);
    chatService.saveMessage(message);
    messagingTemplate.convertAndSend("/topic/chat/" + roomId, message);
  }
}
