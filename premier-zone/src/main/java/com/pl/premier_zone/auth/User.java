package com.pl.premier_zone.auth;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;   // BCrypt hash, never plain text

    @Column(nullable = false)
    private String role;       // "ROLE_USER" or "ROLE_ADMIN"

    public User() {}

    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // getters
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getRole()     { return role; }
}