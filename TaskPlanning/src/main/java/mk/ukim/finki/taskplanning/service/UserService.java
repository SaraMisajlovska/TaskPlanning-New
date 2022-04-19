package mk.ukim.finki.taskplanning.service;

import mk.ukim.finki.taskplanning.model.Task;
import mk.ukim.finki.taskplanning.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface UserService {

    //String name, String surname, String username, String password, List<Task> tasks
    User register(String name, String surname, String username, String password, String repeatPassword, List<Task> tasks );

    List<User> findAll();

    Optional<User> findUserById(Long id);
}
