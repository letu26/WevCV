package com.webcv.cvpdf.model;

import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Setter
public class PdfBlock {
    private String id;
    private String type;
    private String title;
    private Map<String, Object> data = new LinkedHashMap<>();
    private String dataJson;
}