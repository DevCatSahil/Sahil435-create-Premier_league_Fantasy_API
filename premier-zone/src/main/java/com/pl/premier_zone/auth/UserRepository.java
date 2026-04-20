// com/pl/premier_zone/auth/UserRepository.java
package com.pl.premier_zone.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}