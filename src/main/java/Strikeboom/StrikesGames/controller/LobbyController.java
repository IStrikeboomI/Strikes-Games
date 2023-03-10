package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import Strikeboom.StrikesGames.service.LobbyService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@AllArgsConstructor
public class LobbyController {
    private final LobbyRepository lobbyRepository;
    private final LobbyService lobbyService;

    @GetMapping("/join/{joinCode}")
    public ModelAndView joinGame(@PathVariable String joinCode, HttpSession session) {
       ModelAndView modelAndView = new ModelAndView();
       if (!lobbyService.doesLobbyExist(joinCode)) {
           modelAndView.setViewName("/lobby-not-found.html");
           modelAndView.setStatus(HttpStatus.NOT_FOUND);
           return modelAndView;
       }
       Lobby lobby = lobbyRepository.findLobbyFromJoinCode(joinCode).get();
       if (lobby.getUsers().size() < lobby.getMaxPlayers() || lobbyService.isUserInLobby(session,lobby)) {
           modelAndView.setViewName("/join.html");
       } else {
           modelAndView.setViewName("/lobby-is-full.html");
       }
       modelAndView.addObject("name",lobby.getName());
       modelAndView.setStatus(HttpStatus.OK);
       return modelAndView;
    }

    @MessageMapping("/change-name")
    @SendTo("/broker")
    public String messages(@RequestBody String name, SimpMessageHeaderAccessor accessor) {
        return "hello!!!!! ";
    }
}
