package com.example.mingle_market.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.mingle_market.dto.LikeDto;
import com.example.mingle_market.dto.ProductDto;
import com.example.mingle_market.mapper.LikeMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

  private final LikeMapper likeMapper;
  
  // 찜 토글
  public void toggleLike(LikeDto like) {
    LikeDto existing = likeMapper.findLike(like);
    if (existing != null) {
      likeMapper.deleteLike(like);
    } else {
      likeMapper.insertLike(like);
    }
  }

  // 찜 여부 확인
  public boolean isLiked(LikeDto like) {
    return likeMapper.findLike(like) != null;
  }

  // 찜 목록
  public List<ProductDto> getLikeProducts(String userId) {
    return likeMapper.getLikeProducts(userId);
  }
}
