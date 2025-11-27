package com.ridehub.user.service;

import com.ridehub.user.domain.*; // for static metamodels
import com.ridehub.user.domain.FileUser;
import com.ridehub.user.repository.FileUserRepository;
import com.ridehub.user.service.criteria.FileUserCriteria;
import com.ridehub.user.service.dto.FileUserDTO;
import com.ridehub.user.service.mapper.FileUserMapper;
import jakarta.persistence.criteria.JoinType;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link FileUser} entities in the database.
 * The main input is a {@link FileUserCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link FileUserDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class FileUserQueryService extends QueryService<FileUser> {

    private static final Logger LOG = LoggerFactory.getLogger(FileUserQueryService.class);

    private final FileUserRepository fileUserRepository;

    private final FileUserMapper fileUserMapper;

    public FileUserQueryService(FileUserRepository fileUserRepository, FileUserMapper fileUserMapper) {
        this.fileUserRepository = fileUserRepository;
        this.fileUserMapper = fileUserMapper;
    }

    /**
     * Return a {@link List} of {@link FileUserDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<FileUserDTO> findByCriteria(FileUserCriteria criteria) {
        LOG.debug("find by criteria : {}", criteria);
        final Specification<FileUser> specification = createSpecification(criteria);
        return fileUserMapper.toDto(fileUserRepository.findAll(specification));
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(FileUserCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<FileUser> specification = createSpecification(criteria);
        return fileUserRepository.count(specification);
    }

    /**
     * Function to convert {@link FileUserCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<FileUser> createSpecification(FileUserCriteria criteria) {
        Specification<FileUser> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            specification = Specification.allOf(
                Boolean.TRUE.equals(criteria.getDistinct()) ? distinct(criteria.getDistinct()) : null,
                buildRangeSpecification(criteria.getId(), FileUser_.id),
                buildStringSpecification(criteria.getBucket(), FileUser_.bucket),
                buildStringSpecification(criteria.getObjectKey(), FileUser_.objectKey),
                buildStringSpecification(criteria.getContentType(), FileUser_.contentType),
                buildRangeSpecification(criteria.getSize(), FileUser_.size),
                buildRangeSpecification(criteria.getCreatedAt(), FileUser_.createdAt),
                buildRangeSpecification(criteria.getUpdatedAt(), FileUser_.updatedAt),
                buildSpecification(criteria.getIsDeleted(), FileUser_.isDeleted),
                buildRangeSpecification(criteria.getDeletedAt(), FileUser_.deletedAt),
                buildSpecification(criteria.getDeletedBy(), FileUser_.deletedBy),
                buildSpecification(criteria.getProfileId(), root -> root.join(FileUser_.profile, JoinType.LEFT).get(Profile_.id))
            );
        }
        return specification;
    }
}
