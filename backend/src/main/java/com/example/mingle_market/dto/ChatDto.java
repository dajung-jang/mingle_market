package com.example.mingle_market.dto;

import lombok.Data;

@Data
public class ChatDto {
  private Long id;
  private Long roomId;
  private String senderId;
  private String text;
  private String createdAt;
}
