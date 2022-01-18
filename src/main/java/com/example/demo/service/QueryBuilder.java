package com.example.demo.service;

import com.example.demo.Utillity.PaginationParam;
import com.fasterxml.jackson.core.JsonProcessingException;

import javax.persistence.Query;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Root;
import java.util.List;

/**
 * Created by Divineit-Iftekher on 11/28/2017.
 */
public interface QueryBuilder {

  public void prepareSelectionList(String fileName, Root root);

  public void preparePredicateList(Node searchNode, Root root, Path path, Join join) throws ClassNotFoundException, NoSuchFieldException;

  public Query buildQuery(Node searchNode, String modelName) throws JsonProcessingException, ClassNotFoundException;

  public List<String> getFields();

  public void clearResource() ;
}
