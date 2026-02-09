package com.webcv.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcv.cvpdf.model.PdfBlock;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class PdfUtil {

    private final ObjectMapper objectMapper;

    // Chuẩn hóa JSON: nếu chuỗi JSON bị bọc dấu nháy/escape (vd: "\"{...}\"") thì gỡ ra thành JSON thuần.
    public String normalizeJson(String raw) {
        if (raw == null) {
            return null;
        }
        String trimmed = raw.trim();
        if (trimmed.isEmpty()) {
            return trimmed;
        }
        if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
            try {
                return objectMapper.readValue(trimmed, String.class);
            } catch (Exception ignored) {
                return raw;
            }
        }
        return raw;
    }

    // Đọc chuỗi JSON thành JsonNode (trả null nếu rỗng hoặc JSON lỗi).
    public JsonNode readJsonNode(String raw) {
        String normalized = normalizeJson(raw);
        if (normalized == null || normalized.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readTree(normalized);
        } catch (Exception ignored) {
            return null;
        }
    }
    //Parse chuỗi JSON object thành Map<String, Object> (trả null nếu không phải object hoặc parse lỗi).
    public Map<String, Object> tryParseMap(String raw) {
        JsonNode node = readJsonNode(raw);
        if (node == null) {
            return null;
        }
        if (node.isObject()) {
            try {
                return objectMapper.convertValue(node, new TypeReference<Map<String, Object>>() {});
            } catch (Exception ignored) {
                return null;
            }
        }
        return null;
    }

    // Sắp xếp danh sách block theo thứ tự id trong layout (bỏ qua id không tồn tại trong map).
    public List<PdfBlock> orderBlocks(List<String> ids, Map<String, PdfBlock> blockMap) {
        List<PdfBlock> ordered = new ArrayList<>();
        for (String id : ids) {
            PdfBlock block = blockMap.get(id);
            if (block != null) {
                ordered.add(block);
            }
        }
        return ordered;
    }

    // Trả về danh sách rỗng nếu input null để tránh NullPointerException.
    public List<String> safeList(List<String> ids) {
        return ids == null ? List.of() : ids;
    }

    // Chuyển object sang chuỗi JSON an toàn (nếu lỗi thì trả chuỗi rỗng).
    public String safeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception ignored) {
            return "";
        }
    }
}