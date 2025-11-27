package com.ridehub.user.repository;

import com.ridehub.user.domain.FileUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the FileUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FileUserRepository extends JpaRepository<FileUser, Long>, JpaSpecificationExecutor<FileUser> {}
