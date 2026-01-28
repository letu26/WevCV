package com.webcv.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.webcv.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user")
public class UserEntity extends BaseEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    @JsonIgnore
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullname;

    @Column(name = "email", nullable = false)
    private String email;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role",
            joinColumns = @JoinColumn(name = "userid", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "roleid", nullable = false))
    @Builder.Default
    private List<RoleEntity> roles = new ArrayList<>();
    
    @OneToMany(mappedBy = "user")
    private List<PasswordResetEntity> resetTokens;

    @Column(name = "change_password_at", nullable = true)
    private Instant changePasswordAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName().toUpperCase()))
                .toList();
    }

    @PrePersist
    public void prePersist() {
        if (this.status == null) {
            this.status = UserStatus.ACTIVE;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<RoleEntity> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleEntity> roles) {
        this.roles = roles;
    }

    public List<PasswordResetEntity> getResetTokens() {
        return resetTokens;
    }

    public void setResetTokens(List<PasswordResetEntity> resetTokens) {
        this.resetTokens = resetTokens;
    }

    public Instant getChangePasswordAt() {
        return changePasswordAt;
    }

    public void setChangePasswordAt(Instant changePasswordAt) {
        this.changePasswordAt = changePasswordAt;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}
