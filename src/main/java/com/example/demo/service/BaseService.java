package com.example.demo.service;

import com.example.demo.UtilValidate;
import com.example.demo.Utillity.BaseUtil;
import com.example.demo.Utillity.ErrorObj;
import com.example.demo.Utillity.PaginationParam;
import com.example.demo.Utillity.MapUtil;
import com.example.demo.Validate.CustomValidate;
import com.example.demo.config.PackagePath;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.Session;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.Tuple;
import javax.transaction.Transactional;
import java.lang.reflect.Field;
import java.util.*;

/**
 * Created by Divineit-Iftekher on 9/28/2017.
 */
public class BaseService {

  @Autowired
  CustomValidate customValidate;

  @Autowired
  MapUtil utilMap;

  CrudRepository repository;
  private String modelName;


  private boolean modelContainError = false;

  @Autowired
  EntityManager em;

  @Autowired
  QueryBuilder qb;

  PaginationParam paginationParam = new PaginationParam(4);

  private Query query;

  BaseService() {

  }

  BaseService(CrudRepository repository, String modelName) {
    this.repository = repository;
    this.modelName = modelName;
  }

  @Transactional
  public void saveBean(List<Object> objects) {
    repository.saveAll(objects);

  }


  public Query getQuery() {
    return query;
  }

  public void setQuery(Node searchNode) throws ClassNotFoundException, JsonProcessingException {
    this.query = this.getQb().buildQuery(searchNode, this.getModelName());
  }

  public QueryBuilder getQb() {
    return this.qb;
  }

  public void setQb(QueryBuilder qb) {
    this.qb = qb;
  }

  public Map list(Node searchNode) throws ClassNotFoundException, JsonProcessingException {
    this.setQuery(searchNode);
    Query query = this.getQuery();
    double resultSize = this.totalNumOfRow();
    this.setPaginationParam(query, this.paginationParam);
    List result = this.getResult();

    //this.appendEditAndDelete(data);
    List<Map> schema = utilMap.getSchemaMap(this.getModelName());
    double numOfPages = Math.ceil(resultSize / (double) paginationParam.getMaxResult());
    if (numOfPages < 1) {
      numOfPages = 1;
    }
    this.paginationParam.setNumOfPage((int) numOfPages);
    this.paginationParam.setResultSize(result.size());
    this.clearResource();
    return this.initialResultMapAndReturn(result, schema,(int) resultSize);
  }


  public Map initialResultMapAndReturn(List data, List schema,int resultSize) {
    Map<String,Object> resultMap = new HashMap();
    resultMap.put("pagination", this.getPaginationParam());
    resultMap.put("result", data);
    resultMap.put("resultSize", resultSize);
    resultMap.put("schema", schema);
    return resultMap;
  }

  public void clearResource() {
    this.qb.clearResource();
  }

  public void setPaginationParam(Query query, PaginationParam paginationParam) {
    int fromResult = (paginationParam.getPageNum() - 1) * paginationParam.getMaxResult();
    query.setFirstResult(fromResult);
    query.setMaxResults(paginationParam.getMaxResult());
  }

  @Transactional
  public List getResult() {
    try {
      List<Tuple> tuples = this.query.getResultList();
      return !isEmpty(tuples) ? prepareResultMap(tuples) : new ArrayList<Map<String, Object>>();
    }catch (Exception exp){
      exp.printStackTrace();
    }
    return  new ArrayList<Map<String, Object>>();
  }


  public List<Map<String, Object>> prepareResultMap(List<Tuple> resultList) {

    List<Map<String, Object>> results = new ArrayList<Map<String, Object>>();
    Map<String, Object> rowMap = new HashMap<String, Object>();
    for (Tuple tuple : resultList) {
      for (String field : this.qb.getFields()) {
        Object tupleVal = tuple.get(field);
        if (field.contains(".")) {
          String fieldArr[] = field.split("\\.");
          Map nestedMap = new HashMap();
          if (rowMap.containsKey(fieldArr[0])) {
            nestedMap = (Map) rowMap.get(fieldArr[0]);
          }
          rowMap.put(fieldArr[0], nestedMap);
          prepareNestedMap(fieldArr, tupleVal, nestedMap, 1);
        } else {
          rowMap.put(field, tupleVal);
        }//employee.shop.id
      }
      results.add(rowMap);
      rowMap = new HashMap<String, Object>();

    }

    return results;
  }

  public void prepareNestedMap(String fieldArr[], Object fieldVal, Map nestedMap, int length) {

    while (length < fieldArr.length - 1) {
      nestedMap.put(fieldArr[length], new HashMap());
      nestedMap = (Map) nestedMap.get(fieldArr[length]);
    }
    nestedMap.put(fieldArr[fieldArr.length - 1], fieldVal);

  }


  public long totalNumOfRow() {
    try {
      List result = this.query.getResultList();
      return !isEmpty(result) ? result.size() : 0;
    }catch (Exception exp){
      exp.printStackTrace();
    }
    return 0;
  }

  public List appendEditAndDelete(List<Map> result) {

    for (Map map : result) {
      Integer id = (Integer) map.get("id");
      map.put("edit", id);
      map.put("delete", id);
    }
    return result;
  }


  public Class getModelClass() throws ClassNotFoundException {
    return BaseUtil.getModelClass(this.modelName);
  }

  public List createAndvalidateBean(List<Map> reqMapList) throws ClassNotFoundException {
    BeanWrapper beanWrapper = null;
    ObjectMapper mapper = new ObjectMapper();
    List<Object> listOfModel = new ArrayList<>();
    Class modelclass = this.getModelClass();
    try {
      for (Map modelMap : reqMapList) {
        //  Map modelMap = (Map) reqMap.get(this.modelName);
        beanWrapper = preparemodel(modelclass, modelMap);
        Object bean = beanWrapper.getWrappedInstance();
        List<ErrorObj> errors = customValidate.customValidate(this.getModelName(), bean, this.getCustomValidator());
        if (errors.isEmpty()) {
          listOfModel.add(bean);
        } else {
          modelMap.put("errors", errors);
          setModelContainError(true);

        }
      }
    } catch (Exception ex) {
      ex.printStackTrace();
    }

    if (this.isModelContainError()) {
      return reqMapList;
    }

    return listOfModel;
  }


  public BeanWrapper preparemodel(Class modelclass, Map modelMap) throws ClassNotFoundException, IllegalAccessException, InstantiationException, NoSuchFieldException {
    Iterator it = modelMap.entrySet().iterator();
    BeanWrapper bean = new BeanWrapperImpl(modelclass.newInstance());
    List<Field> fields = new ArrayList<>(Arrays.asList(modelclass.getDeclaredFields()));
    try {
      Field idField = BaseUtil.getField(modelclass, "id");
      idField.setAccessible(true);
      fields.add(idField);
    } catch (NoSuchFieldException exp) {
      exp.printStackTrace();
    }
    for (Field field : fields) {
      String fieldName = field.getName();
      if (!UtilValidate.isEmpty(modelMap.get(field.getName()))) {
        String type = modelMap.get(fieldName).getClass().getSimpleName();
        if (type.equals("LinkedHashMap")) {
          BeanWrapper innerBean = null;
          String fullClassName = PackagePath.MODEL_PACKAGE + "." + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1, fieldName.length());
          Class mClass = Class.forName(fullClassName);
          innerBean = preparemodel(mClass, (Map) modelMap.get(field.getName()));
          bean.setPropertyValue(fieldName, innerBean.getWrappedInstance());
        } else if (type.equals("ArrayList")) {
          List<Map> innerList = (List) modelMap.get(field.getName());
          List<Object> innerObject = new ArrayList<>();
          for (Map innerMap : innerList) {
            BeanWrapper innerBean = null;
            String fullClassName = PackagePath.MODEL_PACKAGE + "." + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1, fieldName.length() - 1);
            Class mClass = Class.forName(fullClassName);
            innerBean = preparemodel(mClass, innerMap);
            innerObject.add(innerBean.getWrappedInstance());
          }
          bean.setPropertyValue(fieldName, innerObject);
        } else {
          bean.setPropertyValue(field.getName(), modelMap.get(field.getName()));
        }
      }

    }
    return bean;
  }

  public List typeValidatedList(String requestData) throws JsonProcessingException {
    ObjectMapper mapper = new ObjectMapper();
    List<Map> reqMapList = new ArrayList<>();
    try {
      reqMapList = mapper.readValue(requestData, List.class);
      for (Map reqMap : reqMapList) {
        Map modelMap = (Map) reqMap.get(this.modelName);
        validateTypeCast(modelMap);
      }
    } catch (Exception ex) {

    }
    return reqMapList;
  }

  public void validateTypeCast(Map modelMap) throws ClassNotFoundException, NoSuchFieldException {
    Object obj = null;
    List errors = new ArrayList();
    Class modelClass = null;
    try {
      modelClass = BaseUtil.getModelClass(this.modelName);

      Iterator modelIt = modelMap.entrySet().iterator();
      while (modelIt.hasNext()) {
        Map.Entry entry = (Map.Entry) modelIt.next();
        String fieldName = (String) entry.getKey();
        String fieldVal = (String) entry.getValue();
        if (fieldName.equals("id") && fieldVal.equals("")) {
          continue;
        }
        Field f = modelClass.getDeclaredField(fieldName);
        //field cast validation
        obj = BaseUtil.castFieldOrRaiseTypeCastError(f.getType().getSimpleName(), fieldVal);
        if (obj instanceof ErrorObj) {
          errors.add(obj);
        } else {
          modelMap.put(fieldName, obj);
        }
      }
      if (errors.size() > 0) {
        modelMap.put("errors", errors);
        this.setModelContainError(true);
      }
    } catch (ClassNotFoundException exp) {
      throw exp;
    } catch (NoSuchFieldException exp) {
      throw exp;
    }

  }


  public List get() {
    return (List) repository.findAll();

  }


  public String getModelName() {
    return this.modelName;
  }

  public String getCustomValidator() {
    return PackagePath.VALIDATOR_PACKAGE + "." + this.modelName;
  }

  public boolean isModelContainError() {
    return modelContainError;
  }

  public void setModelContainError(boolean modelContainError) {
    this.modelContainError = modelContainError;
  }

  public PaginationParam getPaginationParam() {
    return paginationParam;
  }

  public void setPaginationParam(PaginationParam paginationParam) {
    this.paginationParam = paginationParam;
  }

  public void delete(Integer id) {
    Object obj = this.repository.findById(id);
    this.repository.delete(obj);

  }

  public Object getById(Integer id) {
    return this.repository.findById(id);
  }

  public boolean isEmpty(Object obj) {
    if (obj == null) {
      return true;
    }
    if (obj instanceof String) {
      String str = (String) obj;
      return str.isEmpty();
    } else if (obj instanceof List) {
      List list = (List) obj;
      return list.isEmpty() ? true : false;
    }else if(obj instanceof Map){
      Map map = (Map) obj;
      return map.isEmpty() ? true : false;
    }
    return false;
  }


}
