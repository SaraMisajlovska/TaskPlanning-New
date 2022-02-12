package mk.ukim.finki.taskplanning.model.exceptions;

public class InvalidUsernameOrPasswordException extends RuntimeException {
    public InvalidUsernameOrPasswordException() {
        super("Invalid Username Or Password Exception");
    }
}
