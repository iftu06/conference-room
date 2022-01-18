package com.example.demo.jwtsecurity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by Divineit-Iftekher on 4/15/2018.
 */

@Component
public class JwtAuthenticationProvider implements AuthenticationProvider {

//    @Autowired
//    JwtValidator validator;

  @Override
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    UsernamePasswordAuthenticationToken jwtAuthenticationToken = (UsernamePasswordAuthenticationToken)authentication;
    //String token = jwtAuthenticationToken.getToken();
    return jwtAuthenticationToken;
  }

  @Override
  public boolean supports(Class<?> aClass) {
    return false;
  }

//    @Override
//    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) throws AuthenticationException {
//
//    }
//
//    @Override
//    protected UserDetails retrieveUser(String s, UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) throws AuthenticationException {
//        JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) usernamePasswordAuthenticationToken;
//        String token = jwtAuthenticationToken.getToken();
//
//        JwtUser jwtUser = validator.validate(token);
//        if (jwtUser == null) {
//            throw new RuntimeException("Token is not validate");
//        }
//
//        List<GrantedAuthority> grantedAuthorities = AuthorityUtils.commaSeparatedStringToAuthorityList(jwtUser.getRole());
//
//        return new JwtUserDetails(jwtUser.getUserName(),jwtUser.getId(),token,grantedAuthorities);
//    }
//
//    @Override
//    public boolean supports(Class<?> aClass) {
//
//        return JwtAuthenticationToken.class.isAssignableFrom(aClass);
//    }
}
