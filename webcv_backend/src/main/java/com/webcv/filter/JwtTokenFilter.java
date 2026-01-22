package com.webcv.filter;

import com.webcv.entity.UserEntity;
import com.webcv.util.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import static com.webcv.util.ExceptionUtil.sendUnauthorized;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

    @Value("${jwt.access.secret}")
    private String secretAccess;

    private final UserDetailsService  userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        if (isBypassToken(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendUnauthorized(response, "TOKEN_INVALID or TOKEN_EXPIRED!");
            return;
        }

        final String token = authHeader.substring(7);

        try {

            String username = jwtTokenUtil.extractUsername(token, secretAccess);
            if (username == null) {
                sendUnauthorized(response, "TOKEN_INVALID or TOKEN_EXPIRED!");
                return;
            }
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                UserEntity userDetails =
                        (UserEntity) userDetailsService.loadUserByUsername(username);
                if (!jwtTokenUtil.validateToken(token, userDetails, secretAccess)) {
                    sendUnauthorized(response, "TOKEN_INVALID or TOKEN_EXPIRED!");
                    return;
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            sendUnauthorized(response, "TOKEN_INVALID or TOKEN_EXPIRED!");
        }
    }


    //kiểm tra url và method của api hiện tại có khớp với những api được bỏ qua xác thực jwt
    private boolean isBypassToken(@NonNull HttpServletRequest request){
        final List<Pair<String, String>> bypassToken = Arrays.asList(
                Pair.of("/api/users/login", "POST"),
                Pair.of("/api/users/register", "POST"),
                Pair.of("/api/users/refresh", "POST")
        );
        for(Pair<String, String> bypassTokens: bypassToken) {
            if (request.getServletPath().contains(bypassTokens.getFirst()) &&
                    request.getMethod().equalsIgnoreCase(bypassTokens.getSecond())) {
                return true;
            }
        }
        return false;
    }
}
