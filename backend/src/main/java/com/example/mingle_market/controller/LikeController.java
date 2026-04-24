package com.example.mingle_market.controller;

import com.example.mingle_market.dto.LikeDto;
import com.example.mingle_market.dto.ProductDto;
import com.example.mingle_market.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LikeController {
  
  private final LikeService likeService;

  // 찜 토글
  @PostMapping("/toggle")
  public void toggleLike(@RequestBody LikeDto like) {
    likeService.toggleLike(like);
  }

  // 찜 여부 확인
  @GetMapping("/check")
  public boolean isLiked(@RequestParam String userId, @RequestParam Long productId) {
    LikeDto like = new LikeDto();
    like.setUserId(userId);
    like.setProductId(productId);
    return likeService.isLiked(like);
  }

  // 찜 목록
  @GetMapping("/{userId}")
  public List<ProductDto> getLikedProducts(@PathVariable String userId) {
    return likeService.getLikeProducts(userId);
  }
}
