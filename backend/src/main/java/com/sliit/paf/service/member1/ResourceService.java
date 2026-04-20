package com.sliit.paf.service.member1;

import com.sliit.paf.dto.member1.ResourceRequest;
import com.sliit.paf.exception.ResourceNotFoundException;
import com.sliit.paf.model.member1.Resource;
import com.sliit.paf.repository.member1.ResourceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ResourceService {
    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Transactional
    public Resource createResource(ResourceRequest request) {
        Resource resource = new Resource();
        resource.setName(request.getName());
        resource.setType(Resource.ResourceType.valueOf(request.getType().toUpperCase()));
        resource.setEquipmentType(request.getEquipmentType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setAvailableFrom(request.getAvailableFrom());
        resource.setAvailableTo(request.getAvailableTo());
        resource.setStatus(Resource.ResourceStatus.valueOf(request.getStatus().toUpperCase()));

        return resourceRepository.save(resource);
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource", "id", id));
    }

    public Page<Resource> getAllResources(Pageable pageable) {
        return resourceRepository.findAll(pageable);
    }

    public Page<Resource> getResourcesByType(String type, Pageable pageable) {
        Resource.ResourceType resourceType = Resource.ResourceType.valueOf(type.toUpperCase());
        return resourceRepository.findByType(resourceType, pageable);
    }

    public Page<Resource> getResourcesByStatus(String status, Pageable pageable) {
        Resource.ResourceStatus resourceStatus = Resource.ResourceStatus.valueOf(status.toUpperCase());
        return resourceRepository.findByStatus(resourceStatus, pageable);
    }

    public Page<Resource> getResourcesByLocation(String location, Pageable pageable) {
        return resourceRepository.findByLocation(location, pageable);
    }

    public Page<Resource> getResourcesByFilters(String type, String status, String location, Pageable pageable) {
        Resource.ResourceType resourceType = type != null ? Resource.ResourceType.valueOf(type.toUpperCase()) : null;
        Resource.ResourceStatus resourceStatus = status != null ? Resource.ResourceStatus.valueOf(status.toUpperCase()) : null;
        
        return resourceRepository.findByFilters(resourceType, resourceStatus, location, pageable);
    }

    public Page<Resource> searchResources(String search, String type, String status, String location, 
                                         Integer minCapacity, Pageable pageable) {
        Resource.ResourceType resourceType = type != null && !type.isEmpty() 
            ? Resource.ResourceType.valueOf(type.toUpperCase()) : null;
        Resource.ResourceStatus resourceStatus = status != null && !status.isEmpty()
            ? Resource.ResourceStatus.valueOf(status.toUpperCase()) : null;
        
        return resourceRepository.searchResources(search, resourceType, resourceStatus, location, minCapacity, pageable);
    }

    @Transactional
    public Resource updateResource(Long id, ResourceRequest request) {
        Resource resource = getResourceById(id);

        if (request.getName() != null) {
            resource.setName(request.getName());
        }
        if (request.getType() != null) {
            resource.setType(Resource.ResourceType.valueOf(request.getType().toUpperCase()));
        }
        if (request.getEquipmentType() != null) {
            resource.setEquipmentType(request.getEquipmentType());
        }
        if (request.getCapacity() != null) {
            resource.setCapacity(request.getCapacity());
        }
        if (request.getLocation() != null) {
            resource.setLocation(request.getLocation());
        }
        if (request.getAvailableFrom() != null) {
            resource.setAvailableFrom(request.getAvailableFrom());
        }
        if (request.getAvailableTo() != null) {
            resource.setAvailableTo(request.getAvailableTo());
        }
        if (request.getStatus() != null) {
            resource.setStatus(Resource.ResourceStatus.valueOf(request.getStatus().toUpperCase()));
        }

        return resourceRepository.save(resource);
    }

    @Transactional
    public void deleteResource(Long id) {
        Resource resource = getResourceById(id);
        resourceRepository.delete(resource);
    }
}
