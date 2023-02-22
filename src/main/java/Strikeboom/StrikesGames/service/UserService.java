package Strikeboom.StrikesGames.service;

import Strikeboom.StrikesGames.dto.UserDto;
import Strikeboom.StrikesGames.entity.User;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class UserService {
    public static UserDto mapToDto(User user) {
        return UserDto.builder()
                .name(user.getName())
                .isCreator(user.isCreator())
                .build();
    }
}
