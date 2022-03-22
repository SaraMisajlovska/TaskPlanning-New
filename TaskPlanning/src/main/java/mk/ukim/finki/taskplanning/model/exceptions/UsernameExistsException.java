package mk.ukim.finki.taskplanning.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class UsernameExistsException extends RuntimeException {
    public UsernameExistsException(String username) {
        super(String.format("User with username: %s already exists", username));
    }
}
