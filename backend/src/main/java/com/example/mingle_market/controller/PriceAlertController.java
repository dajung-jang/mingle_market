package com.example.mingle_market.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mingle_market.dto.PriceAlertDto;
import com.example.mingle_market.service.PriceAlertService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PriceAlertController {
  private final PriceAlertService priceAlertService;

  @GetMapping("/{userId}")
  public List<PriceAlertDto> getAlerts(@PathVariable String userId) {
    return priceAlertService.getAlerts(userId);
  }

  @GetMapping("/unread/{userId}")
  public int getUnreadCount(@PathVariable String userId) {
    return priceAlertService.getUnreadCount(userId);
  }

  @PutMapping("/read/{id}")
  public void markAsRead(@PathVariable Long id) {
    priceAlertService.markAsRead(id);
  }

  @PutMapping("/read-all/{userId}")
  public void markAllAsRead(@PathVariable String userId) {
    priceAlertService.markAllAsRead(userId);
  }
}
