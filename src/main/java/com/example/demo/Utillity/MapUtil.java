package com.example.demo.Utillity;

import com.example.demo.UtilValidate;
import com.example.demo.service.Node;
import com.example.demo.service.SearchProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.*;

/**
 * Created by Divineit-Iftekher on 11/14/2017.
 */
@Component
public class MapUtil {


  ResourceLoader resourceLoader;

  @Autowired
  public MapUtil(ResourceLoader resourceLoader) {
    this.resourceLoader = resourceLoader;
  }

  //this method is used to convert string to map
  public static Map convertStringToMap(String mapStr) throws Exception {
    Map resultMap = new HashMap();
    if (!UtilValidate.isEmpty(mapStr)) {
      resultMap = (Map) convertStringToObject(mapStr, HashMap.class);
    }
    return resultMap;

  }

  public Node makeSearchNode(Map queryMap, String modelName) throws JsonProcessingException {
    Iterator it = queryMap.entrySet().iterator();
    Node rootNode = new Node(modelName);
    Node currentNode = null;
    while (it.hasNext()) {
      Map.Entry<String, Object> entry = (Map.Entry) it.next();
      Object searchVal = entry.getValue();
      if (!UtilValidate.isEmpty(searchVal)) {
        String searchKey = entry.getKey();
        String searchArr[] = searchKey.split("_");
        String operatorName = searchArr[searchArr.length - 1];
        String fieldName = searchArr[searchArr.length - 2];
        String removeOp = "_" + operatorName;
        String aliasName = searchKey.replace(removeOp, "");
        aliasName = aliasName.replace(modelName + "_", "");
        SearchProperty searchProperty = new SearchProperty(fieldName, operatorName, searchVal, aliasName);
        currentNode = composeSearchTree(rootNode, fieldName);
        currentNode.getSearchProperties().add(searchProperty);
      }

    }

    List<String> columns = getColumnsFromScema(rootNode.getNodeName());

    for (String column : columns) {
      if (column.contains(".")) {
        composeSearchTree(rootNode, column);
      }
    }
    return rootNode;
  }

  public Node composeSearchTree(Node rootNode, String fieldName) {

    Node currentNode = rootNode;
    String nestFieldArr[] = null;
    if (fieldName.contains(".")) {
      nestFieldArr = fieldName.split("\\.");
    } else if (fieldName.contains("_")) {
      nestFieldArr = fieldName.split("_");
    }

    if (nestFieldArr != null) {
      for (int i = 0; i < nestFieldArr.length - 1; i++) {
        currentNode = containsNode(nestFieldArr[i], currentNode); // company_department_employee_name_eq
      }
    }
    return currentNode;
  }

  public static Node containsNode(String searchNodeName, Node rootNode) {
    Node searchNode = new Node(searchNodeName);
    List<Node> childs = rootNode.getChildNodes();
    if (childs.isEmpty()) {
      childs.add(searchNode);
      return searchNode;
    }
    for (Node node : childs) {
      if (searchNode.getNodeName().equals(node.getNodeName())) {
        return node;
      }
    }

    childs.add(searchNode);
    return searchNode;
  }


  public List<Map> getSchemaMap(String modelName) {

    String fileNameWithExtension = ResourceLoader.CLASSPATH_URL_PREFIX + "static/" + modelName + ".json";
    File jsonFile = null;
    ObjectMapper mapper = new ObjectMapper();
    List<Map> schema = new ArrayList();
    Resource resource = resourceLoader.getResource(fileNameWithExtension);
    try {
      jsonFile = resource.getFile();
      schema = mapper.readValue(jsonFile, List.class);
    } catch (IOException ex) {
      ex.printStackTrace();
    } catch (Exception ex) {
      ex.printStackTrace();
    }
    return schema;
  }

  public List<String> getColumnsFromScema(String modelName) {

    List<Map> schema = this.getSchemaMap(modelName);
    List<String> columns = new ArrayList<>();
    for (Map map : schema) {
      columns.add((String) map.get("field"));
    }
    return columns;
  }


  public List<String> getValidatorList(String modelName) {

    String fileNameWithExtension = ResourceLoader.CLASSPATH_URL_PREFIX + "Validator/" + modelName + ".json";
    File jsonFile = null;
    ObjectMapper mapper = new ObjectMapper();
    Map validatorMap = new HashMap();
    List validatorList = new ArrayList();
    Resource resource = resourceLoader.getResource(fileNameWithExtension);
    try {
      jsonFile = resource.getFile();
      validatorMap = mapper.readValue(jsonFile, HashMap.class);
      validatorList = (List) validatorMap.get(modelName);
    } catch (IOException ex) {
      ex.printStackTrace();
    } catch (Exception ex) {
      ex.printStackTrace();
    }
    return validatorList;
  }

  public List removeEdit(List<Map> schema) {
    Iterator it = schema.iterator();
    while (it.hasNext()) {
      Map map = (Map) it.next();
      String data = (String) map.get("data");
      if (data.equals("edit")) {
        it.remove();
      }
    }
    return schema;

  }

  public static Object convertStringToObject(String payload, Class convertingClass) {
    ObjectMapper mapper = new ObjectMapper();
    Object convertedObj = null;
    try {
      convertedObj = mapper.readValue(payload, convertingClass);
    } catch (IOException exp) {
      exp.printStackTrace();
    }
    return convertedObj;
  }

  public Object convertToValue(Object obj, Class convertClass) {
    ObjectMapper mapper = new ObjectMapper();
    return mapper.convertValue(obj, convertClass);
  }


}
