package com.webcv.entity;


import com.webcv.enums.FormStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cvs")
public class CvEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * User sở hữu CV
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    /**
     * CV form dùng để tạo CV
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_form_id", nullable = false)
    private CvFormEntity cvForm;

    /**
     * Trạng thái CV (ACTIVE / INACTIVE / ARCHIVED ...)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private FormStatus status;

    /**
     * Giá trị các field trong CV
     */
    @OneToMany(mappedBy = "cv", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CvFieldValueEntity> fieldValues;
}
