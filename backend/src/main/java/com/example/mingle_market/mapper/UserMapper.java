package com.example.mingle_market.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.mingle_market.dto.UserDto;

@Mapper
public interface UserMapper {
  void insertUser(UserDto user);
  UserDto getUserById(String id);
  UserDto getUserByNickname(String nickname);
}
