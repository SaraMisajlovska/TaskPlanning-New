package mk.ukim.finki.taskplanning.model.exceptions;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UserDoesNotExistException extends RuntimeException {
    public UserDoesNotExistException(Long id) {
        super(String.format("User with id %d does not exist!", id));
    }
}
