package com.ridehub.user.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.ridehub.user.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FileUserDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(FileUserDTO.class);
        FileUserDTO fileUserDTO1 = new FileUserDTO();
        fileUserDTO1.setId(1L);
        FileUserDTO fileUserDTO2 = new FileUserDTO();
        assertThat(fileUserDTO1).isNotEqualTo(fileUserDTO2);
        fileUserDTO2.setId(fileUserDTO1.getId());
        assertThat(fileUserDTO1).isEqualTo(fileUserDTO2);
        fileUserDTO2.setId(2L);
        assertThat(fileUserDTO1).isNotEqualTo(fileUserDTO2);
        fileUserDTO1.setId(null);
        assertThat(fileUserDTO1).isNotEqualTo(fileUserDTO2);
    }
}
