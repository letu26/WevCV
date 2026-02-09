package com.webcv.entity;

import com.webcv.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;

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
    private UserStatus status;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "cv_users",
            joinColumns = @JoinColumn(name = "cv_id", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "user_id", nullable = false))
    private List<UserEntity> users;
}