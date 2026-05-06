package com.example.mingle_market.mapper;

import com.example.mingle_market.dto.ProductDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductMapper {
    List<ProductDto> getAllProducts(@Param("size") int size, @Param("offset") int offset);
    int getTotalCount();
    ProductDto getProductById(Long id);
    void insertProduct(ProductDto product);
    void updateProduct(ProductDto product);
    void deleteProduct(Long id);
}