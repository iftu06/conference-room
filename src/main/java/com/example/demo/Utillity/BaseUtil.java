package com.example.demo.Utillity;

import com.example.demo.config.PackagePath;

import java.lang.reflect.Field;

/**
 * Created by Divineit-Iftekher on 3/19/2018.
 */
public class BaseUtil {

    public static Object castFieldOrRaiseTypeCastError(String fieldType, String fieldVal) throws ClassNotFoundException, NoSuchFieldException {

        ErrorObj error = null;
        Object val = null;
        if (fieldVal == null)
            return null;
        try {
            if (fieldType.equals("Integer")) {
                val = Integer.parseInt(fieldVal);
            } else if (fieldType.equals("Float")) {
                val = Float.parseFloat(fieldVal);
            } else if (fieldType.equals("Double")) {
                val = Double.parseDouble(fieldVal);
            } else if (fieldType.equals("String")) {
                val = fieldVal;
            }
        } catch (ClassCastException exp) {
            error = new ErrorObj(fieldType, "Can not Convert Due to Invalid Data");
        } catch (NumberFormatException ex) {
            error = new ErrorObj(fieldType, "Value should be number");
        }

        return error != null ? error : val;
    }

    public static Class getModelClass(String modelName) throws ClassNotFoundException {
        Class modelClass = null;
        try {
            modelClass = Class.forName(getFullclassName(modelName));
        } catch (ClassNotFoundException exp) {
            throw exp;
        }
        return modelClass;
    }

    public static String getFullclassName(String modelName) {
        return PackagePath.MODEL_PACKAGE + "." + convertToCamelCase(modelName);
    }

    public static String convertToCamelCase(String modelName) {
        return modelName.substring(0, 1).toUpperCase().concat(modelName.substring(1, modelName.length()));
    }

    public static Field getField(Class clazz, String fieldName)
            throws NoSuchFieldException {
        try {
            return clazz.getDeclaredField(fieldName);
        } catch (NoSuchFieldException e) {
            Class superClass = clazz.getSuperclass();
            if (superClass == null) {
                throw e;
            } else {
                return getField(superClass, fieldName);
            }
        }
    }


}
