package com.webcv.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.springframework.http.HttpMethod.*;
import static org.springframework.http.HttpMethod.DELETE;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final JwtTokenFilter jwtTokenFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(requests -> {
                    requests
                            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                            .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/refresh", "/api/forgot/checkmail","/api/forgot/checkotp", "/api/forgot/resetpassword", "/api/cvs/share-cv/**")
                            .permitAll()
                            .requestMatchers(GET, "/api/products**").hasAnyRole("USER", "ADMIN")

                            .requestMatchers(POST, "/api/products/**").hasAnyRole("ADMIN")

                            .requestMatchers(PUT, "/api/products/**").hasAnyRole("ADMIN")

                            .requestMatchers(DELETE,"/api/products/**").hasAnyRole("ADMIN")

                            .requestMatchers(POST, "/api/users/changepass").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(POST, "/api/admin/account/**").hasRole( "ADMIN")
                            .requestMatchers("/api/admin/project/**").hasRole("ADMIN")
                            .requestMatchers("/api/lead/**").hasRole("LEAD")

                            .requestMatchers(POST, "/api/cvs/**").hasRole("USER")
                            .requestMatchers(GET, "/api/cvs/**").hasRole("USER")
                            .requestMatchers(DELETE, "/api/cvs/**").hasAnyRole("USER","LEAD", "ADMIN")
                            .requestMatchers(GET, "/api/pdf-jobs/**").hasRole("USER")

                            .requestMatchers(GET, "/api/admin/cvs/**").hasAnyRole( "ADMIN", "LEAD")
                            .anyRequest().authenticated();
                });
        return http.build();
    }


}
