package com.ridehub.user.web.rest;

import static com.ridehub.user.domain.FileUserAsserts.*;
import static com.ridehub.user.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ridehub.user.IntegrationTest;
import com.ridehub.user.domain.FileUser;
import com.ridehub.user.repository.FileUserRepository;
import com.ridehub.user.service.dto.FileUserDTO;
import com.ridehub.user.service.mapper.FileUserMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FileUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FileUserResourceIT {

    private static final String DEFAULT_BUCKET = "AAAAAAAAAA";
    private static final String UPDATED_BUCKET = "BBBBBBBBBB";

    private static final String DEFAULT_OBJECT_KEY = "AAAAAAAAAA";
    private static final String UPDATED_OBJECT_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT_TYPE = "BBBBBBBBBB";

    private static final Long DEFAULT_SIZE = 1L;
    private static final Long UPDATED_SIZE = 2L;
    private static final Long SMALLER_SIZE = 1L - 1L;

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_IS_DELETED = false;
    private static final Boolean UPDATED_IS_DELETED = true;

    private static final Instant DEFAULT_DELETED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DELETED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final UUID DEFAULT_DELETED_BY = UUID.randomUUID();
    private static final UUID UPDATED_DELETED_BY = UUID.randomUUID();

    private static final String ENTITY_API_URL = "/api/file-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private FileUserRepository fileUserRepository;

    @Autowired
    private FileUserMapper fileUserMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFileUserMockMvc;

    private FileUser fileUser;

    private FileUser insertedFileUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FileUser createEntity() {
        return new FileUser()
            .bucket(DEFAULT_BUCKET)
            .objectKey(DEFAULT_OBJECT_KEY)
            .contentType(DEFAULT_CONTENT_TYPE)
            .size(DEFAULT_SIZE)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .isDeleted(DEFAULT_IS_DELETED)
            .deletedAt(DEFAULT_DELETED_AT)
            .deletedBy(DEFAULT_DELETED_BY);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FileUser createUpdatedEntity() {
        return new FileUser()
            .bucket(UPDATED_BUCKET)
            .objectKey(UPDATED_OBJECT_KEY)
            .contentType(UPDATED_CONTENT_TYPE)
            .size(UPDATED_SIZE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .isDeleted(UPDATED_IS_DELETED)
            .deletedAt(UPDATED_DELETED_AT)
            .deletedBy(UPDATED_DELETED_BY);
    }

    @BeforeEach
    void initTest() {
        fileUser = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedFileUser != null) {
            fileUserRepository.delete(insertedFileUser);
            insertedFileUser = null;
        }
    }

    @Test
    @Transactional
    void createFileUser() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the FileUser
        FileUserDTO fileUserDTO = fileUserMapper.toDto(fileUser);
        var returnedFileUserDTO = om.readValue(
            restFileUserMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(fileUserDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            FileUserDTO.class
        );

        // Validate the FileUser in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedFileUser = fileUserMapper.toEntity(returnedFileUserDTO);
        assertFileUserUpdatableFieldsEquals(returnedFileUser, getPersistedFileUser(returnedFileUser));

        insertedFileUser = returnedFileUser;
    }

    @Test
    @Transactional
    void createFileUserWithExistingId() throws Exception {
        // Create the FileUser with an existing ID
        fileUser.setId(1L);
        FileUserDTO fileUserDTO = fileUserMapper.toDto(fileUser);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFileUserMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(fileUserDTO)))
            .andExpect(status().isBadRequest());

        // Validate the FileUser in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkBucketIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        fileUser.setBucket(null);

        // Create the FileUser, which fails.
        FileUserDTO fileUserDTO = fileUserMapper.toDto(fileUser);

        restFileUserMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(fileUserDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkObjectKeyIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        fileUser.setObjectKey(null);

        // Create the FileUser, which fails.
        FileUserDTO fileUserDTO = fileUserMapper.toDto(fileUser);

        restFileUserMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(fileUserDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedAtIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        fileUser.setCreatedAt(null);

        // Create the FileUser, which fails.
        FileUserDTO fileUserDTO = fileUserMapper.toDto(fileUser);

        restFileUserMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(fileUserDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFileUsers() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList
        restFileUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fileUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].bucket").value(hasItem(DEFAULT_BUCKET)))
            .andExpect(jsonPath("$.[*].objectKey").value(hasItem(DEFAULT_OBJECT_KEY)))
            .andExpect(jsonPath("$.[*].contentType").value(hasItem(DEFAULT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].size").value(hasItem(DEFAULT_SIZE.intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())))
            .andExpect(jsonPath("$.[*].isDeleted").value(hasItem(DEFAULT_IS_DELETED)))
            .andExpect(jsonPath("$.[*].deletedAt").value(hasItem(DEFAULT_DELETED_AT.toString())))
            .andExpect(jsonPath("$.[*].deletedBy").value(hasItem(DEFAULT_DELETED_BY.toString())));
    }

    @Test
    @Transactional
    void getFileUser() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get the fileUser
        restFileUserMockMvc
            .perform(get(ENTITY_API_URL_ID, fileUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fileUser.getId().intValue()))
            .andExpect(jsonPath("$.bucket").value(DEFAULT_BUCKET))
            .andExpect(jsonPath("$.objectKey").value(DEFAULT_OBJECT_KEY))
            .andExpect(jsonPath("$.contentType").value(DEFAULT_CONTENT_TYPE))
            .andExpect(jsonPath("$.size").value(DEFAULT_SIZE.intValue()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()))
            .andExpect(jsonPath("$.isDeleted").value(DEFAULT_IS_DELETED))
            .andExpect(jsonPath("$.deletedAt").value(DEFAULT_DELETED_AT.toString()))
            .andExpect(jsonPath("$.deletedBy").value(DEFAULT_DELETED_BY.toString()));
    }

    @Test
    @Transactional
    void getFileUsersByIdFiltering() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        Long id = fileUser.getId();

        defaultFileUserFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultFileUserFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultFileUserFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllFileUsersByBucketIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where bucket equals to
        defaultFileUserFiltering("bucket.equals=" + DEFAULT_BUCKET, "bucket.equals=" + UPDATED_BUCKET);
    }

    @Test
    @Transactional
    void getAllFileUsersByBucketIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where bucket in
        defaultFileUserFiltering("bucket.in=" + DEFAULT_BUCKET + "," + UPDATED_BUCKET, "bucket.in=" + UPDATED_BUCKET);
    }

    @Test
    @Transactional
    void getAllFileUsersByBucketIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where bucket is not null
        defaultFileUserFiltering("bucket.specified=true", "bucket.specified=false");
    }

    @Test
    @Transactional
    void getAllFileUsersByBucketContainsSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where bucket contains
        defaultFileUserFiltering("bucket.contains=" + DEFAULT_BUCKET, "bucket.contains=" + UPDATED_BUCKET);
    }

    @Test
    @Transactional
    void getAllFileUsersByBucketNotContainsSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where bucket does not contain
        defaultFileUserFiltering("bucket.doesNotContain=" + UPDATED_BUCKET, "bucket.doesNotContain=" + DEFAULT_BUCKET);
    }

    @Test
    @Transactional
    void getAllFileUsersByObjectKeyIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where objectKey equals to
        defaultFileUserFiltering("objectKey.equals=" + DEFAULT_OBJECT_KEY, "objectKey.equals=" + UPDATED_OBJECT_KEY);
    }

    @Test
    @Transactional
    void getAllFileUsersByObjectKeyIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where objectKey in
        defaultFileUserFiltering("objectKey.in=" + DEFAULT_OBJECT_KEY + "," + UPDATED_OBJECT_KEY, "objectKey.in=" + UPDATED_OBJECT_KEY);
    }

    @Test
    @Transactional
    void getAllFileUsersByObjectKeyIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where objectKey is not null
        defaultFileUserFiltering("objectKey.specified=true", "objectKey.specified=false");
    }

    @Test
    @Transactional
    void getAllFileUsersByObjectKeyContainsSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where objectKey contains
        defaultFileUserFiltering("objectKey.contains=" + DEFAULT_OBJECT_KEY, "objectKey.contains=" + UPDATED_OBJECT_KEY);
    }

    @Test
    @Transactional
    void getAllFileUsersByObjectKeyNotContainsSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where objectKey does not contain
        defaultFileUserFiltering("objectKey.doesNotContain=" + UPDATED_OBJECT_KEY, "objectKey.doesNotContain=" + DEFAULT_OBJECT_KEY);
    }

    @Test
    @Transactional
    void getAllFileUsersByContentTypeIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where contentType equals to
        defaultFileUserFiltering("contentType.equals=" + DEFAULT_CONTENT_TYPE, "contentType.equals=" + UPDATED_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void getAllFileUsersByContentTypeIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where contentType in
        defaultFileUserFiltering(
            "contentType.in=" + DEFAULT_CONTENT_TYPE + "," + UPDATED_CONTENT_TYPE,
            "contentType.in=" + UPDATED_CONTENT_TYPE
        );
    }

    @Test
    @Transactional
    void getAllFileUsersByContentTypeIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where contentType is not null
        defaultFileUserFiltering("contentType.specified=true", "contentType.specified=false");
    }

    @Test
    @Transactional
    void getAllFileUsersByContentTypeContainsSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where contentType contains
        defaultFileUserFiltering("contentType.contains=" + DEFAULT_CONTENT_TYPE, "contentType.contains=" + UPDATED_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void getAllFileUsersByContentTypeNotContainsSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where contentType does not contain
        defaultFileUserFiltering(
            "contentType.doesNotContain=" + UPDATED_CONTENT_TYPE,
            "contentType.doesNotContain=" + DEFAULT_CONTENT_TYPE
        );
    }

    @Test
    @Transactional
    void getAllFileUsersBySizeIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where size equals to
        defaultFileUserFiltering("size.equals=" + DEFAULT_SIZE, "size.equals=" + UPDATED_SIZE);
    }

    @Test
    @Transactional
    void getAllFileUsersBySizeIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where size in
        defaultFileUserFiltering("size.in=" + DEFAULT_SIZE + "," + UPDATED_SIZE, "size.in=" + UPDATED_SIZE);
    }

    @Test
    @Transactional
    void getAllFileUsersBySizeIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where size is not null
        defaultFileUserFiltering("size.specified=true", "size.specified=false");
    }

    @Test
    @Transactional
    void getAllFileUsersBySizeIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where size is greater than or equal to
        defaultFileUserFiltering("size.greaterThanOrEqual=" + DEFAULT_SIZE, "size.greaterThanOrEqual=" + UPDATED_SIZE);
    }

    @Test
    @Transactional
    void getAllFileUsersBySizeIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where size is less than or equal to
        defaultFileUserFiltering("size.lessThanOrEqual=" + DEFAULT_SIZE, "size.lessThanOrEqual=" + SMALLER_SIZE);
    }

    @Test
    @Transactional
    void getAllFileUsersBySizeIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where size is less than
        defaultFileUserFiltering("size.lessThan=" + UPDATED_SIZE, "size.lessThan=" + DEFAULT_SIZE);
    }

    @Test
    @Transactional
    void getAllFileUsersBySizeIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where size is greater than
        defaultFileUserFiltering("size.greaterThan=" + SMALLER_SIZE, "size.greaterThan=" + DEFAULT_SIZE);
    }

    @Test
    @Transactional
    void getAllFileUsersByCreatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where createdAt equals to
        defaultFileUserFiltering("createdAt.equals=" + DEFAULT_CREATED_AT, "createdAt.equals=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllFileUsersByCreatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where createdAt in
        defaultFileUserFiltering("createdAt.in=" + DEFAULT_CREATED_AT + "," + UPDATED_CREATED_AT, "createdAt.in=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllFileUsersByCreatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where createdAt is not null
        defaultFileUserFiltering("createdAt.specified=true", "createdAt.specified=false");
    }

    @Test
    @Transactional
    void getAllFileUsersByUpdatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where updatedAt equals to
        defaultFileUserFiltering("updatedAt.equals=" + DEFAULT_UPDATED_AT, "updatedAt.equals=" + UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void getAllFileUsersByUpdatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where updatedAt in
        defaultFileUserFiltering("updatedAt.in=" + DEFAULT_UPDATED_AT + "," + UPDATED_UPDATED_AT, "updatedAt.in=" + UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void getAllFileUsersByUpdatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where updatedAt is not null
        defaultFileUserFiltering("updatedAt.specified=true", "updatedAt.specified=false");
    }

    @Test
    @Transactional
    void getAllFileUsersByIsDeletedIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where isDeleted equals to
        defaultFileUserFiltering("isDeleted.equals=" + DEFAULT_IS_DELETED, "isDeleted.equals=" + UPDATED_IS_DELETED);
    }

    @Test
    @Transactional
    void getAllFileUsersByIsDeletedIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where isDeleted in
        defaultFileUserFiltering("isDeleted.in=" + DEFAULT_IS_DELETED + "," + UPDATED_IS_DELETED, "isDeleted.in=" + UPDATED_IS_DELETED);
    }

    @Test
    @Transactional
    void getAllFileUsersByIsDeletedIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where isDeleted is not null
        defaultFileUserFiltering("isDeleted.specified=true", "isDeleted.specified=false");
    }

    @Test
    @Transactional
    void getAllFileUsersByDeletedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where deletedAt equals to
        defaultFileUserFiltering("deletedAt.equals=" + DEFAULT_DELETED_AT, "deletedAt.equals=" + UPDATED_DELETED_AT);
    }

    @Test
    @Transactional
    void getAllFileUsersByDeletedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where deletedAt in
        defaultFileUserFiltering("deletedAt.in=" + DEFAULT_DELETED_AT + "," + UPDATED_DELETED_AT, "deletedAt.in=" + UPDATED_DELETED_AT);
    }

    @Test
    @Transactional
    void getAllFileUsersByDeletedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where deletedAt is not null
        defaultFileUserFiltering("deletedAt.specified=true", "deletedAt.specified=false");
    }

    @Test
    @Transactional
    void getAllFileUsersByDeletedByIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where deletedBy equals to
        defaultFileUserFiltering("deletedBy.equals=" + DEFAULT_DELETED_BY, "deletedBy.equals=" + UPDATED_DELETED_BY);
    }

    @Test
    @Transactional
    void getAllFileUsersByDeletedByIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where deletedBy in
        defaultFileUserFiltering("deletedBy.in=" + DEFAULT_DELETED_BY + "," + UPDATED_DELETED_BY, "deletedBy.in=" + UPDATED_DELETED_BY);
    }

    @Test
    @Transactional
    void getAllFileUsersByDeletedByIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        // Get all the fileUserList where deletedBy is not null
        defaultFileUserFiltering("deletedBy.specified=true", "deletedBy.specified=false");
    }

    private void defaultFileUserFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultFileUserShouldBeFound(shouldBeFound);
        defaultFileUserShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultFileUserShouldBeFound(String filter) throws Exception {
        restFileUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fileUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].bucket").value(hasItem(DEFAULT_BUCKET)))
            .andExpect(jsonPath("$.[*].objectKey").value(hasItem(DEFAULT_OBJECT_KEY)))
            .andExpect(jsonPath("$.[*].contentType").value(hasItem(DEFAULT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].size").value(hasItem(DEFAULT_SIZE.intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())))
            .andExpect(jsonPath("$.[*].isDeleted").value(hasItem(DEFAULT_IS_DELETED)))
            .andExpect(jsonPath("$.[*].deletedAt").value(hasItem(DEFAULT_DELETED_AT.toString())))
            .andExpect(jsonPath("$.[*].deletedBy").value(hasItem(DEFAULT_DELETED_BY.toString())));

        // Check, that the count call also returns 1
        restFileUserMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultFileUserShouldNotBeFound(String filter) throws Exception {
        restFileUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restFileUserMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingFileUser() throws Exception {
        // Get the fileUser
        restFileUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFileUser() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the fileUser
        FileUser updatedFileUser = fileUserRepository.findById(fileUser.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedFileUser are not directly saved in db
        em.detach(updatedFileUser);
        updatedFileUser
            .bucket(UPDATED_BUCKET)
            .objectKey(UPDATED_OBJECT_KEY)
            .contentType(UPDATED_CONTENT_TYPE)
            .size(UPDATED_SIZE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .isDeleted(UPDATED_IS_DELETED)
            .deletedAt(UPDATED_DELETED_AT)
            .deletedBy(UPDATED_DELETED_BY);
        FileUserDTO fileUserDTO = fileUserMapper.toDto(updatedFileUser);

        restFileUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fileUserDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(fileUserDTO))
            )
            .andExpect(status().isOk());

        // Validate the FileUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedFileUserToMatchAllProperties(updatedFileUser);
    }

    @Test
    @Transactional
    void putNonExistingFileUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fileUser.setId(longCount.incrementAndGet());

        // Create the FileUser
        FileUserDTO fileUserDTO = fileUserMapper.toDto(fileUser);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFileUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fileUserDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(fileUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FileUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFileUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fileUser.setId(longCount.incrementAndGet());

        // Create the FileUser
        FileUserDTO fileUserDTO = fileUserMapper.toDto(fileUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFileUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(fileUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FileUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFileUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fileUser.setId(longCount.incrementAndGet());

        // Create the FileUser
        FileUserDTO fileUserDTO = fileUserMapper.toDto(fileUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFileUserMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(fileUserDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FileUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFileUserWithPatch() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the fileUser using partial update
        FileUser partialUpdatedFileUser = new FileUser();
        partialUpdatedFileUser.setId(fileUser.getId());

        partialUpdatedFileUser
            .bucket(UPDATED_BUCKET)
            .size(UPDATED_SIZE)
            .updatedAt(UPDATED_UPDATED_AT)
            .isDeleted(UPDATED_IS_DELETED)
            .deletedBy(UPDATED_DELETED_BY);

        restFileUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFileUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedFileUser))
            )
            .andExpect(status().isOk());

        // Validate the FileUser in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertFileUserUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedFileUser, fileUser), getPersistedFileUser(fileUser));
    }

    @Test
    @Transactional
    void fullUpdateFileUserWithPatch() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the fileUser using partial update
        FileUser partialUpdatedFileUser = new FileUser();
        partialUpdatedFileUser.setId(fileUser.getId());

        partialUpdatedFileUser
            .bucket(UPDATED_BUCKET)
            .objectKey(UPDATED_OBJECT_KEY)
            .contentType(UPDATED_CONTENT_TYPE)
            .size(UPDATED_SIZE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .isDeleted(UPDATED_IS_DELETED)
            .deletedAt(UPDATED_DELETED_AT)
            .deletedBy(UPDATED_DELETED_BY);

        restFileUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFileUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedFileUser))
            )
            .andExpect(status().isOk());

        // Validate the FileUser in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertFileUserUpdatableFieldsEquals(partialUpdatedFileUser, getPersistedFileUser(partialUpdatedFileUser));
    }

    @Test
    @Transactional
    void patchNonExistingFileUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fileUser.setId(longCount.incrementAndGet());

        // Create the FileUser
        FileUserDTO fileUserDTO = fileUserMapper.toDto(fileUser);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFileUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fileUserDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(fileUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FileUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFileUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fileUser.setId(longCount.incrementAndGet());

        // Create the FileUser
        FileUserDTO fileUserDTO = fileUserMapper.toDto(fileUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFileUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(fileUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the FileUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFileUser() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        fileUser.setId(longCount.incrementAndGet());

        // Create the FileUser
        FileUserDTO fileUserDTO = fileUserMapper.toDto(fileUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFileUserMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(fileUserDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FileUser in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFileUser() throws Exception {
        // Initialize the database
        insertedFileUser = fileUserRepository.saveAndFlush(fileUser);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the fileUser
        restFileUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, fileUser.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return fileUserRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected FileUser getPersistedFileUser(FileUser fileUser) {
        return fileUserRepository.findById(fileUser.getId()).orElseThrow();
    }

    protected void assertPersistedFileUserToMatchAllProperties(FileUser expectedFileUser) {
        assertFileUserAllPropertiesEquals(expectedFileUser, getPersistedFileUser(expectedFileUser));
    }

    protected void assertPersistedFileUserToMatchUpdatableProperties(FileUser expectedFileUser) {
        assertFileUserAllUpdatablePropertiesEquals(expectedFileUser, getPersistedFileUser(expectedFileUser));
    }
}
