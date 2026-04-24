package com.example.mingle_market.dto;

import lombok.Data;

@Data
public class ChatRoomDto {
  private Long id;
  private Long productId;
  private String buyerId;
  private String sellerId;
  private String createdAt;
}
