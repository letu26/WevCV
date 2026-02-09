package com.webcv.cvpdf.parser;

import com.webcv.cvpdf.model.PdfBlock;
import com.webcv.util.PdfUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class CvBlockParser {
    private final PdfUtil cvUtil;
    private final CvParser cvParser;

    // Parse JSON blocks từ DB/FE thành danh sách PdfBlock chuẩn hóa để render PDF (an toàn trước nhiều kiểu dữ liệu data).
    public List<PdfBlock> parseBlocks(String blocksJson) {
        try {
            // Đọc chuỗi JSON blocks thành danh sách Map thô (mỗi phần tử là 1 block).
            List<Map<String, Object>> rawBlocks = cvParser.readBlocksAsList(blocksJson);
            if (rawBlocks.isEmpty()) {
                return List.of();
            }

            // Chuẩn hóa từng block về PdfBlock (id/type/title/data/dataJson).
            List<PdfBlock> normalizedBlocks = new ArrayList<>();
            for (Map<String, Object> block : rawBlocks) {
                PdfBlock out = new PdfBlock();

                // Gán các field cơ bản (nếu thiếu title thì fallback về type).
                out.setId(Objects.toString(block.get("id"), null));
                out.setType(Objects.toString(block.get("type"), ""));
                out.setTitle(Objects.toString(block.get("title"), out.getType()));

                // Chuẩn hóa field data vì data có thể là Map, String(JSON), null, hoặc kiểu khác.
                Object data = block.get("data");
                if (data instanceof Map) {
                    // data đã là object => dùng luôn.
                    out.setData((Map<String, Object>) data);
                } else if (data instanceof String) {
                    // data là chuỗi => thử parse thành Map (JSON object).
                    Map<String, Object> parsedData = cvUtil.tryParseMap((String) data);
                    if (parsedData != null) {
                        out.setData(parsedData);
                    } else {
                        // Nếu không parse được thì bọc lại thành { value: data } để không mất dữ liệu.
                        Map<String, Object> wrap = new LinkedHashMap<>();
                        wrap.put("value", data);
                        out.setData(wrap);
                    }
                } else if (data == null) {
                    // data null => set map rỗng.
                    out.setData(new LinkedHashMap<>());
                } else {
                    // data kiểu lạ (number/array/boolean/...) => bọc lại thành { value: data }.
                    Map<String, Object> wrap = new LinkedHashMap<>();
                    wrap.put("value", data);
                    out.setData(wrap);
                }

                // Serialize data về JSON string để template dùng fallback/debug (khi không có template cho type).
                out.setDataJson(cvUtil.safeJson(out.getData()));

                normalizedBlocks.add(out);
            }

            return normalizedBlocks;
        } catch (Exception e) {
            // Nếu parse lỗi thì trả list rỗng để tránh văng exception ở luồng xuất PDF.
            return List.of();
        }
    }
}