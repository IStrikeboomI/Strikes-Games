package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.dto.LobbyDto;
import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import Strikeboom.StrikesGames.repository.UserRepository;
import Strikeboom.StrikesGames.service.LobbyService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lobby/")
@AllArgsConstructor
public class LobbyAPIController {
    private final LobbyService lobbyService;
    private final LobbyRepository lobbyRepository;
    private final UserRepository userRepository;
    @PostMapping("create")
    public ResponseEntity<LobbyDto> create(@RequestBody LobbyDto lobby, HttpSession session) {
        User creator = User.builder().name("Anonymous").build();
        creator.setCreator(true);
        Lobby l = lobbyService.createLobby(lobby);
        creator.setLobby(l);
        userRepository.save(creator);
        lobbyService.joinLobby(l,creator);
        session.setAttribute("userId",creator.getId());
        return ResponseEntity.ok(LobbyService.mapToDto(l));
    }
    @GetMapping("public-lobbies")
    public ResponseEntity<List<LobbyDto>> getPublicLobbies(@RequestHeader(value = "Max-Lobbies",defaultValue = "50") int maxLobbies) {
        if (maxLobbies >= 100) {
            return ResponseEntity.status(413).build();
        }
        List<Lobby> lobbies = lobbyRepository.findPublicLobbies(PageRequest.of(0,maxLobbies));
        return ResponseEntity.ok(lobbies.stream().map(LobbyService::mapToDto).toList());
    }
}
