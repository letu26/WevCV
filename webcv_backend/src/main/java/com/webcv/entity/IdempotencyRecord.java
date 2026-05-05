package com.webcv.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "idempotency_record")
public class IdempotencyRecord {

    @Id
    @Column(name = "idempotency_key")
    private String key;

    @Column(columnDefinition = "TEXT")
    private String responseBody;

    private int statusCode;

    private LocalDateTime createdAt;
}
