package com.webcv.cvpdf.parser;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcv.util.PdfUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CvParser {
    private final ObjectMapper objectMapper;
    private final PdfUtil cvUtil;

    // Đọc chuỗi JSON blocks và chuyển về List<Map<String,Object>> (hỗ trợ dạng mảng thuần, dạng {blocks:[...]}, hoặc string chứa JSON).
    public List<Map<String, Object>> readBlocksAsList(String raw) {
        // Parse raw JSON thành JsonNode (trả null nếu raw rỗng/không hợp lệ).
        JsonNode node = cvUtil.readJsonNode(raw);
        if (node == null) {
            return List.of();
        }

        // Nếu JSON có dạng { "blocks": [...] } thì lấy node "blocks".
        if (node.isObject() && node.has("blocks")) {
            node = node.get("blocks");
        }

        // Nếu node là chuỗi (string chứa JSON) thì parse lại lần nữa.
        if (node.isTextual()) {
            node = cvUtil.readJsonNode(node.asText());
        }

        // Nếu không phải array thì coi như không có blocks hợp lệ.
        if (node == null || !node.isArray()) {
            return List.of();
        }

        try {
            // Convert JsonNode array thành List<Map<String,Object>> để các parser khác xử lý tiếp.
            return objectMapper.convertValue(node, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception ignored) {
            // Convert lỗi thì trả list rỗng để tránh văng exception ở luồng export.
            return List.of();
        }
    }
}