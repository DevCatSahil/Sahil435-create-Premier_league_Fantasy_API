package com.pl.premier_zone.player;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    // Get all players
    public List<Player> getPlayers() {
        return playerRepository.findAll();
    }

    // Filters
    public List<Player> getPlayerFromTeam(String teamName) {
        return playerRepository.findByTeamNameIgnoreCase(teamName);
    }

    public List<Player> getPlayersByName(String name) {
        return playerRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Player> getPlayersByPosition(String position) {
        return playerRepository.findByPositionContainingIgnoreCase(position);
    }

    public List<Player> getPlayersByNation(String nation) {
        return playerRepository.findByNationContainingIgnoreCase(nation);
    }

    public List<Player> getPlayersByPositionAndTeam(String team, String position) {
        return playerRepository.findByTeamNameAndPositionAllIgnoreCase(team, position);
    }

    // Add
    public Player addPlayer(Player player) {
        return playerRepository.save(player);
    }
    public List<Player> addPlayer(List<Player> players) {
        return playerRepository.saveAll(players);
    }

    // Update
    public Player updatePlayer(Long id, Player updatedPlayer) {
        return playerRepository.findById(id).map(player -> {

            player.setName(updatedPlayer.getName());
            player.setNation(updatedPlayer.getNation());
            player.setPosition(updatedPlayer.getPosition());
            player.setAge(updatedPlayer.getAge());
            player.setMatPlayed(updatedPlayer.getMatPlayed());
            player.setStarts(updatedPlayer.getStarts());
            player.setMinPlayed(updatedPlayer.getMinPlayed());
            player.setGoals(updatedPlayer.getGoals());
            player.setAssists(updatedPlayer.getAssists());
            player.setPenScored(updatedPlayer.getPenScored());
            player.setyCards(updatedPlayer.getyCards());
            player.setrCards(updatedPlayer.getrCards());
            player.setExpGoals(updatedPlayer.getExpGoals());
            player.setExpAssists(updatedPlayer.getExpAssists());
            player.setTeamName(updatedPlayer.getTeamName());

            return playerRepository.save(player);

        }).orElseThrow(() -> new RuntimeException("Player not found"));
    }

    // Delete
    @Transactional
    public void deletePlayer(Long id) {
        if (!playerRepository.existsById(id)) {
            throw new RuntimeException("Player not found");
        }
        playerRepository.deleteById(id);
    }
}