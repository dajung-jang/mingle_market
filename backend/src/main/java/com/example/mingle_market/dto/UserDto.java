package com.example.mingle_market.dto;

import lombok.Data;

@Data
public class UserDto {
  private String id;
  private String nickname;
  private String createAt;
  private String profileImage;
  private String userCity;
  private String userDistrict;
  private String userDong;
}
