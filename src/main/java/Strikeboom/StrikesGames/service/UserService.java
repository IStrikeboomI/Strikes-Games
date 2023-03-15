package Strikeboom.StrikesGames.service;

import Strikeboom.StrikesGames.dto.UserDto;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.exception.UserNotFoundException;
import Strikeboom.StrikesGames.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class UserService {
    private final UserRepository userRepository;
    public static UserDto mapToDto(User user) {
        return UserDto.builder()
                .name(user.getName())
                .isCreator(user.isCreator())
                .separationId(user.getSeparationId())
                .build();
    }
    @Transactional(readOnly = true)
    public User getUserInLobby(UUID id) {
        return userRepository.findByUUID(id).orElseThrow(() -> new UserNotFoundException(String.format("User with ID: %s not found",id)));
    }
}
