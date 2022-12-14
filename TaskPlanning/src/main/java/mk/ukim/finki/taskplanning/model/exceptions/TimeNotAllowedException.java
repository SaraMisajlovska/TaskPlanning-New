package mk.ukim.finki.taskplanning.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TimeNotAllowedException extends RuntimeException {
    public TimeNotAllowedException() {
        super("Start time must be before end time");
    }
}
