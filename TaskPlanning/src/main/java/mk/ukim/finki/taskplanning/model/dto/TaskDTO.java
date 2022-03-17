package mk.ukim.finki.taskplanning.model.dto;

import lombok.Data;
import mk.ukim.finki.taskplanning.model.Status;
import mk.ukim.finki.taskplanning.model.Task;
import mk.ukim.finki.taskplanning.model.User;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskDTO {
   private Long id;
    private String title;
    private String description;

    private Status status;

    private List<Task> dependsOn;

    private User user;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public TaskDTO() {
    }

    public TaskDTO(String title, String description, Status status, List<Task> dependsOn, User user, LocalDateTime startTime, LocalDateTime endTime) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.dependsOn = dependsOn;
        this.user = user;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public TaskDTO(Long id, String title, String description, Status status, List<Task> dependsOn, User user, LocalDateTime startTime, LocalDateTime endTime) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.dependsOn = dependsOn;
        this.user = user;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
