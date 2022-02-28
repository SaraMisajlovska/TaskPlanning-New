package mk.ukim.finki.taskplanning.model;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;


@Data
@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;

    @Enumerated(value = EnumType.STRING)
    private Status status;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Task> dependsOn;

    @ManyToOne
    @Nullable
    private User user;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Nullable
    private LocalDateTime startTime;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Nullable
    private LocalDateTime endTime;

    public String getUserName(){
        if(this.user==null){
            return "No users for this task";
        }
        return this.user.getName() + " " + this.user.getSurname();
    }

    public Task() {
    }

    public Task( String title, String description, Status status, List<Task> dependsOn, User user, LocalDateTime startTime, LocalDateTime endTime) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.dependsOn = dependsOn;
        this.user = user;
        this.startTime = startTime;
        this.endTime = endTime;
    }

}
