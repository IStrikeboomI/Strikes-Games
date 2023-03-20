package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import Strikeboom.StrikesGames.repository.UserRepository;
import Strikeboom.StrikesGames.service.LobbyService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.ModelAndView;

import java.util.UUID;

@Controller
@AllArgsConstructor
public class LobbyController {

    private final LobbyRepository lobbyRepository;
    private final LobbyService lobbyService;
    private final UserRepository userRepository;
    @GetMapping("/join/{joinCode}")
    public ModelAndView joinGame(@PathVariable String joinCode,@CookieValue(value = "userId",required = false) UUID userId) {
       ModelAndView modelAndView = new ModelAndView();
       if (!lobbyService.doesLobbyExist(joinCode)) {
           modelAndView.setViewName("/lobby-not-found.html");
           modelAndView.setStatus(HttpStatus.NOT_FOUND);
           return modelAndView;
       }
       Lobby lobby = lobbyRepository.findLobbyFromJoinCode(joinCode).get();
       User user = userRepository.findById(userId).orElse(null);
       if (lobby.getUsers().size() < lobby.getMaxPlayers() || lobbyService.isUserInLobby(user,lobby)) {
           modelAndView.setViewName("/join.html");
       } else {
           modelAndView.setViewName("/lobby-is-full.html");
       }
       modelAndView.addObject("name",lobby.getName());
       modelAndView.setStatus(HttpStatus.OK);
       return modelAndView;
    }
}
