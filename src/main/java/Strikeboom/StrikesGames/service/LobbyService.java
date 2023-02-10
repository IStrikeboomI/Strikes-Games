package Strikeboom.StrikesGames.service;

import Strikeboom.StrikesGames.dto.LobbyDto;
import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.exception.LobbyNotFoundException;
import Strikeboom.StrikesGames.exception.PlayerUnableToJoinException;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Random;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class LobbyService {
    private final LobbyRepository lobbyRepository;
    public Lobby createLobby(LobbyDto lobbyDto) {
        return lobbyRepository.save(map(lobbyDto));
    }
    public void joinLobby(Lobby lobby, User user) {
        if (lobby.getUsers().size() < lobby.getMaxPlayers()) {
            if (!lobby.getUsers().contains(user)) {
                lobby.getUsers().add(user);
            } else {
                throw new PlayerUnableToJoinException("User is already in lobby!");
            }
        } else {
            throw new PlayerUnableToJoinException("Lobby is full!");
        }
    }
    private LobbyDto getLobbyFromJoinCode(String joinCode) {
        return mapToDto(lobbyRepository.findLobbyFromJoinCode(joinCode).orElseThrow(() -> new LobbyNotFoundException(String.format("Lobby with join code: %s not found",joinCode))));
    }
    private LobbyDto getLobbyFromId(long id) {
        return mapToDto(lobbyRepository.findById(id).orElseThrow(() -> new LobbyNotFoundException(String.format("Lobby with id: %s not found",id))));
    }
    private LobbyDto mapToDto(Lobby lobby) {
        return LobbyDto.builder()
                .created(lobby.getCreated())
                .game(lobby.getGame())
                .isPrivate(lobby.isPrivate())
                .maxPlayers(lobby.getMaxPlayers())
                .name(lobby.getName())
                .joinCode(lobby.getJoinCode())
                .users(lobby.getUsers())
                .creator(lobby.getCreator())
                .gameStarted(lobby.isGameStarted())
                .build();
    }
    //called only on creation of lobby
    private Lobby map(LobbyDto lobby) {
        return Lobby.builder()
                .created(Instant.now())
                .game(lobby.getGame())
                .isPrivate(lobby.isPrivate())
                .maxPlayers(lobby.getMaxPlayers())
                .name(lobby.getName())
                .joinCode(generateValidJoinCode())
                .users(new ArrayList<>())
                .creator(lobby.getCreator())
                .gameStarted(false)
                .build();
    }
    //characters allowed in the join code URL
    private static final char[] VALID_CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray();
    private static String generateJoinCode() {
        StringBuilder builder = new StringBuilder(7);
        Random random = new Random();
        for (int i = 0;i < builder.capacity();i++) {
            builder.append(VALID_CHARACTERS[random.nextInt(VALID_CHARACTERS.length)]);
        }
        return builder.toString();
    }
    //used to make sure we don't generate a duplicate join code
    @Transactional(readOnly = true)
    private String generateValidJoinCode() {
        String joinCode = generateJoinCode();
        while (lobbyRepository.findLobbyFromJoinCode(joinCode).isPresent()) {joinCode = generateJoinCode();}
        return joinCode;
    }
}
