package com.webcv.services.user.Impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.WaitUntilState;
import com.webcv.entity.CvEntity;
import com.webcv.exception.customexception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfService {

    private final TemplateEngine templateEngine;
    private final ObjectMapper objectMapper;

    public byte[] renderCvPdf(CvEntity cv) {
        log.info("PDF render CV id={}, title={}", cv.getId(), cv.getTitle());
        log.info("PDF raw layout length={}, raw blocks length={}",
                cv.getLayout() == null ? 0 : cv.getLayout().length(),
                cv.getBlocks() == null ? 0 : cv.getBlocks().length());
        List<PdfBlock> blocks = parseBlocks(cv.getBlocks());
        log.info("PDF parsed blocks count={}", blocks.size());
        if (!blocks.isEmpty()) {
            PdfBlock first = blocks.get(0);
            log.info("PDF first block id={}, type={}, title={}", first.id, first.type, first.title);
        }
        Map<String, PdfBlock> blocksById = new LinkedHashMap<>();
        for (PdfBlock block : blocks) {
            if (block.id != null) {
                blocksById.put(block.id, block);
            }
        }

        Layout layout = parseLayout(cv.getLayout());
        log.info("PDF layout left count={}, right count={}", layout.left.size(), layout.right.size());
        List<PdfBlock> leftBlocks = orderBlocks(layout.left, blocksById);
        List<PdfBlock> rightBlocks = orderBlocks(layout.right, blocksById);

        if (leftBlocks.isEmpty() && rightBlocks.isEmpty()) {
            rightBlocks = blocks;
        }

        Map<String, Object> cvModel = new LinkedHashMap<>();
        cvModel.put("title", cv.getTitle());
        cvModel.put("leftBlocks", leftBlocks);
        cvModel.put("rightBlocks", rightBlocks);

        Context context = new Context();
        context.setVariable("cv", cvModel);

        String html = templateEngine.process("cv-pdf", context);
        return renderHtmlToPdf(html);
    }

    private Layout parseLayout(String layoutJson) {
        Layout layout = new Layout();
        JsonNode node = readJsonNode(layoutJson);
        if (node == null) {
            return layout;
        }
        if (node.isObject() && node.has("layout")) {
            node = node.get("layout");
        }
        if (node.isTextual()) {
            node = readJsonNode(node.asText());
        }
        if (node == null || !node.isObject()) {
            return layout;
        }
        try {
            Map<String, List<String>> raw = objectMapper.convertValue(
                    node,
                    new TypeReference<Map<String, List<String>>>() {}
            );
            layout.left = safeList(raw.get("left"));
            layout.right = safeList(raw.get("right"));
            return layout;
        } catch (Exception e) {
            return layout;
        }
    }

    private List<PdfBlock> parseBlocks(String blocksJson) {
        try {
            List<Map<String, Object>> rawBlocks = readBlocksAsList(blocksJson);
            if (rawBlocks.isEmpty()) {
                return List.of();
            }

            List<PdfBlock> normalizedBlocks = new ArrayList<>();
            for (Map<String, Object> block : rawBlocks) {
                PdfBlock out = new PdfBlock();
                out.id = Objects.toString(block.get("id"), null);
                out.type = Objects.toString(block.get("type"), "");
                out.title = Objects.toString(block.get("title"), out.type);

                Object data = block.get("data");
                if (data instanceof Map) {
                    out.data = (Map<String, Object>) data;
                } else if (data instanceof String) {
                    Map<String, Object> parsedData = tryParseMap((String) data);
                    if (parsedData != null) {
                        out.data = parsedData;
                    } else {
                        Map<String, Object> wrap = new LinkedHashMap<>();
                        wrap.put("value", data);
                        out.data = wrap;
                    }
                } else if (data == null) {
                    out.data = new LinkedHashMap<>();
                } else {
                    Map<String, Object> wrap = new LinkedHashMap<>();
                    wrap.put("value", data);
                    out.data = wrap;
                }
                out.dataJson = safeJson(out.data);

                normalizedBlocks.add(out);
            }

            return normalizedBlocks;
        } catch (Exception e) {
            return List.of();
        }
    }

    private String normalizeJson(String raw) {
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

    private JsonNode readJsonNode(String raw) {
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

    private List<Map<String, Object>> readBlocksAsList(String raw) {
        JsonNode node = readJsonNode(raw);
        if (node == null) {
            return List.of();
        }
        if (node.isObject() && node.has("blocks")) {
            node = node.get("blocks");
        }
        if (node.isTextual()) {
            node = readJsonNode(node.asText());
        }
        if (node == null || !node.isArray()) {
            return List.of();
        }
        try {
            return objectMapper.convertValue(node, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception ignored) {
            return List.of();
        }
    }

    private Map<String, Object> tryParseMap(String raw) {
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

    private List<PdfBlock> orderBlocks(List<String> ids, Map<String, PdfBlock> blockMap) {
        List<PdfBlock> ordered = new ArrayList<>();
        for (String id : ids) {
            PdfBlock block = blockMap.get(id);
            if (block != null) {
                ordered.add(block);
            }
        }
        return ordered;
    }

    private List<String> safeList(List<String> ids) {
        return ids == null ? List.of() : ids;
    }

    private String safeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception ignored) {
            return "";
        }
    }

    private byte[] renderHtmlToPdf(String html) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(
                    new BrowserType.LaunchOptions().setHeadless(true)
            );
            BrowserContext context = browser.newContext(
                    new Browser.NewContextOptions().setViewportSize(794, 1123)
            );
            Page page = context.newPage();
            page.setContent(html, new Page.SetContentOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

            Page.PdfOptions options = new Page.PdfOptions()
                    .setFormat("A4")
                    .setPrintBackground(true);

            byte[] pdf = page.pdf(options);
            context.close();
            browser.close();
            return pdf;
        } catch (Exception e) {
            log.error("PDF render failed", e);
            throw new BadRequestException("PDF render failed");
        }
    }

    private static class Layout {
        private List<String> left = List.of();
        private List<String> right = List.of();
    }

    private static class PdfBlock {
        private String id;
        private String type;
        private String title;
        private Map<String, Object> data = new LinkedHashMap<>();
        private String dataJson;

        public String getId() {
            return id;
        }

        public String getType() {
            return type;
        }

        public String getTitle() {
            return title;
        }

        public Map<String, Object> getData() {
            return data;
        }

        public String getDataJson() {
            return dataJson;
        }
    }
}
