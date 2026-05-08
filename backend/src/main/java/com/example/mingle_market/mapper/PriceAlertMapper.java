package com.example.mingle_market.mapper;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.mingle_market.dto.PriceAlertDto;

@Mapper
public interface PriceAlertMapper {
  void insertAlert(PriceAlertDto alert);
  List<PriceAlertDto> getAlertsByUserId(String userId);
  void markAlertAsRead(Long id);
  void markAllAlertsAsRead(String userId);
  int getUnreadAlertCount(String userId);
}
