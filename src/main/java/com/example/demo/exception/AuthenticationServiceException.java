package com.example.demo.exception;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;


public class AuthenticationServiceException extends AuthenticationException {
    public AuthenticationServiceException(String msg) {
        super(msg);
    }
}
