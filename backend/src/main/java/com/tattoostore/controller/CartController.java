package com.tattoostore.controller;

import com.tattoostore.dto.CartDtos.*;
import com.tattoostore.service.CartService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse get(@RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        return cartService.getCart(sessionId);
    }

    @PostMapping("/items")
    public CartResponse add(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
                            @Valid @RequestBody AddItemRequest req) {
        return cartService.addItem(sessionId, req);
    }

    @PutMapping("/items/{id}")
    public CartResponse update(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
                               @PathVariable Long id, @Valid @RequestBody UpdateItemRequest req) {
        return cartService.updateItem(sessionId, id, req);
    }

    @DeleteMapping("/items/{id}")
    public CartResponse remove(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
                               @PathVariable Long id) {
        return cartService.removeItem(sessionId, id);
    }

    @DeleteMapping("/clear")
    public CartResponse clear(@RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        return cartService.clear(sessionId);
    }
}
