package mk.ukim.finki.taskplanning.service.impl;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import mk.ukim.finki.taskplanning.model.Status;
import mk.ukim.finki.taskplanning.model.Task;
import mk.ukim.finki.taskplanning.model.User;
import mk.ukim.finki.taskplanning.model.exceptions.TimeNotAllowedException;
import mk.ukim.finki.taskplanning.repository.TaskRepository;
import mk.ukim.finki.taskplanning.repository.UserRepository;
import mk.ukim.finki.taskplanning.service.TaskService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    @Override
    public Optional<Task> findByTitle(String title) {
        return taskRepository.findByTitle(title);
    }

    @Transactional
    @Override
    public Optional<Task> create(String title, String description, String status, List<Task> dependsOn, Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException();
        }
        User user = userId == null ? null : userRepository.findById(userId).get();

        if(startTime !=null && endTime!=null){
            if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
                throw new TimeNotAllowedException();
            }
        }
        Task t = new Task(title, description, Status.valueOf(status), dependsOn, user, startTime, endTime);
        taskRepository.save(t);
        return Optional.of(t);
    }

    @Override
    @Transactional
    @JsonIgnoreProperties
    public Optional<Task> update(Long id, String title, String description, String status, List<Task> dependsOn, Long userId, LocalDateTime startTime, LocalDateTime endTime) {
//        if (title.isEmpty() || status.isEmpty() || startTime == null || endTime == null) {
//            throw new IllegalArgumentException();
//        }

        if(startTime !=null && endTime!=null){
            if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
                throw new TimeNotAllowedException();
            }
        }
        User user = userId == null ? null : userRepository.findById(userId).get();
        Task task = taskRepository.getById(id);
        task.setTitle(title == null ? task.getTitle() : title);
        task.setStatus(status == null ? task.getStatus() : Status.valueOf(status) );
        task.setDescription(description == null ? task.getDescription() : description);
        task.setDependsOn(dependsOn == null ? task.getDependsOn() : dependsOn);
        task.setStartTime(startTime == null ? task.getStartTime() : startTime);
        task.setEndTime(endTime == null ? task.getEndTime() : endTime);

        task.setUser(user);

        return Optional.of(task);
    }

    @Override
    public List<Task> getOtherTasks(Long id) {
        return this.taskRepository.findAll()
                .stream()
                .filter(task -> !task.getId().equals(id))
                .collect(Collectors.toList());
    }

    @Override
    public Map<Task, String> findAllByUserAndEstTimes(Long userId) {

        Map<Long, Task> longTaskTreeMap = new TreeMap<>();
        Map<Task, String> tasksWithEstTimeInHours = new LinkedHashMap<>();
        User user = this.userRepository.findById(userId).get();

        this.taskRepository.findAllByUser(user)
                .forEach(task ->
                        longTaskTreeMap.put(findEstTimeInHours(task), task)
                );

        longTaskTreeMap.forEach((k, v) -> {
            tasksWithEstTimeInHours.put(v, convertToReadableEstTime(k));
        });
        return tasksWithEstTimeInHours;
    }

    @Override
    public Long findEstTimeInHours(Task task) {
        return Duration.between(task.getStartTime(), task.getEndTime()).toHours();
    }

    @Override
    public String convertToReadableEstTime(Long hours) {
        if (hours < 24) {
            return hours <= 1 ? String.format("%d hour", hours) : String.format("%d hours", hours);
        } else {
            long days = hours / 24;
            return days <= 1 ? String.format("%d day", days) : String.format("%d days", days);
        }
    }

    @Override
    public List<Task> tasksWithoutDependencies() {
        return this.taskRepository.findAll().stream().filter(task->task.getDependsOn().size()==0).collect(Collectors.toList());
    }

    @Override
    public List<Task> completedDependentTasks() {
        return this.taskRepository.findAll().stream().
                filter(task -> task.getStatus().toString().equals(Status.finished.toString())
                && !task.getDependsOn().isEmpty()).
                collect(Collectors.toList());
    }

    @Override
    public List<Task> withoutStartTime() {
        return taskRepository.findAll()
                .stream()
                .filter(task -> task.getStartTime() == null)
                .collect(Collectors.toList());
    }

    @Override
    public List<Task> withoutAssignees() {
        return taskRepository.findAll()
                .stream()
                .filter(task -> task.getUser() == null)
                .collect(Collectors.toList());
    }


    @Override
    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}
