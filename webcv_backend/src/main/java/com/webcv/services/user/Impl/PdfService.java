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

import java.nio.file.Path;
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

    public byte[] renderCvPdf(CvEntity cv) {
        String html = renderCvHtml(cv);
        return renderHtmlToPdf.renderHtmlToPdf(html);
    }

    public void renderCvPdfToFile(CvEntity cv, Path outputPath) {
        String html = renderCvHtml(cv);
        renderHtmlToPdf.renderHtmlToPdfToFile(html, outputPath);
    }

    private String renderCvHtml(CvEntity cv) {
        List<PdfBlock> blocks = cvBlockParser.parseBlocks(cv.getBlocks());

        Map<String, PdfBlock> blocksById = new LinkedHashMap<>();
        for (PdfBlock block : blocks) {
            if (block.getId() != null) {
                blocksById.put(block.getId(), block);
            }
        }

        Layout layout = cvLayoutParser.parseLayout(cv.getLayout());

        List<PdfBlock> leftBlocks = cvUtil.orderBlocks(layout.getLeft(), blocksById);
        List<PdfBlock> rightBlocks = cvUtil.orderBlocks(layout.getRight(), blocksById);

        if (leftBlocks.isEmpty() && rightBlocks.isEmpty()) {
            rightBlocks = blocks;
        }

        Map<String, Object> cvModel = new LinkedHashMap<>();
        cvModel.put("title", cv.getTitle());
        cvModel.put("leftBlocks", leftBlocks);
        cvModel.put("rightBlocks", rightBlocks);

        Context context = new Context();
        context.setVariable("cv", cvModel);

        return templateEngine.process("cv-pdf", context);
    }
}