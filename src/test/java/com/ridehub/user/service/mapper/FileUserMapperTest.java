package com.ridehub.user.service.mapper;

import static com.ridehub.user.domain.FileUserAsserts.*;
import static com.ridehub.user.domain.FileUserTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FileUserMapperTest {

    private FileUserMapper fileUserMapper;

    @BeforeEach
    void setUp() {
        fileUserMapper = new FileUserMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getFileUserSample1();
        var actual = fileUserMapper.toEntity(fileUserMapper.toDto(expected));
        assertFileUserAllPropertiesEquals(expected, actual);
    }
}
