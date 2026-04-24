package com.sliit.paf.repository.member1;

import com.sliit.paf.model.member1.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    Page<Resource> findByType(Resource.ResourceType type, Pageable pageable);

    Page<Resource> findByStatus(Resource.ResourceStatus status, Pageable pageable);

    Page<Resource> findByLocation(String location, Pageable pageable);

    List<Resource> findByStatus(Resource.ResourceStatus status);

    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:location IS NULL OR r.location LIKE %:location%)")
    Page<Resource> findByFilters(@Param("type") Resource.ResourceType type,
                                  @Param("status") Resource.ResourceStatus status,
                                  @Param("location") String location,
                                  Pageable pageable);

    @Query("SELECT r FROM Resource r WHERE " +
           "(:search IS NULL OR " +
           " LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.type) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.location) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity)")
    Page<Resource> searchResources(@Param("search") String search,
                                   @Param("type") Resource.ResourceType type,
                                   @Param("status") Resource.ResourceStatus status,
                                   @Param("location") String location,
                                   @Param("minCapacity") Integer minCapacity,
                                   Pageable pageable);
}
