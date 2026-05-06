package com.example.mingle_market.service;

import com.example.mingle_market.dto.ProductDto;
import com.example.mingle_market.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper productMapper;

    public Map<String, Object> getAllProducts(int page, int size) {
        int offset = (page -1) * size;
        List<ProductDto> products = productMapper.getAllProducts(size, offset);
        int totalCount = productMapper.getTotalCount();
        int totalPages = (int) Math.ceil((double) totalCount / size);

        Map<String, Object> result = new HashMap<>();
        result.put("products", products);
        result.put("totalPages", totalPages);
        result.put("currentPage", page);
        return result;
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