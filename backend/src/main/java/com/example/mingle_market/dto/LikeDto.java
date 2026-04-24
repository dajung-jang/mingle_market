package com.example.mingle_market.dto;

import lombok.Data;

@Data
public class LikeDto {
  private Long id;
  private String userId;
  private Long productId;
  private String createAt;
}
