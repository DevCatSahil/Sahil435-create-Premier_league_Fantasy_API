// com/pl/premier_zone/auth/JwtUtil.java
package com.pl.premier_zone.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key key() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Called after login — build and return a token string
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)           // who the token belongs to
                .setIssuedAt(new Date())         // when it was made
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key(), SignatureAlgorithm.HS256)  // sign with your secret
                .compact();                      // produces "eyJhb...xxx.yyy.zzz"
    }

    // Pull the username back out of a token
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key()).build()
                .parseClaimsJws(token)
                .getBody().getSubject();
    }

    // Is the token valid AND not expired AND does it belong to this user?
    public boolean isValid(String token, UserDetails user) {
        String username = extractUsername(token);
        Date expiry = Jwts.parserBuilder()
                .setSigningKey(key()).build()
                .parseClaimsJws(token)
                .getBody().getExpiration();
        return username.equals(user.getUsername()) && expiry.after(new Date());
    }
}