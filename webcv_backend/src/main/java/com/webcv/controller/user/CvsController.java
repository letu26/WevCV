package com.webcv.controller.user;

import com.webcv.request.user.CvsRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CvsResponse;
import com.webcv.services.user.Impl.CvsService;
import com.webcv.services.user.Impl.PdfService;
import com.webcv.util.JwtTokenUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/cvs")
public class CvsController {

    @Value("${jwt.access.secret}")
    private String jwtSecret;

    private final CvsService cvsService;
    private final JwtTokenUtil jwtTokenUtil;
    private final PdfService pdfService;

    @PostMapping
    public ResponseEntity<BaseResponse<Void>> createAndUpdateCv(
            @Valid
            @RequestBody CvsRequest request,
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);
        Long userId = (Long) jwtTokenUtil.extractUserId(token, jwtSecret);

        BaseResponse<Void> response = cvsService.createAndUpdateCv(request, userId);

        return ResponseEntity.ok().body(response);
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<CvsResponse>>> getCv(
            @RequestHeader("Authorization") String authorizationHeader){
        String token = authorizationHeader.substring(7);
        Long userId = (Long) jwtTokenUtil.extractUserId(token, jwtSecret);
        BaseResponse<List<CvsResponse>> response = cvsService.getCvbyUserId(userId);

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{id}/export-pdf")
    public ResponseEntity<byte[]> exportPdf(
            @PathVariable("id") Long id,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        Long userId = (Long) jwtTokenUtil.extractUserId(token, jwtSecret);

        var cv = cvsService.getCvForUser(id, userId);
        byte[] pdf = pdfService.renderCvPdf(cv);

        String title = cv.getTitle() == null ? "" : cv.getTitle().trim();
        String safeTitle = title.isBlank() ? ("cv-" + id) : title.replaceAll("\\s+", "-");
        String filename = safeTitle + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(pdf);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteCvById(@PathVariable Long id){
        BaseResponse<Void> response = cvsService.deleteCvById(id);
        return ResponseEntity.ok().body(response);
    }
}