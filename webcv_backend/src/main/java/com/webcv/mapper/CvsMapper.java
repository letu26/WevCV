package com.webcv.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcv.entity.CvEntity;
import com.webcv.response.lead.CvDetailResponse;
import com.webcv.response.user.CvsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CvsMapper {

    private final ObjectMapper objectMapper;

    public CvsResponse toResponse(CvEntity cv) {
        try {
            return CvsResponse.builder()
                    .id(cv.getId())
                    .title(cv.getTitle())
                    .layout(parseJson(cv.getLayout()))
                    .blocks(parseJson(cv.getBlocks()))
                    .build();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(
                    "JSON parse error for CV id: " + cv.getId(), e
            );
        }
    }

    private Object parseJson(String json) throws JsonProcessingException {
        if (json == null || json.isBlank()) {
            return null;
        }
        return objectMapper.readValue(json, Object.class);
    }



}