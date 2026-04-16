package com.pl.premier_zone.player;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/player")
@CrossOrigin(origins = "http://localhost:3000") // React connection
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    // GET with filters
    @GetMapping
    public List<Player> getPlayers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) String team,
            @RequestParam(required = false) String nation
    ) {
        if (team != null && position != null) {
            return playerService.getPlayersByPositionAndTeam(team, position);
        } else if (team != null) {
            return playerService.getPlayerFromTeam(team);
        } else if (nation != null) {
            return playerService.getPlayersByNation(nation);
        } else if (name != null) {
            return playerService.getPlayersByName(name);
        } else if (position != null) {
            return playerService.getPlayersByPosition(position);
        } else {
            return playerService.getPlayers();
        }
    }

    // POST
    @PostMapping
    public ResponseEntity<Player> addPlayer(@RequestBody Player player) {
        return new ResponseEntity<>(playerService.addPlayer(player), HttpStatus.CREATED);
    }

    @PostMapping("/players/bulk")
    public ResponseEntity<List<Player>> addPlayers(@RequestBody List<Player> players) {
        return new ResponseEntity<>(playerService.addPlayer(players), HttpStatus.CREATED);
    }

    // PUT
    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(
            @PathVariable Long id,
            @RequestBody Player player
    ) {
        return ResponseEntity.ok(playerService.updatePlayer(id, player));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.ok("Player deleted successfully");
    }
}