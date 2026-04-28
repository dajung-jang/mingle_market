package com.example.mingle_market.dto;

import lombok.Data;

@Data
public class ProductImageDto {
  private Long id;
  private Long productId;
  private String imageUrl;
  private String createAt;
}
