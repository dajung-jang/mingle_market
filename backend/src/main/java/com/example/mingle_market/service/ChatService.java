package com.example.mingle_market.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.mingle_market.dto.ChatDto;
import com.example.mingle_market.dto.ChatRoomDto;
import com.example.mingle_market.mapper.ChatMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {
  private final ChatMapper chatMapper;

  // 채팅방 생성, 조회
  public ChatRoomDto getOrCreateRoom(ChatRoomDto room) {
    ChatRoomDto existing = chatMapper.findChatRoom(room);
    if (existing != null) return existing;
    chatMapper.insertChatRoom(room);
    return chatMapper.findChatRoom(room);
  }

  // 메세지 저장
  public void saveMessage(ChatDto message) {
    chatMapper.insertMessage(message);
  }

  // 메세지 목록
  public List<ChatDto> getMessages(Long roomId) {
    return chatMapper.getMessages(roomId);
  }

  // 나의 채팅방 목록
  public List<ChatRoomDto> getChatRooms(String userId) {
    return chatMapper.getChatRooms(userId);
  }
}
