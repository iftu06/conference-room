package com.example.demo.Utillity;

/**
 * Created by Divineit-Iftekher on 1/6/2018.
 */
public class PaginationParam {

    private int pageNum;
    private int maxResult;
    private int resultSize;
    private int numOfPage;

    PaginationParam(){

    }

    public PaginationParam(int maxResult){
        this.maxResult = maxResult;
    }

    public int getPageNum() {
        return pageNum;
    }

    public void setPageNum(int pageNum) {
        this.pageNum = pageNum;
    }

    public int getMaxResult() {
        return maxResult;
    }

    public void setMaxResult(int maxResult) {
        this.maxResult = maxResult;
    }

    public int getResultSize() {
        return resultSize;
    }

    public void setResultSize(int resultSize) {
        this.resultSize = resultSize;
    }

    public int getNumOfPage() {
        return numOfPage;
    }

    public void setNumOfPage(int numOfPage) {
        this.numOfPage = numOfPage;
    }


}
