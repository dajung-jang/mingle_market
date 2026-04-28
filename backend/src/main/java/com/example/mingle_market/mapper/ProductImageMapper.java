package com.example.mingle_market.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.mingle_market.dto.ProductImageDto;

@Mapper
public interface ProductImageMapper {
  void insertImage(ProductImageDto image);
  List<ProductImageDto> getImagesByProductId(Long productId);
  void deleteImgaesByProductId(Long productId); 
}
