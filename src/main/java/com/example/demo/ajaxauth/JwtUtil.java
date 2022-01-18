package com.example.demo.ajaxauth;

import com.example.demo.jwtsecurity.SecurityConstants;
import com.example.demo.model.User;
import io.jsonwebtoken.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.Date;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    public String createJwtToken(User userDetails) {

        String userName = userDetails.getUsername();

        if (StringUtils.isEmpty(userName)) {
            throw new IllegalArgumentException("Can not create jwt token without username");
        }

        if (userDetails.getAuthorities() == null) {
            throw new IllegalArgumentException("User does not have any priviliges");

        }

        Claims claims = Jwts.claims().setSubject(userName);
        claims.put("scopes",userDetails.getAuthorities().stream()
                .map( authority -> authority.getAuthority()).collect(Collectors.toList()));

        String token = Jwts.builder()
                .setClaims(claims)
                .setExpiration(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SecurityConstants.SECRET).compact();

        return token;
    }


    public String createRefreshToken(UserDetails userDetails) {

        String userName = userDetails.getUsername();

        if (StringUtils.isEmpty(userName)) {
            throw new IllegalArgumentException("Can not create jwt token without username");
        }

        if (userDetails.getAuthorities() == null) {
            throw new IllegalArgumentException("User does not have any priviliges");

        }

        Claims claims = Jwts.claims().setSubject(userName);

        claims.put("scopes", Arrays.asList("ROLE_REFRESH_TOKEN"));

        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SecurityConstants.SECRET)
                .compact();


        return token;
    }
//
//    public String extractUserName(String token){
//        return
//    }

    private <T> T extractClaim(String token, Function<Claims,T> claimsResolver){
        Claims claims = extractAllClaims(token);
        return  claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token){
        return Jwts.parser().setSigningKey(SecurityConstants.SECRET).parseClaimsJwt(token).getBody();
    }

}
