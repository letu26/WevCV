package com.webcv.services.user.Impl;

import com.webcv.cvpdf.model.Layout;
import com.webcv.cvpdf.model.PdfBlock;
import com.webcv.cvpdf.parser.CvBlockParser;
import com.webcv.cvpdf.parser.CvLayoutParser;
import com.webcv.cvpdf.render.RenderHtmlToPdf;
import com.webcv.entity.CvEntity;
import com.webcv.util.PdfUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final TemplateEngine templateEngine;
    private final CvBlockParser cvBlockParser;
    private final CvLayoutParser cvLayoutParser;
    private final RenderHtmlToPdf renderHtmlToPdf;
    private final PdfUtil cvUtil;

    // Xuất PDF cho 1 CV: parse blocks/layout -> render HTML bằng Thymeleaf -> dùng Headless Chrome (Playwright) in ra PDF bytes.
    public byte[] renderCvPdf(CvEntity cv) {
        // Parse + chuẩn hóa blocks JSON thành danh sách PdfBlock.
        List<PdfBlock> blocks = cvBlockParser.parseBlocks(cv.getBlocks());

        // Tạo map id -> block để lookup nhanh khi sắp xếp theo layout.
        Map<String, PdfBlock> blocksById = new LinkedHashMap<>();
        for (PdfBlock block : blocks) {
            if (block.getId() != null) {
                blocksById.put(block.getId(), block);
            }
        }
        // Parse layout JSON để lấy thứ tự block theo 2 cột trái/phải.
        Layout layout = cvLayoutParser.parseLayout(cv.getLayout());

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