package com.ridehub.user.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class FileUserCriteriaTest {

    @Test
    void newFileUserCriteriaHasAllFiltersNullTest() {
        var fileUserCriteria = new FileUserCriteria();
        assertThat(fileUserCriteria).is(criteriaFiltersAre(Objects::isNull));
    }

    @Test
    void fileUserCriteriaFluentMethodsCreatesFiltersTest() {
        var fileUserCriteria = new FileUserCriteria();

        setAllFilters(fileUserCriteria);

        assertThat(fileUserCriteria).is(criteriaFiltersAre(Objects::nonNull));
    }

    @Test
    void fileUserCriteriaCopyCreatesNullFilterTest() {
        var fileUserCriteria = new FileUserCriteria();
        var copy = fileUserCriteria.copy();

        assertThat(fileUserCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::isNull)),
            criteria -> assertThat(criteria).isEqualTo(fileUserCriteria)
        );
    }

    @Test
    void fileUserCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var fileUserCriteria = new FileUserCriteria();
        setAllFilters(fileUserCriteria);

        var copy = fileUserCriteria.copy();

        assertThat(fileUserCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::nonNull)),
            criteria -> assertThat(criteria).isEqualTo(fileUserCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var fileUserCriteria = new FileUserCriteria();

        assertThat(fileUserCriteria).hasToString("FileUserCriteria{}");
    }

    private static void setAllFilters(FileUserCriteria fileUserCriteria) {
        fileUserCriteria.id();
        fileUserCriteria.bucket();
        fileUserCriteria.objectKey();
        fileUserCriteria.contentType();
        fileUserCriteria.size();
        fileUserCriteria.createdAt();
        fileUserCriteria.updatedAt();
        fileUserCriteria.isDeleted();
        fileUserCriteria.deletedAt();
        fileUserCriteria.deletedBy();
        fileUserCriteria.profileId();
        fileUserCriteria.distinct();
    }

    private static Condition<FileUserCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getBucket()) &&
                condition.apply(criteria.getObjectKey()) &&
                condition.apply(criteria.getContentType()) &&
                condition.apply(criteria.getSize()) &&
                condition.apply(criteria.getCreatedAt()) &&
                condition.apply(criteria.getUpdatedAt()) &&
                condition.apply(criteria.getIsDeleted()) &&
                condition.apply(criteria.getDeletedAt()) &&
                condition.apply(criteria.getDeletedBy()) &&
                condition.apply(criteria.getProfileId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<FileUserCriteria> copyFiltersAre(FileUserCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getBucket(), copy.getBucket()) &&
                condition.apply(criteria.getObjectKey(), copy.getObjectKey()) &&
                condition.apply(criteria.getContentType(), copy.getContentType()) &&
                condition.apply(criteria.getSize(), copy.getSize()) &&
                condition.apply(criteria.getCreatedAt(), copy.getCreatedAt()) &&
                condition.apply(criteria.getUpdatedAt(), copy.getUpdatedAt()) &&
                condition.apply(criteria.getIsDeleted(), copy.getIsDeleted()) &&
                condition.apply(criteria.getDeletedAt(), copy.getDeletedAt()) &&
                condition.apply(criteria.getDeletedBy(), copy.getDeletedBy()) &&
                condition.apply(criteria.getProfileId(), copy.getProfileId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
