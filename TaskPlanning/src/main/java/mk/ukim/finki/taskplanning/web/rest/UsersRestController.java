package mk.ukim.finki.taskplanning.web.rest;

import mk.ukim.finki.taskplanning.model.User;
import mk.ukim.finki.taskplanning.service.UserService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UsersRestController {
    private  final UserService userService;

    public UsersRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> listUsers(){
        return this.userService.findAll();
    }
}
