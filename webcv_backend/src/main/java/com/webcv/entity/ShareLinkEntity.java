package com.webcv.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "share_links")
public class ShareLinkEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * CV được share
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id", nullable = false)
    private CvEntity cv;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @Column(name = "expired_at")
    private Instant expiredAt;

    /**
     * Người tạo link (admin / lead)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private UserEntity createdBy;
}

