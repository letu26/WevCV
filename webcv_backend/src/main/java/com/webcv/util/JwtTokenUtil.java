package com.webcv.util;

import com.webcv.exception.customexception.JwtGenerationException;
import com.webcv.entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtTokenUtil {
    @Value("${jwt.expirationAccess}")
    private Long expirationAccess;

    @Value("${jwt.expirationRefresh}")
    private Long expirationRefresh;

    @Value("${jwt.secret}")
    private String secretkey;

    //sinh token
    public String generateToken(UserEntity user, Long expirationTime){
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        try {
            return Jwts.builder()
                    .claims(claims)
                    .subject(user.getUsername())
                    .expiration(new Date(System.currentTimeMillis() + expirationTime))
                    .id(UUID.randomUUID().toString())
                    .signWith(getSignInKey())
                    .compact();
        }catch (JwtException e){
            throw new JwtGenerationException("Can not create JWT" + e.getMessage());
        }
    }

    //tạo access token:
    public String generateAccessToken(UserEntity user){
        return generateToken(user, expirationAccess);
    }

    //tạo refresh token:
    public String generateRefreshToken(UserEntity user){
        return generateToken(user, expirationRefresh);
    }

    //tạo khóa bí mật dùng trong tạo token và xác thực
    private Key getSignInKey() {
        byte[] bytes = Decoders.BASE64.decode(secretkey);
        return Keys.hmacShaKeyFor(bytes);
    }

    //dùng để đọc và xác thực jwt rồi lấy toàn bộ thông tin
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    //áp dụng T class dùng để lấy thông tin trong token 1 cách linh động
    public  <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = this.extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    //check hạn token
    public boolean isTokenExpired(String token) {
        Date expirationDate = this.extractClaim(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }

    //lấy username
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    //xác định token là của người dùng nào và kiểm tra hạn
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()))
                && !isTokenExpired(token); //check hạn của token
    }
}
