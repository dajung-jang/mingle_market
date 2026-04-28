package com.example.mingle_market.service;

import org.springframework.stereotype.Service;

import com.example.mingle_market.dto.UserDto;
import com.example.mingle_market.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
  
  private final UserMapper userMapper;
  
  public void createUser(UserDto user) {
    userMapper.insertUser(user);
  }

  public UserDto getUserById(String id) {
    return userMapper.getUserById(id);
  }
}
