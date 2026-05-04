package com.example.mingle_market.controller;

import org.springframework.web.bind.annotation.*;
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

  @PutMapping("/{id}")
  public void updateUser(@PathVariable String id, @RequestBody UserDto user) {
    user.setId(id);
    userService.updateUser(user);
  }
}