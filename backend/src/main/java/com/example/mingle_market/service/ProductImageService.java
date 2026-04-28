package com.example.mingle_market.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.mingle_market.dto.ProductImageDto;
import com.example.mingle_market.mapper.ProductImageMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductImageService {
  
  private final ProductImageMapper productImageMapper;

  public void saveImages(Long productId, List<String> imageUrls) {
    for (String url : imageUrls) {
      ProductImageDto image = new ProductImageDto();
      image.setProductId(productId);
      image.setImageUrl(url);
      productImageMapper.insertImage(image);
    }
  }

  public List<ProductImageDto> getImages(Long productId) {
    return productImageMapper.getImagesByProductId(productId);
  }

  public void deleteImages(Long productId) {
    productImageMapper.deleteImgaesByProductId(productId);
  }
}
