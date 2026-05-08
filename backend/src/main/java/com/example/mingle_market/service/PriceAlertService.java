package com.example.mingle_market.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.mingle_market.dto.PriceAlertDto;
import com.example.mingle_market.mapper.PriceAlertMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PriceAlertService {

  private final PriceAlertMapper priceAlertMapper;

  public void createAlert(PriceAlertDto alert) {
    priceAlertMapper.insertAlert(alert);
  }

  public List<PriceAlertDto> getAlerts(String userId) {
    return priceAlertMapper.getAlertsByUserId(userId);
  }

  public void markAsRead(Long id) {
    priceAlertMapper.markAlertAsRead(id);
  }

  public void markAllAsRead(String userId) {
    priceAlertMapper.markAllAlertsAsRead(userId);
  }
  
  public int getUnreadCount(String userId) {
    return priceAlertMapper.getUnreadAlertCount(userId);
  }
}
