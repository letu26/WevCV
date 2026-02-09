package com.webcv.cvpdf.parser;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcv.cvpdf.model.Layout;
import com.webcv.util.PdfUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CvLayoutParser {
    private final ObjectMapper objectMapper;
    private final PdfUtil cvUtil;

    // Parse JSON layout (left/right list id) thành object Layout để sắp xếp các block theo đúng 2 cột.
    public Layout parseLayout(String layoutJson) {
        Layout layout = new Layout();

        // Đọc chuỗi JSON (có thể bị bọc/escape) thành JsonNode.
        JsonNode node = cvUtil.readJsonNode(layoutJson);
        if (node == null) {
            return layout;
        }

        // Nếu JSON có dạng { "layout": {...} } thì lấy phần bên trong "layout".
        if (node.isObject() && node.has("layout")) {
            node = node.get("layout");
        }

        // Nếu node là chuỗi (string chứa JSON) thì parse thêm lần nữa.
        if (node.isTextual()) {
            node = cvUtil.readJsonNode(node.asText());
        }

        // Nếu sau cùng không phải object thì coi như layout không hợp lệ.
        if (node == null || !node.isObject()) {
            return layout;
        }

        try {
            // Convert JsonNode thành map: { left: [..], right: [..], unused?: [..] }.
            Map<String, List<String>> raw = objectMapper.convertValue(
                    node,
                    new TypeReference<Map<String, List<String>>>() {}
            );

            // Gán list id cho left/right (nếu null thì trả về list rỗng để tránh NPE).
            layout.setLeft(cvUtil.safeList(raw.get("left")));
            layout.setRight(cvUtil.safeList(raw.get("right")));
            return layout;
        } catch (Exception e) {
            // Nếu convert lỗi thì trả layout rỗng (tránh làm fail cả luồng export).
            return layout;
        }
    }
}