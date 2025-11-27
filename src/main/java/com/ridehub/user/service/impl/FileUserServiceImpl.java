package com.ridehub.user.service.impl;

import com.ridehub.user.domain.FileUser;
import com.ridehub.user.repository.FileUserRepository;
import com.ridehub.user.service.FileUserService;
import com.ridehub.user.service.dto.FileUserDTO;
import com.ridehub.user.service.mapper.FileUserMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ridehub.user.domain.FileUser}.
 */
@Service
@Transactional
public class FileUserServiceImpl implements FileUserService {

    private static final Logger LOG = LoggerFactory.getLogger(FileUserServiceImpl.class);

    private final FileUserRepository fileUserRepository;

    private final FileUserMapper fileUserMapper;

    public FileUserServiceImpl(FileUserRepository fileUserRepository, FileUserMapper fileUserMapper) {
        this.fileUserRepository = fileUserRepository;
        this.fileUserMapper = fileUserMapper;
    }

    @Override
    public FileUserDTO save(FileUserDTO fileUserDTO) {
        LOG.debug("Request to save FileUser : {}", fileUserDTO);
        FileUser fileUser = fileUserMapper.toEntity(fileUserDTO);
        fileUser = fileUserRepository.save(fileUser);
        return fileUserMapper.toDto(fileUser);
    }

    @Override
    public FileUserDTO update(FileUserDTO fileUserDTO) {
        LOG.debug("Request to update FileUser : {}", fileUserDTO);
        FileUser fileUser = fileUserMapper.toEntity(fileUserDTO);
        fileUser = fileUserRepository.save(fileUser);
        return fileUserMapper.toDto(fileUser);
    }

    @Override
    public Optional<FileUserDTO> partialUpdate(FileUserDTO fileUserDTO) {
        LOG.debug("Request to partially update FileUser : {}", fileUserDTO);

        return fileUserRepository
            .findById(fileUserDTO.getId())
            .map(existingFileUser -> {
                fileUserMapper.partialUpdate(existingFileUser, fileUserDTO);

                return existingFileUser;
            })
            .map(fileUserRepository::save)
            .map(fileUserMapper::toDto);
    }

    /**
     *  Get all the fileUsers where Profile is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<FileUserDTO> findAllWhereProfileIsNull() {
        LOG.debug("Request to get all fileUsers where Profile is null");
        return StreamSupport.stream(fileUserRepository.findAll().spliterator(), false)
            .filter(fileUser -> fileUser.getProfile() == null)
            .map(fileUserMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FileUserDTO> findOne(Long id) {
        LOG.debug("Request to get FileUser : {}", id);
        return fileUserRepository.findById(id).map(fileUserMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete FileUser : {}", id);
        fileUserRepository.deleteById(id);
    }
}
