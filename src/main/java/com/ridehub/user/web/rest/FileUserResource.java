package com.ridehub.user.web.rest;

import com.ridehub.user.repository.FileUserRepository;
import com.ridehub.user.service.FileUserQueryService;
import com.ridehub.user.service.FileUserService;
import com.ridehub.user.service.criteria.FileUserCriteria;
import com.ridehub.user.service.dto.FileUserDTO;
import com.ridehub.user.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ridehub.user.domain.FileUser}.
 */
@RestController
@RequestMapping("/api/file-users")
public class FileUserResource {

    private static final Logger LOG = LoggerFactory.getLogger(FileUserResource.class);

    private static final String ENTITY_NAME = "msUserFileUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FileUserService fileUserService;

    private final FileUserRepository fileUserRepository;

    private final FileUserQueryService fileUserQueryService;

    public FileUserResource(
        FileUserService fileUserService,
        FileUserRepository fileUserRepository,
        FileUserQueryService fileUserQueryService
    ) {
        this.fileUserService = fileUserService;
        this.fileUserRepository = fileUserRepository;
        this.fileUserQueryService = fileUserQueryService;
    }

    /**
     * {@code POST  /file-users} : Create a new fileUser.
     *
     * @param fileUserDTO the fileUserDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fileUserDTO, or with status {@code 400 (Bad Request)} if the fileUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<FileUserDTO> createFileUser(@Valid @RequestBody FileUserDTO fileUserDTO) throws URISyntaxException {
        LOG.debug("REST request to save FileUser : {}", fileUserDTO);
        if (fileUserDTO.getId() != null) {
            throw new BadRequestAlertException("A new fileUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        fileUserDTO = fileUserService.save(fileUserDTO);
        return ResponseEntity.created(new URI("/api/file-users/" + fileUserDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, fileUserDTO.getId().toString()))
            .body(fileUserDTO);
    }

    /**
     * {@code PUT  /file-users/:id} : Updates an existing fileUser.
     *
     * @param id the id of the fileUserDTO to save.
     * @param fileUserDTO the fileUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fileUserDTO,
     * or with status {@code 400 (Bad Request)} if the fileUserDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fileUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<FileUserDTO> updateFileUser(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FileUserDTO fileUserDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update FileUser : {}, {}", id, fileUserDTO);
        if (fileUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fileUserDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fileUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        fileUserDTO = fileUserService.update(fileUserDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fileUserDTO.getId().toString()))
            .body(fileUserDTO);
    }

    /**
     * {@code PATCH  /file-users/:id} : Partial updates given fields of an existing fileUser, field will ignore if it is null
     *
     * @param id the id of the fileUserDTO to save.
     * @param fileUserDTO the fileUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fileUserDTO,
     * or with status {@code 400 (Bad Request)} if the fileUserDTO is not valid,
     * or with status {@code 404 (Not Found)} if the fileUserDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the fileUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FileUserDTO> partialUpdateFileUser(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FileUserDTO fileUserDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update FileUser partially : {}, {}", id, fileUserDTO);
        if (fileUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fileUserDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fileUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FileUserDTO> result = fileUserService.partialUpdate(fileUserDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fileUserDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /file-users} : get all the fileUsers.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fileUsers in body.
     */
    @GetMapping("")
    public ResponseEntity<List<FileUserDTO>> getAllFileUsers(FileUserCriteria criteria) {
        LOG.debug("REST request to get FileUsers by criteria: {}", criteria);

        List<FileUserDTO> entityList = fileUserQueryService.findByCriteria(criteria);
        return ResponseEntity.ok().body(entityList);
    }

    /**
     * {@code GET  /file-users/count} : count all the fileUsers.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countFileUsers(FileUserCriteria criteria) {
        LOG.debug("REST request to count FileUsers by criteria: {}", criteria);
        return ResponseEntity.ok().body(fileUserQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /file-users/:id} : get the "id" fileUser.
     *
     * @param id the id of the fileUserDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fileUserDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<FileUserDTO> getFileUser(@PathVariable("id") Long id) {
        LOG.debug("REST request to get FileUser : {}", id);
        Optional<FileUserDTO> fileUserDTO = fileUserService.findOne(id);
        return ResponseUtil.wrapOrNotFound(fileUserDTO);
    }

    /**
     * {@code DELETE  /file-users/:id} : delete the "id" fileUser.
     *
     * @param id the id of the fileUserDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFileUser(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete FileUser : {}", id);
        fileUserService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
