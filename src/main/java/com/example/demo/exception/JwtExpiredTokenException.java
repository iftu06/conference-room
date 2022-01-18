package com.example.demo.exception;

import org.springframework.security.core.AuthenticationException;

public class JwtExpiredTokenException extends AuthenticationException{
    public JwtExpiredTokenException(String msg) {
        super(msg);
    }
}
