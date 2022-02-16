package mk.ukim.finki.taskplanning.model.exceptions;

public class TimeNotAllowedException extends RuntimeException {
    public TimeNotAllowedException() {
        super("Start time must be before end time");
    }
}
