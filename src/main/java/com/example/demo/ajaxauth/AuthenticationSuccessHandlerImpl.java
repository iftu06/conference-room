package com.example.demo.ajaxauth;

import com.example.demo.jwtsecurity.SecurityConstants;
import com.example.demo.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuthenticationSuccessHandlerImpl implements AuthenticationSuccessHandler {

    private ObjectMapper mapper = new ObjectMapper();
    private JwtUtil jwtUtil;

    @Autowired
    public AuthenticationSuccessHandlerImpl(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        UsernamePasswordAuthenticationToken jwtAuthenticationToken = (UsernamePasswordAuthenticationToken) authentication;

        User userDetails = (User) jwtAuthenticationToken.getPrincipal();
        String accessToken = jwtUtil.createJwtToken(userDetails);
        String refreshToken = jwtUtil.createRefreshToken(userDetails);
        Map tokenMap = new HashMap();
        tokenMap.put("token", SecurityConstants.TOKEN_PREFIX + accessToken);
        tokenMap.put("refreshToken", SecurityConstants.TOKEN_PREFIX + refreshToken);

//        if (isEmployee(userDetails)) {
//            tokenMap.put("shopId", userDetails.getShop().getId());
//        }


        mapper.writeValue(response.getWriter(), tokenMap);
    }


}
