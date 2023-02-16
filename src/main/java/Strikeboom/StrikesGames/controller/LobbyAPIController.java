package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.dto.LobbyDto;
import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.repository.UserRepository;
import Strikeboom.StrikesGames.service.LobbyService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@RestController
@AllArgsConstructor
public class LobbyAPIController {
    private final LobbyService lobbyService;
    private final UserRepository userRepository;
    @PostMapping("/api/lobby/create")
    public ResponseEntity<LobbyDto> create(@RequestBody LobbyDto lobby, HttpSession session) {
        User creator = User.builder().name("Anonymous").build();
        Lobby l = lobbyService.createLobby(lobby);
        l.setCreator(creator);
        userRepository.save(creator);
        lobbyService.joinLobby(l,creator);
        session.setAttribute("userId",creator.getId());
        return ResponseEntity.ok(LobbyService.mapToDto(l));
    }
}
