package com.webcv.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cv_field_values",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"cv_id", "field_id"})
        })
public class CvFieldValueEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * CV nào
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id", nullable = false)
    private CvEntity cv;

    /**
     * Field nào trong form
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    private CvFormFieldEntity field;

    @Column(name = "value_text", columnDefinition = "TEXT")
    private String valueText;
}
