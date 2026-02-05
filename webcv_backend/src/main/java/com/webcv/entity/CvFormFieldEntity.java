package com.webcv.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
    name = "cv_form_fields",
    uniqueConstraints = {
            @UniqueConstraint(columnNames = {"cv_form_id", "field_key"})
    }
)
public class CvFormFieldEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_form_id", nullable = false)
    private CvFormEntity cvForm;

    @Column(name = "label")
    private String label;

    @Column(name = "field_key")
    private String fieldKey;

    @Column(name = "field_type")
    private String fieldType;

    @Column(name = "required")
    private Boolean required;

    @Column(name = "order_index")
    private Integer orderIndex;
}