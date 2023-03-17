package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.dto.LobbyAndUserDto;
import Strikeboom.StrikesGames.dto.LobbyDto;
import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import Strikeboom.StrikesGames.repository.UserRepository;
import Strikeboom.StrikesGames.service.LobbyService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/lobby/")
@AllArgsConstructor
public class LobbyAPIController {
    private final LobbyService lobbyService;
    private final LobbyRepository lobbyRepository;
    private final UserRepository userRepository;
    @PostMapping("join/{joinCode}")
    public ResponseEntity<LobbyAndUserDto> join(@PathVariable String joinCode,@CookieValue(value = "userId",required = false) UUID userId) {
        Optional<Lobby> lobbyOptional = lobbyRepository.findLobbyFromJoinCode(joinCode);
        if (lobbyOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Lobby lobby = lobbyOptional.get();
        //check if user is already in lobby
        User user;
        Optional<User> userFromId = userRepository.findById(userId);
        if (userFromId.isPresent()) {
            user = userFromId.get();
            if (!lobbyService.isUserInLobby(user,lobby)) {
                lobbyService.removeUserFromLobby(user);
                lobbyService.joinLobby(lobby, user);
            }
        } else {
            user = User.builder().separationId(UUID.randomUUID()).name("Anonymous").build();
            lobbyService.joinLobby(lobby, user);
        }
        return ResponseEntity.ok(new LobbyAndUserDto(LobbyService.mapToDto(lobby),user.getId(),user.getSeparationId()));
    }
    @PostMapping("create")
    public ResponseEntity<LobbyAndUserDto> create(@RequestBody LobbyDto lobby) {
        User creator = User.builder().separationId(UUID.randomUUID()).name("Anonymous").build();
        creator.setCreator(true);
        Lobby l = lobbyService.createLobby(lobby);
        lobbyService.joinLobby(l,creator);
        return ResponseEntity.ok(new LobbyAndUserDto(LobbyService.mapToDto(l),creator.getId(),creator.getSeparationId()));
    }
    @GetMapping("public-lobbies")
    public ResponseEntity<List<LobbyDto>> getNonFullPublicLobbies(@RequestHeader(value = "Max-Lobbies",defaultValue = "50") int maxLobbies) {
        if (maxLobbies >= 100) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
        }
        List<Lobby> lobbies = lobbyRepository.findNonFullPublicLobbies(PageRequest.of(0,maxLobbies));
        return ResponseEntity.ok(lobbies.stream().map(LobbyService::mapToDto).toList());
    }
}
