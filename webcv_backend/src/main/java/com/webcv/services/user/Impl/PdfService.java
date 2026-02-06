package com.webcv.services.user.Impl;

import com.webcv.cvpdf.render.RenderHtmlToPdf;
import com.webcv.entity.CvEntity;
import com.webcv.cvpdf.parser.CvBlockParser;
import com.webcv.cvpdf.parser.CvLayoutParser;
import com.webcv.cvpdf.model.Layout;
import com.webcv.cvpdf.model.PdfBlock;
import com.webcv.util.CvUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfService {

    private final TemplateEngine templateEngine;
    private final CvBlockParser cvBlockParser;
    private final CvLayoutParser cvLayoutParser;
    private final RenderHtmlToPdf renderHtmlToPdf;
    private final CvUtil cvUtil;

    // Xuất PDF cho 1 CV: parse blocks/layout -> render HTML bằng Thymeleaf -> dùng Headless Chrome (Playwright) in ra PDF bytes.
    public byte[] renderCvPdf(CvEntity cv) {
        // Log thông tin cơ bản để debug luồng xuất PDF.
        log.info("PDF render CV id={}, title={}", cv.getId(), cv.getTitle());
        log.info("PDF raw layout length={}, raw blocks length={}",
                cv.getLayout() == null ? 0 : cv.getLayout().length(),
                cv.getBlocks() == null ? 0 : cv.getBlocks().length());

        // Parse + chuẩn hóa blocks JSON thành danh sách PdfBlock.
        List<PdfBlock> blocks = cvBlockParser.parseBlocks(cv.getBlocks());
        log.info("PDF parsed blocks count={}", blocks.size());

        // Log block đầu tiên để dễ kiểm tra dữ liệu parse ra đúng chưa.
        if (!blocks.isEmpty()) {
            PdfBlock first = blocks.get(0);
            log.info("PDF first block id={}, type={}, title={}", first.getId(), first.getType(), first.getTitle());
        }

        // Tạo map id -> block để lookup nhanh khi sắp xếp theo layout.
        Map<String, PdfBlock> blocksById = new LinkedHashMap<>();
        for (PdfBlock block : blocks) {
            if (block.getId() != null) {
                blocksById.put(block.getId(), block);
            }
        }

        // Parse layout JSON để lấy thứ tự block theo 2 cột trái/phải.
        Layout layout = cvLayoutParser.parseLayout(cv.getLayout());
        log.info("PDF layout left count={}, right count={}", layout.getLeft().size(), layout.getRight().size());

        // Sắp xếp các block theo đúng thứ tự id trong layout.
        List<PdfBlock> leftBlocks = cvUtil.orderBlocks(layout.getLeft(), blocksById);
        List<PdfBlock> rightBlocks = cvUtil.orderBlocks(layout.getRight(), blocksById);

        // Nếu layout rỗng/không hợp lệ thì fallback: đổ toàn bộ blocks vào cột phải.
        if (leftBlocks.isEmpty() && rightBlocks.isEmpty()) {
            rightBlocks = blocks;
        }

        // Build model để Thymeleaf template (cv-pdf.html) render ra HTML.
        Map<String, Object> cvModel = new LinkedHashMap<>();
        cvModel.put("title", cv.getTitle());
        cvModel.put("leftBlocks", leftBlocks);
        cvModel.put("rightBlocks", rightBlocks);

        // Đưa model vào Thymeleaf Context.
        Context context = new Context();
        context.setVariable("cv", cvModel);

        // Render HTML từ template "cv-pdf".
        String html = templateEngine.process("cv-pdf", context);

        // Dùng renderer (Playwright/Headless Chrome) chuyển HTML thành PDF bytes để trả về client tải xuống.
        return renderHtmlToPdf.renderHtmlToPdf(html);
    }
}