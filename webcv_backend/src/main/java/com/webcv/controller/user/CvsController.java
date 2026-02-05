package com.webcv.controller.user;

import com.webcv.request.user.CvsRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CvsResponse;
import com.webcv.services.user.Impl.CvsService;
import com.webcv.util.JwtTokenUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
}
