package com.example.mingle_market.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mingle_market.dto.UserDto;
import com.example.mingle_market.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class userController {
  private final UserService userService;

  @PostMapping
  public void createUser(@RequestBody UserDto user) {
    userService.createUser(user);
  }

  @GetMapping("/{id}")
  public UserDto getUserById(@PathVariable String id) {
    return userService.getUserById(id);
  }
}