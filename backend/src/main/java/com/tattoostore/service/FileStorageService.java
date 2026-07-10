package com.tattoostore.service;

import com.tattoostore.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "webp", "gif", "avif");

    private final Path uploadsDir;

    public FileStorageService(@Value("${app.uploads.dir:uploads}") String uploadsDir) {
        this.uploadsDir = Paths.get(uploadsDir).toAbsolutePath().normalize();
    }

    /** Stores an image and returns its public path, e.g. "/uploads/ab12cd34.webp". */
    public String storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("No file uploaded");
        }
        String extension = extensionOf(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw ApiException.badRequest("Unsupported image type: ." + extension
                    + " (allowed: " + String.join(", ", ALLOWED_EXTENSIONS) + ")");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw ApiException.badRequest("File must be an image");
        }

        String filename = UUID.randomUUID() + "." + extension;
        try {
            Files.createDirectories(uploadsDir);
            Path target = uploadsDir.resolve(filename);
            try (var in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }
        return "/uploads/" + filename;
    }

    public Path uploadsDir() {
        return uploadsDir;
    }

    private String extensionOf(String filename) {
        if (filename == null) return "";
        int dot = filename.lastIndexOf('.');
        return dot < 0 ? "" : filename.substring(dot + 1).toLowerCase(Locale.ROOT);
    }
}
