package mk.ukim.finki.taskplanning.service;

import mk.ukim.finki.taskplanning.model.Task;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface TaskService {

    Optional<Task> findById(Long id);

    List<Task> findAll();

    List<Task> findAllByUser(Long userId);

    Optional<Task> findByTitle(String title);

    Optional<Task> create(String title, String description, String status, List<Task> dependsOn, Long userId, LocalDateTime startTime, LocalDateTime endTime);

    void delete(Long id);

    Optional<Task> update(Long id, String title, String description, String status, List<Task> dependsOn, Long userId, LocalDateTime startTime, LocalDateTime endTime,Double progress);

    List<Task> getOtherTasks(Long id);

    List<Task> withoutStartTime();

    List<Task> withoutAssignees();

    Map<Task, String> findAllByUserAndEstTimes(Long userId);

    Long findEstTimeInHours(Task task);

    String convertToReadableEstTime(Long hours);

    List<Task> tasksWithoutDependencies();

    List<Task> completedDependentTasks();

}
