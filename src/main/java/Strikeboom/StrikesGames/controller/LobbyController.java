package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.dto.LobbyDto;
import Strikeboom.StrikesGames.service.LobbyService;
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
    private final LobbyService lobbyService;

    @GetMapping("/join/{joinCode}")
    public ModelAndView joinGame(@PathVariable String joinCode) {
       ModelAndView modelAndView = new ModelAndView();
       if (!lobbyService.doesLobbyExist(joinCode)) {
           modelAndView.setViewName("/lobby-not-found.html");
           modelAndView.setStatus(HttpStatus.NOT_FOUND);
           return modelAndView;
       }
       LobbyDto lobby = lobbyService.getLobbyFromJoinCode(joinCode);
       if (lobby.getUsers().size() < lobby.getMaxPlayers()) {
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
    public String messages(String joinCode, @RequestBody String name, SimpMessageHeaderAccessor accessor) {
        return "hello!!!!! " + accessor.getId();
    }
}
