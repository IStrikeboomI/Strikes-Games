package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.dto.LobbyDto;
import Strikeboom.StrikesGames.service.LobbyService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
@AllArgsConstructor
public class LobbyController {
    private final LobbyService lobbyService;

    @GetMapping("/join/{joinCode}")
    public ModelAndView joinGame(@PathVariable String joinCode, HttpSession session) {
       ModelAndView modelAndView = new ModelAndView();
       if (!lobbyService.doesLobbyExist(joinCode)) {
           modelAndView.setViewName("/lobby-not-found.html");
           modelAndView.setStatus(HttpStatus.NOT_FOUND);
           return modelAndView;
       }
       modelAndView.setViewName("/join.html");
       LobbyDto lobby = lobbyService.getLobbyFromJoinCode(joinCode);
       modelAndView.addObject("name",lobby.getName());
       modelAndView.setStatus(HttpStatus.OK);
       return modelAndView;
    }
}
