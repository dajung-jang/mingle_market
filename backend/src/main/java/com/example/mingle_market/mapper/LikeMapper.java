package com.example.mingle_market.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.example.mingle_market.dto.LikeDto;
import com.example.mingle_market.dto.ProductDto;

@Mapper
public interface LikeMapper {
// 찜 추가
  void insertLike(LikeDto lkie);
  // 찜 삭제
  void deleteLike(LikeDto like);
  // 찜 여부 확인
  LikeDto findLike(LikeDto like);
  // 유저 찜 목록 (상품 정보 포함)
  List<ProductDto> getLikeProducts(String userId);
  // 찜한 유저한테 가격 변ehd 알리기(상품별 좋아요한 사람)
  List<LikeDto> getLikesByProductId(Long productId);
}
