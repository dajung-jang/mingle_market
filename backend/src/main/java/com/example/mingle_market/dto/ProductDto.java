package com.example.mingle_market.dto;

import java.util.List;

import lombok.Data;

@Data
public class ProductDto {
  private Long id;
  private String title;
  private int price;
  private String location;
  private String image; // 이미지 테이블 생성 전 사용
  private List<String> imageUrls;
  private String sellerId;
  private String createdAt;
  private String description;
}
