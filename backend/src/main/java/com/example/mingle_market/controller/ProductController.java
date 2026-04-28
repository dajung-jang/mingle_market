package com.example.mingle_market.controller;

import com.example.mingle_market.dto.ProductDto;
import com.example.mingle_market.service.ProductService;
import com.example.mingle_market.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

  private final ProductService productService;
  private final ProductImageService productImageService;

  // 전체 상품 조회
  @GetMapping
  public List<ProductDto> getAllProducts() {
    return productService.getAllProducts();
  }

  // 상품 아이디로 조회
  @GetMapping("/{id}")
  public ProductDto getProductById(@PathVariable Long id) {
    return productService.getProductById(id);
  }

  // 상품 등록
  @PostMapping
  public void addProduct(@RequestBody ProductDto product) {
    productService.addProduct(product);

    // 이미지 여러개 저장
    if (product.getImageUrls() != null && !product.getImageUrls().isEmpty()) {
      productImageService.saveImages(product.getId(), product.getImageUrls());
    }
  }

  // 상품 수정
  @PutMapping("/{id}")
  public void updateProduct(@PathVariable Long id, @RequestBody ProductDto product) {
    product.setId(id);
    productService.updateProduct(product);
  }
  
  // 상품 삭제
  @DeleteMapping("/{id}")
  public void deleteProduct(@PathVariable Long id) {
    productService.deleteProduct(id);
  }
}
