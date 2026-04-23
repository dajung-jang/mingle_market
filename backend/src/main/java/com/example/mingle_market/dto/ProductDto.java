package com.example.mingle_market.dto;

import lombok.Data;

@Data
public class ProductDto {
  private Long id;
  private String title;
  private int price;
  private String location;
  private String image;
  private String sellerId;
  private String createdAt;
}
