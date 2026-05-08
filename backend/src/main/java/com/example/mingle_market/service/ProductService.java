package com.example.mingle_market.service;

import com.example.mingle_market.dto.LikeDto;
import com.example.mingle_market.dto.PriceAlertDto;
import com.example.mingle_market.dto.ProductDto;
import com.example.mingle_market.mapper.LikeMapper;
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
    private final LikeMapper likeMapper;
    private final PriceAlertService priceAlertService;

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
        // 기존 가격 조회
        ProductDto existing = productMapper.getProductById(product.getId());
        // 가격 변동 시 찜한 유저들한테 알림
        if (existing != null && existing.getPrice() != product.getPrice()) {
            List<LikeDto> likes = likeMapper.getLikesByProductId(product.getId());
            for (LikeDto like : likes) {
                PriceAlertDto alert = new PriceAlertDto();
                alert.setUserId(like.getUserId());
                alert.setProductId(product.getId());
                alert.setOldPrice(existing.getPrice());
                alert.setNewPrice(product.getPrice());
                priceAlertService.createAlert(alert);
            }
        }
        productMapper.updateProduct(product);
    }

    public void deleteProduct(Long id) {
        productMapper.deleteProduct(id);
    }
}