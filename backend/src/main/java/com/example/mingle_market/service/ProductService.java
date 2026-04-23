package com.example.mingle_market.service;

import com.example.mingle_market.dto.ProductDto;
import com.example.mingle_market.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper productMapper;

    public List<ProductDto> getAllProducts() {
        return productMapper.getAllProducts();
    }

    public ProductDto getProductById(Long id) {
        return productMapper.getProductById(id);
    }

    public void addProduct(ProductDto product) {
        productMapper.insertProduct(product);
    }

    public void updateProduct(ProductDto product) {
        productMapper.updateProduct(product);
    }

    public void deleteProduct(Long id) {
        productMapper.deleteProduct(id);
    }
}