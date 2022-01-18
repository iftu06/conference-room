package com.example.demo.ajaxauth;

import com.example.demo.error.ErrorCode;
import com.example.demo.error.ErrorResponse;
import com.example.demo.exception.JwtExpiredTokenException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;
import java.util.Date;

@Component
public class AuthenticationFailureHandlerImpl implements AuthenticationFailureHandler {

    private ObjectMapper mapper = new ObjectMapper();



    @Override
    public void onAuthenticationFailure(HttpServletRequest httpServletRequest, HttpServletResponse response, AuthenticationException e) throws IOException, ServletException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        if (e instanceof BadCredentialsException) {
            mapper.writeValue(response.getWriter(), new ErrorResponse(HttpStatus.UNAUTHORIZED, "Invalid username or password", ErrorCode.UNAUTHRIZED, new Date()));
        } else if (e instanceof JwtExpiredTokenException) {
            mapper.writeValue(response.getWriter(), new ErrorResponse(HttpStatus.UNAUTHORIZED, "Token has expired", ErrorCode.TOKEN_EXPIRED, new Date()));
        } else if (e instanceof AuthenticationException) {
            mapper.writeValue(response.getWriter(), new ErrorResponse(HttpStatus.UNAUTHORIZED, "Authentication Failed", ErrorCode.UNAUTHRIZED, new Date()));
        }

        mapper.writeValue(response.getWriter(), new ErrorResponse(HttpStatus.UNAUTHORIZED, "Authentication Failed", ErrorCode.UNAUTHRIZED, new Date()));
    }
}
