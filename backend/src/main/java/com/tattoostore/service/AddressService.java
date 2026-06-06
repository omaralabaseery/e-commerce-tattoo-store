package com.tattoostore.service;

import com.tattoostore.dto.AddressDtos.*;
import com.tattoostore.entity.Address;
import com.tattoostore.exception.ApiException;
import com.tattoostore.repository.AddressRepository;
import com.tattoostore.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final CurrentUser currentUser;

    public List<AddressResponse> list() {
        return addressRepository.findByUserId(currentUser.requireId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public AddressResponse create(AddressRequest req) {
        Address a = new Address();
        a.setUserId(currentUser.requireId());
        apply(a, req);
        return toResponse(addressRepository.save(a));
    }

    @Transactional
    public AddressResponse update(Long id, AddressRequest req) {
        Address a = owned(id);
        apply(a, req);
        return toResponse(addressRepository.save(a));
    }

    @Transactional
    public void delete(Long id) {
        addressRepository.delete(owned(id));
    }

    private Address owned(Long id) {
        Address a = addressRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Address not found"));
        if (!a.getUserId().equals(currentUser.requireId())) {
            throw ApiException.notFound("Address not found");
        }
        return a;
    }

    private void apply(Address a, AddressRequest req) {
        a.setFullName(req.fullName());
        a.setPhone(req.phone());
        if (req.country() != null) a.setCountry(req.country());
        a.setCity(req.city());
        a.setArea(req.area());
        a.setBlock(req.block());
        a.setStreet(req.street());
        a.setBuilding(req.building());
        a.setFloor(req.floor());
        a.setApartment(req.apartment());
        a.setNotes(req.notes());
        if (req.isDefault() != null) a.setIsDefault(req.isDefault());
    }

    private AddressResponse toResponse(Address a) {
        return new AddressResponse(a.getId(), a.getFullName(), a.getPhone(), a.getCountry(),
                a.getCity(), a.getArea(), a.getBlock(), a.getStreet(), a.getBuilding(),
                a.getFloor(), a.getApartment(), a.getNotes(), a.getIsDefault());
    }
}
