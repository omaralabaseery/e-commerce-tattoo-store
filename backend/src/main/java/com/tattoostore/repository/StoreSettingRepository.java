package com.tattoostore.repository;

import com.tattoostore.entity.StoreSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreSettingRepository extends JpaRepository<StoreSetting, String> {
}
