package com.example.demo.service;

import com.example.demo.model.JoinType;

import javax.persistence.criteria.Join;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Divineit-Iftekher on 11/20/2017.
 */
public class Node {

  String nodeName;
  Join join;
  List<Node> childNodes = new ArrayList<>();
  List<SearchProperty> searchProperties = new ArrayList();
  JoinType joinType;

  public Node(String nodeName) {
    this.nodeName = nodeName;
  }

  public String getNodeName() {
    return nodeName;
  }

  public void setNodeName(String nodeName) {
    this.nodeName = nodeName;
  }

  public List<Node> getChildNodes() {
    return childNodes;
  }

  public void setChildNodes(List<Node> childNodes) {
    this.childNodes = childNodes;
  }

  public List<SearchProperty> getSearchProperties() {
    return searchProperties;
  }

  public void setSearchProperties(List<SearchProperty> searchProperties) {
    this.searchProperties = searchProperties;
  }

  public Join getJoin() {
    return join;
  }

  public void setJoin(Join join) {
    this.join = join;
  }


  public JoinType getJoinType() {
    return joinType;
  }

  public void setJoinType(JoinType joinType) {
    this.joinType = joinType;
  }
}
