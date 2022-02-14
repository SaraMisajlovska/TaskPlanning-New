package mk.ukim.finki.taskplanning.service.impl;


import mk.ukim.finki.taskplanning.model.Task;
import mk.ukim.finki.taskplanning.model.User;
import mk.ukim.finki.taskplanning.model.exceptions.InvalidUsernameOrPasswordException;
import mk.ukim.finki.taskplanning.model.exceptions.PasswordsDoNotMatchException;
import mk.ukim.finki.taskplanning.model.exceptions.UsernameExistsException;
import mk.ukim.finki.taskplanning.repository.UserRepository;
import mk.ukim.finki.taskplanning.service.UserService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User register(String name, String surname, String username, String password, String repeatPassword, List<Task> tasks) {
        if (username == null || username.isEmpty() || password == null || password.isEmpty())
        throw new InvalidUsernameOrPasswordException();
        if (!password.equals(repeatPassword))
            throw new PasswordsDoNotMatchException();
        if (this.userRepository.findByUsername(username).isPresent())
            throw new UsernameExistsException(username);
        User user = new User(name, surname, username, password, tasks);
        return userRepository.save(user);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }
}
