package mk.ukim.finki.taskplanning.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TaskDoesNotExistException extends RuntimeException{
    public TaskDoesNotExistException(Long id) {
        super(String.format("Task with id %d does not exist!", id));
    }
}
