package com.webcv.entity;

import com.webcv.enums.FormStatus;
import com.webcv.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "cvs")
public class CvEntity extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "json")
    private String layout;

    @Column(columnDefinition = "json")
    private String blocks;

    private Boolean deleted;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FormStatus status;

    @Column(name = "token")
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private Visibility visibility;

    @Column(name = "share_expired_at")
    private Instant shareExpiredAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_cvs",
            joinColumns = @JoinColumn(name = "cv_id", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "user_id", nullable = false))
    private List<UserEntity> users;
}