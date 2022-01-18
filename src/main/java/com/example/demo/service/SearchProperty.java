package com.example.demo.service;

import lombok.Builder;
import lombok.Data;

/**
 * Created by Divineit-Iftekher on 11/20/2017.
 */
@Data
@Builder
public class SearchProperty {

  private String fieldName;
  private String opName;
  private Object value;
  private String aliasName;

  public SearchProperty(String fieldName, String opName, Object value, String aliasName) {
    this.fieldName = fieldName;
    this.opName = opName;
    this.value = value;
    this.aliasName = aliasName;
  }

  public SearchProperty(){

  }

}
