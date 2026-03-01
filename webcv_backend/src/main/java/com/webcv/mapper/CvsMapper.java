package com.webcv.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcv.entity.CvEntity;
import com.webcv.enums.FormStatus;
import com.webcv.request.admin.GetAllCvsRequest;
import com.webcv.request.user.CvsRequest;
import com.webcv.response.user.CvsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class CvsMapper {

    private final ObjectMapper objectMapper;

    private Long toLong(Object value) {
        if (value == null) return null;

        if (value instanceof Number) {
            return ((Number) value).longValue();
        }

        if (value instanceof String) {
            return Long.parseLong((String) value);
        }

        throw new IllegalArgumentException("Cannot convert to Long: " + value);
    }

    public GetAllCvsRequest toRequest(Map<String, Object> params) {
        return GetAllCvsRequest.builder()
                .lastID(toLong(params.get("lastID")))
                .size(toLong(params.get("size")))
                .status((String) params.get("status"))
                .keyword((String) params.get("keyword"))
                .build();
    }

    public CvsResponse toResponse(CvEntity cv) {
        try {
            return CvsResponse.builder()
                    .id(cv.getId())
                    .title(cv.getTitle())
                    .layout(parseJson(cv.getLayout()))
                    .blocks(parseJson(cv.getBlocks()))
                    .status(cv.getStatus())
                    .visibility(String.valueOf(cv.getVisibility()))
                    .build();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(
                    "JSON parse error for CV id: " + cv.getId(), e
            );
        }
    }

    private JsonNode parseJson(String json) throws JsonProcessingException {
        if (json == null || json.isBlank()) {
            return null;
        }
        return objectMapper.readTree(json);
    }

    public CvsResponse mapToResponse(Object[] row) {

        try {
            return CvsResponse.builder()
                    .id(((Number) row[0]).longValue())
                    .title((String) row[1])
                    .layout(objectMapper.readTree((String) row[2])) // convert JSON
                    .blocks(objectMapper.readTree((String) row[3])) // convert JSON
                    .status(FormStatus.valueOf((String) row[4]))
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error parsing JSON from database", e);
        }
    }
}