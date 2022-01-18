package com.example.demo.ajaxauth;

import com.example.demo.exception.AuthMethodNotSupportedException;
import com.example.demo.exception.AuthenticationServiceException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {


  @Autowired
  AuthenticationSuccessHandler authenticationSuccessHandler = new AuthenticationSuccessHandlerImpl(new JwtUtil());

  @Autowired
  AuthenticationFailureHandler authenticationFailureHandler = new AuthenticationFailureHandlerImpl();

  private final ObjectMapper objectMapper = new ObjectMapper();

  private AuthenticationManager authenticationManager;

  public AuthenticationFilter(AuthenticationManager authenticationManager){

    this.authenticationManager = authenticationManager;
  }


  @SneakyThrows
  @Override
  public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse httpServletResponse) throws AuthenticationException {

    if (!"POST".equals(request.getMethod())) {
      throw new AuthMethodNotSupportedException("Mehtod is not supported");
    }

    LoginRequest loginRequest =objectMapper.readValue(request.getReader(), LoginRequest.class);

    if (StringUtils.isEmpty(loginRequest.getEmail()) || StringUtils.isEmpty(loginRequest.getPassword())) {
      throw new AuthenticationServiceException("Username or password is not provided");
    }

    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
            = new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),loginRequest.getPassword());

    return this.authenticationManager.authenticate(usernamePasswordAuthenticationToken);

  }

  @Override
  protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                          Authentication authResult) throws IOException, ServletException {
    authenticationSuccessHandler.onAuthenticationSuccess(request, response, authResult);
  }

  @Override
  protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            AuthenticationException failed) throws IOException, ServletException {
    SecurityContextHolder.clearContext();
    authenticationFailureHandler.onAuthenticationFailure(request, response, failed);
  }

}
