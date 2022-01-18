package com.example.demo.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * Created by Divineit-Iftekher on 4/9/2018.
 */
public class AuthMethodNotSupportedException extends AuthenticationException {

  public AuthMethodNotSupportedException(String message) {
    super(message);
  }
}
