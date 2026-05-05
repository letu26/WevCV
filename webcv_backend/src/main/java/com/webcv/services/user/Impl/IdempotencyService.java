package com.webcv.services.user.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcv.entity.IdempotencyRecord;
import com.webcv.repository.IdempotencyRepository;
import com.webcv.response.user.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class IdempotencyService {

    @Autowired
    private IdempotencyRepository repository;

    public Optional<IdempotencyRecord> get(String key) {
        return repository.findById(key);
    }

    public void save(String key, BaseResponse<?> response) {
        IdempotencyRecord record = new IdempotencyRecord();
        record.setKey(key);
        record.setResponseBody(convertToJson(response));
        record.setStatusCode(200);
        record.setCreatedAt(LocalDateTime.now());

        repository.save(record);
    }

    private String convertToJson(Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public BaseResponse<?> parseResponse(String json) {
        try {
            return new ObjectMapper().readValue(json, BaseResponse.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
