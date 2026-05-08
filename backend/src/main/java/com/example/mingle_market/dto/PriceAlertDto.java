package com.example.mingle_market.dto;
import lombok.Data;

@Data
public class PriceAlertDto {
  private Long id;
  private String userId;
  private Long productId;
  private int oldPrice;
  private int newPrice;
  private Boolean isRead;
  private String createdAt;
  private String productTitle;
  private String productImage;
}
