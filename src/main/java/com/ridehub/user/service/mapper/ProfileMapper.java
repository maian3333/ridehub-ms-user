package com.ridehub.user.service.mapper;

import com.ridehub.user.domain.FileUser;
import com.ridehub.user.domain.Profile;
import com.ridehub.user.service.dto.FileUserDTO;
import com.ridehub.user.service.dto.ProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Profile} and its DTO {@link ProfileDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProfileMapper extends EntityMapper<ProfileDTO, Profile> {
    @Mapping(target = "avatar", source = "avatar", qualifiedByName = "fileUserId")
    ProfileDTO toDto(Profile s);

    @Named("fileUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    FileUserDTO toDtoFileUserId(FileUser fileUser);
}
