package com.webcv.enums;

/**
 * Defines time range type for dashboard statistics.
 * Used to determine how many days of data should be returned.
 */
public enum RangeType {

    /** Today only */
    DAY,

    /** Last 7 days */
    WEEK,

    /** Last 30 days */
    MONTH
}
