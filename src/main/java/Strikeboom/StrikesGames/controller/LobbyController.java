package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.dto.LobbyDto;
import Strikeboom.StrikesGames.entity.Lobby;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lobby/")
@AllArgsConstructor
public class LobbyController {
    @PostMapping("create")
    public ResponseEntity<Void> create(@RequestBody LobbyDto lobby) {

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
