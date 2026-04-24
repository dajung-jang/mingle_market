package com.example.mingle_market.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.mingle_market.dto.ChatDto;
import com.example.mingle_market.dto.ChatRoomDto;

@Mapper
public interface ChatMapper {
  // 채팅방 생성
  void insertChatRoom(ChatRoomDto room);
  // 채팅방 찾기
  ChatRoomDto findChatRoom(ChatRoomDto room);
  // 메시지 저장
  void insertMessage(ChatDto message);
  // 메시지 목록
  List<ChatDto> getMessages(Long roomId);
  // 로그인한 유저의 채팅방 목록
  List<ChatRoomDto> getChatRooms(String userId);
}