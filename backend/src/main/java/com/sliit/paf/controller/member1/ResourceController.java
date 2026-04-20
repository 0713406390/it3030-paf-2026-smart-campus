package com.sliit.paf.controller.member1;

import com.sliit.paf.dto.member1.ResourceRequest;
import com.sliit.paf.model.member1.Resource;
import com.sliit.paf.service.member1.ResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class ResourceController {
    
    private final ResourceService resourceService;
    
    @Autowired
    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> createResource(@Valid @RequestBody ResourceRequest request) {
        Resource resource = resourceService.createResource(request);
        return new ResponseEntity<>(resource, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Page<Resource>> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Resource> resources = resourceService.getAllResources(pageable);
        return ResponseEntity.ok(resources);
    }
    
    @GetMapping("/by-type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Page<Resource>> getResourcesByType(
            @PathVariable String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Resource> resources = resourceService.getResourcesByType(type, pageable);
        return ResponseEntity.ok(resources);
    }
    
    @GetMapping("/by-status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Page<Resource>> getResourcesByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Resource> resources = resourceService.getResourcesByStatus(status, pageable);
        return ResponseEntity.ok(resources);
    }
    
    @GetMapping("/by-location/{location}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Page<Resource>> getResourcesByLocation(
            @PathVariable String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Resource> resources = resourceService.getResourcesByLocation(location, pageable);
        return ResponseEntity.ok(resources);
    }
    
    @GetMapping("/filter")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Page<Resource>> getResourcesByFilters(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Resource> resources = resourceService.getResourcesByFilters(type, status, location, pageable);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Page<Resource>> searchResources(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String capacity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        try {
            // Parse capacity value safely
            Integer minCapacity = (capacity != null && !capacity.isEmpty()) ? Integer.parseInt(capacity) : null;
            
            // Normalize empty strings to null
            String searchTerm = (search != null && !search.isEmpty()) ? search : null;
            String typeFilter = (type != null && !type.isEmpty()) ? type : null;
            String statusFilter = (status != null && !status.isEmpty()) ? status : null;
            String locationFilter = (location != null && !location.isEmpty()) ? location : null;
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Resource> resources = resourceService.searchResources(
                    searchTerm, typeFilter, statusFilter, locationFilter, minCapacity, pageable);
            return ResponseEntity.ok(resources);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequest request) {
        Resource resource = resourceService.updateResource(id, request);
        return ResponseEntity.ok(resource);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
