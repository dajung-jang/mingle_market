package com.example.mingle_market.mapper;

import com.example.mingle_market.dto.ProductDto;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ProductMapper {
    List<ProductDto> getAllProducts();
    ProductDto getProductById(Long id);
    void insertProduct(ProductDto product);
    void updateProduct(ProductDto product);
    void deleteProduct(Long id);
}