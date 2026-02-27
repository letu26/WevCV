package com.webcv.request.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChartPointRequest {

    private String date;
    private Long count;
}
