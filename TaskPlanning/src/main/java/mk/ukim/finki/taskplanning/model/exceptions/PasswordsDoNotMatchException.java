package mk.ukim.finki.taskplanning.model.exceptions;

public class PasswordsDoNotMatchException extends RuntimeException {
    public PasswordsDoNotMatchException() {
        super("Passwords Do Not Match Exception");
    }
}
