package com.ridehub.user.domain;

import static com.ridehub.user.domain.FileUserTestSamples.*;
import static com.ridehub.user.domain.ProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ridehub.user.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FileUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FileUser.class);
        FileUser fileUser1 = getFileUserSample1();
        FileUser fileUser2 = new FileUser();
        assertThat(fileUser1).isNotEqualTo(fileUser2);

        fileUser2.setId(fileUser1.getId());
        assertThat(fileUser1).isEqualTo(fileUser2);

        fileUser2 = getFileUserSample2();
        assertThat(fileUser1).isNotEqualTo(fileUser2);
    }

    @Test
    void profileTest() {
        FileUser fileUser = getFileUserRandomSampleGenerator();
        Profile profileBack = getProfileRandomSampleGenerator();

        fileUser.setProfile(profileBack);
        assertThat(fileUser.getProfile()).isEqualTo(profileBack);
        assertThat(profileBack.getAvatar()).isEqualTo(fileUser);

        fileUser.profile(null);
        assertThat(fileUser.getProfile()).isNull();
        assertThat(profileBack.getAvatar()).isNull();
    }
}
