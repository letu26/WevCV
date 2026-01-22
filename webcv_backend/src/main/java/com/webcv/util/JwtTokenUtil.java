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
    @Value("${jwt.access.expiration}")
    private Long expirationAccess;

    @Value("${jwt.refresh.expiration}")
    private Long expirationRefresh;

    @Value("${jwt.access.secret}")
    private String secretAccess;

    @Value("${jwt.refresh.secret}")
    private String secretRefresh;

    //sinh token
    public String generateToken(UserEntity user, Long expirationTime, String secret){
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        try {
            return Jwts.builder()
                    .claims(claims)
                    .subject(user.getUsername())
                    .expiration(new Date(System.currentTimeMillis() + expirationTime))
                    .id(UUID.randomUUID().toString())
                    .signWith(getSignInKey(secret))
                    .compact();
        }catch (JwtException e){
            throw new JwtGenerationException("Can not create JWT" + e.getMessage());
        }
    }

    //tạo access token:
    public String generateAccessToken(UserEntity user){
        return generateToken(user, expirationAccess, secretAccess);
    }

    //tạo refresh token:
    public String generateRefreshToken(UserEntity user){
        return generateToken(user, expirationRefresh,  secretRefresh);
    }

    //tạo khóa bí mật dùng trong tạo token và xác thực
    private Key getSignInKey(String secretkey) {
        byte[] bytes = Decoders.BASE64.decode(secretkey);
        return Keys.hmacShaKeyFor(bytes);
    }

    //dùng để đọc và xác thực jwt rồi lấy toàn bộ thông tin
    private Claims extractAllClaims(String token, String secret) {
        return Jwts.parser()
                .verifyWith((SecretKey) getSignInKey(secret))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    //áp dụng T class dùng để lấy thông tin trong token 1 cách linh động
    public  <T> T extractClaim(String token, Function<Claims, T> claimsResolver,  String secret) {
        final Claims claims = this.extractAllClaims(token, secret);
        return claimsResolver.apply(claims);
    }

    //check hạn token
    public boolean isTokenExpired(String token, String secret) {
        Date expirationDate = this.extractClaim(token, Claims::getExpiration, secret);
        return expirationDate.before(new Date());
    }

    //lấy username
    public String extractUsername(String token, String secret) {
        return extractClaim(token, Claims::getSubject, secret);
    }
    //lấy token id
    public String tokenId(String token, String secret) {
        return extractClaim(token, Claims::getId, secret);
    }
    //xác định token là của người dùng nào và kiểm tra hạn
    public boolean validateToken(String token, UserDetails userDetails, String secret) {
        String username = extractUsername(token, secret);
        return (username.equals(userDetails.getUsername()))
                && !isTokenExpired(token, secret); //check hạn của token
    }
}
