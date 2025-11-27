package com.ridehub.user.service.mapper;

import com.ridehub.user.domain.FileUser;
import com.ridehub.user.service.dto.FileUserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link FileUser} and its DTO {@link FileUserDTO}.
 */
@Mapper(componentModel = "spring")
public interface FileUserMapper extends EntityMapper<FileUserDTO, FileUser> {}
