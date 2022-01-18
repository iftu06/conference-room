package com.example.demo.service;

import com.example.demo.UtilValidate;
import com.example.demo.Utillity.BaseUtil;
import com.example.demo.Utillity.MapUtil;
import com.example.demo.config.PackagePath;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.Tuple;
import javax.persistence.criteria.*;
import java.lang.reflect.Field;
import java.util.*;

/**
 * Created by Divineit-Iftekher on 11/25/2017.
 */
@Component
public class QueryBuilderImpl implements QueryBuilder {

  @Autowired
  private EntityManager em;

  CriteriaBuilder cb;


  CriteriaQuery crtQuery;

  @Autowired
  MapUtil utilMap;

  private List<Predicate> predicates = new ArrayList<>();
  private List<Selection<?>> selections = new ArrayList<>();
  private List<String> fields = new ArrayList<>();

  public QueryBuilderImpl() {
  }

  public void setCb() {
    this.cb = em.getCriteriaBuilder();
  }

  public void setCrtQuery() {
    this.crtQuery = this.cb.createQuery(Tuple.class);
  }

  public Criteria getCriteria(Class modelClass) {
    return em.unwrap(Session.class).createCriteria(modelClass);
  }

  public CriteriaQuery getCriteriaQuery() {
    return cb.createTupleQuery();
  }

  private Class rootClass (String modelName) throws ClassNotFoundException {
    return BaseUtil.getModelClass(modelName);
  }

  public Query buildQuery(Node searchNode, String modelName) throws ClassNotFoundException {
    this.setCb();
    this.setCrtQuery();
    Root root = crtQuery.from(rootClass(modelName));
    Query query = null;
    this.prepareSelectionList(modelName, root);
    try {
      crtQuery.multiselect(selections);
      if (!UtilValidate.isEmpty(searchNode)) {
        this.preparePredicateList(searchNode, root, null, null);
        crtQuery.where(cb.and(predicates.toArray(new Predicate[0])));
      }

      query = em.createQuery(crtQuery);

    } catch (Exception exp) {
      exp.printStackTrace();
    }

    return query;
  }


  public void clearResource() {
    this.selections.clear();
    this.predicates.clear();
    this.fields.clear();
    em.clear();
    em.close();
  }


  public void preparePredicateList(Node searchNode, Root root, Path path, Join uJoin) throws ClassNotFoundException, NoSuchFieldException {

    if (path == null) {
      path = root;
    }

    int flag = 0;

    List<SearchProperty> searchProperties = searchNode.getSearchProperties();
    for (SearchProperty searchProperty : searchProperties) {

      // String className = PackagePath.MODEL_PACKAGE + "." + searchNode.getNodeName();
      Field field = null;
      Class clazz2 = BaseUtil.getModelClass(searchNode.getNodeName());
     // if (searchProperty.getFieldName().equals("id")) {
        field = BaseUtil.getField(clazz2, searchProperty.getFieldName());
      //} else {
        field = BaseUtil.getField(clazz2, searchProperty.getFieldName());
      //}
      String fieldType = field.getType().getSimpleName();
      String fieldValStr = String.valueOf(searchProperty.getValue());
      Object fieldVal = BaseUtil.castFieldOrRaiseTypeCastError(fieldType, fieldValStr);
      field.setAccessible(true);
      Class<? extends Comparable> clazzz = (Class<? extends Comparable>) searchProperty.getValue().getClass();
      if (searchProperty.getOpName().equals("eq")) {
        predicates.add(this.cb.equal(path.get(searchProperty.getFieldName()), fieldVal));
      } else if (searchProperty.getOpName().equals("notEq")) {
        predicates.add(this.cb.notEqual(path.get(searchProperty.getFieldName()), fieldVal));
      } else if (searchProperty.getOpName().equals("gt")) {
        predicates.add(this.cb.greaterThanOrEqualTo(path.get(searchProperty.getFieldName()), clazzz.cast(searchProperty.getValue())));
      } else if (searchProperty.getOpName().equals("lt")) {
        predicates.add(this.cb.lessThanOrEqualTo(path.get(searchProperty.getFieldName()), clazzz.cast(searchProperty.getValue())));
      } else if (searchProperty.getOpName().equals("st")) {
        predicates.add(this.cb.like(path.get(searchProperty.getFieldName()), fieldValStr + "%"));
      } else if (searchProperty.getOpName().equals("en")) {
        predicates.add(this.cb.like(path.get(searchProperty.getFieldName()), "%" + fieldValStr));
      } else if (searchProperty.getOpName().equals("%cn")) {
        predicates.add(this.cb.like(path.get(searchProperty.getFieldName()), "%" + fieldValStr + "%"));
      }


      if (!this.selectAlreadyExist(searchProperty.getAliasName())) {
        String aliasName = searchProperty.getAliasName();
        selections.add(path.get(searchProperty.getFieldName()).alias(aliasName));
      }

    }


    List<Node> childs = searchNode.getChildNodes();

    if (flag == 0) {
      for (Node child : childs) {
        Join cJoin = root.join(child.getNodeName(), JoinType.LEFT);
        child.setJoin(cJoin);
      }
    }

    flag++;

    for (Node child : childs) {
      Join sJoin = null;
      if (child.getJoin() == null) {
        sJoin = uJoin.join(child.getNodeName(), JoinType.LEFT);
        child.setJoin(sJoin);
      } else {
        sJoin = child.getJoin();
      }
      preparePredicateList(child, root, sJoin, sJoin);
    }


  }

  public List<String> getFields() {
    return this.fields;
  }

//  private Path<T> getPath(Root<T> root, String attributeName) {
//    Path<T> path = root;
//    for (String part : attributeName.split("\\.")) {
//      path = path.get(part);
//    }
//    return path;
//  }

  public void prepareSelectionList(String fileName, Root root) {
    Path path = null;
    List<Map> schema = utilMap.getSchemaMap(fileName); // get schema from entity.json/User.json file
   // schema = utilMap.removeEdit(schema);
    for (Map<String,String> schemaMap : schema) {
      String fieldName = schemaMap.get("field");
      fields.add(fieldName);
      if (fieldName.contains(".")) {
        String fieldArr[] = fieldName.split("\\.");
        path = prepareNestedPath(fieldArr, root, null, 0);
      } else {
        path = root.get(fieldName);
      }
      fieldName = fieldName.replace("\\.","_");
      if (!this.selectAlreadyExist(fieldName)) {
       // fieldName = fieldName.replace(".","_");
        selections.add(path.alias(fieldName)); // some confusion here
      }

    }

  }

  private boolean selectAlreadyExist(String fieldName) {

    for (Selection selection : this.selections) {
      if (selection.getAlias().equals(fieldName))
        return true;

    }

    return false;
  }

  private Path prepareNestedPath(String fieldArr[], Root root, Path path, int length) {
    Path innerPath = null;
    if (length == fieldArr.length) {
      return path;
    } else if (length == 0) {
      innerPath = root.get(fieldArr[length]);
      path = prepareNestedPath(fieldArr, root, innerPath, ++length);
    } else {
      innerPath = path.get(fieldArr[length]);
      path = prepareNestedPath(fieldArr, root, innerPath, ++length);
    }

    return path;

  }

}
