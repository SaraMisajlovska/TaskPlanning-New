package mk.ukim.finki.taskplanning.model.dto;

import lombok.Data;
import mk.ukim.finki.taskplanning.model.Status;
import mk.ukim.finki.taskplanning.model.Task;
import mk.ukim.finki.taskplanning.model.User;

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

    private Double progress;

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
        this.progress=0.0;
    }

    public TaskDTO(Long id, String title, String description, Status status, List<Task> dependsOn, User user, LocalDateTime startTime, LocalDateTime endTime,Double progress) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.dependsOn = dependsOn;
        this.user = user;
        this.startTime = startTime;
        this.endTime = endTime;
        this.progress=progress;
    }

}
