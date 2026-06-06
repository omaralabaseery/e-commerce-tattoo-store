package com.tattoostore.controller;

import com.tattoostore.dto.AddressDtos.*;
import com.tattoostore.service.AddressService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Tag(name = "Addresses")
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public List<AddressResponse> list() {
        return addressService.list();
    }

    @PostMapping
    public AddressResponse create(@Valid @RequestBody AddressRequest req) {
        return addressService.create(req);
    }

    @PutMapping("/{id}")
    public AddressResponse update(@PathVariable Long id, @Valid @RequestBody AddressRequest req) {
        return addressService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        addressService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
