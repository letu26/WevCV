package com.webcv.cvpdf.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Layout {
    private List<String> left = List.of();
    private List<String> right = List.of();
}