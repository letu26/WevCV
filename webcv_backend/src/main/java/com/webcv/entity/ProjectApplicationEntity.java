package com.webcv.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "project_applications",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"project_id", "cv_id"})
        })
public class ProjectApplicationEntity  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Project mà CV được duyệt vào
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;

    /**
     * CV được duyệt
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id", nullable = false)
    private CvEntity cv;

    /**
     * Trạng thái: APPROVED / REMOVED
     */
    @Column(name = "status", nullable = false)
    private String status;

    /**
     * Người duyệt (LEAD)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applied_by")
    private UserEntity appliedBy;
}
