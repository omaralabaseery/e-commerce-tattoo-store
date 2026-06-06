package com.tattoostore.dto;

import jakarta.validation.constraints.NotBlank;

public final class AddressDtos {
    private AddressDtos() {}

    public record AddressRequest(
            @NotBlank String fullName,
            @NotBlank String phone,
            String country,
            String city,
            String area,
            String block,
            String street,
            String building,
            String floor,
            String apartment,
            String notes,
            Boolean isDefault
    ) {}

    public record AddressResponse(
            Long id, String fullName, String phone, String country, String city,
            String area, String block, String street, String building,
            String floor, String apartment, String notes, Boolean isDefault
    ) {}
}
