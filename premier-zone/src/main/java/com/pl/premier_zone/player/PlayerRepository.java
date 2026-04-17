package com.pl.premier_zone.player;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByName(String name);

    List<Player> findByTeamNameIgnoreCase(String teamName);

    List<Player> findByPositionContainingIgnoreCase(String position);

    List<Player> findByNationContainingIgnoreCase(String nation);

    List<Player> findByNameContainingIgnoreCase(String name);

    List<Player> findByTeamNameAndPositionAllIgnoreCase(String teamName, String position);
}