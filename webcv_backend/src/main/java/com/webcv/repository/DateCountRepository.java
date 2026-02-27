package com.webcv.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.time.Instant;

@NoRepositoryBean
public interface DateCountRepository<T, ID> extends JpaRepository<T, ID> {
    Long countByCreatedAtBetween(Instant start, Instant end);
}

