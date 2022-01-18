package com.example.demo.model;

import org.springframework.http.HttpStatus;

import java.util.Map;

/**
 * Created by Divineit-Iftekher on 1/16/2018.
 */
public class ResponseObj {


  private String message;

  private HttpStatus status;

  private Map responseBody;

  ResponseObj() {

  }

 public ResponseObj(String message, HttpStatus status) {
    this.message = message;
    this.status = status;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }


  public Map getResponseBody() {
    return responseBody;
  }

  public void setResponseBody(Map responseBody) {
    this.responseBody = responseBody;
  }

  public HttpStatus getStatus() {
    return status;
  }

  public void setStatus(HttpStatus status) {
    this.status = status;
  }
}
