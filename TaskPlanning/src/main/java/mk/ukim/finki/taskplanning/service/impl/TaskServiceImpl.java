package mk.ukim.finki.taskplanning.service.impl;

import mk.ukim.finki.taskplanning.model.Status;
import mk.ukim.finki.taskplanning.model.Task;
import mk.ukim.finki.taskplanning.model.User;
import mk.ukim.finki.taskplanning.model.exceptions.TimeNotAllowedException;
import mk.ukim.finki.taskplanning.repository.TaskRepository;
import mk.ukim.finki.taskplanning.repository.UserRepository;
import mk.ukim.finki.taskplanning.service.TaskService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public Optional<Task> findById(Long id){
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
    public Task create(String title, String description, String status, List<Task> dependsOn, Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException();
        }
        User user = userRepository.findById(userId).get();
        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new TimeNotAllowedException();
        }
        Task t = new Task(title, description, Status.valueOf(status),dependsOn, user, startTime, endTime);
        taskRepository.save(t);
        return t;
    }

    @Override
    @Transactional
    public Optional<Task> update(Long id, String title, String description, String status, List<Task> dependsOn, Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        if (title.isEmpty() || status.isEmpty() || startTime == null || endTime == null) {
            throw new IllegalArgumentException();
        }
        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new TimeNotAllowedException();
        }
      User user = userRepository.findById(userId).get();
        Task task = taskRepository.getById(id);
        task.setTitle(title);
        task.setStatus(Status.valueOf(status));
        task.setDescription(description);
        task.setDependsOn(dependsOn);
        task.setStartTime(startTime);
        task.setEndTime(endTime);

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
    public void delete(Long id) {
            taskRepository.deleteById(id);
    }
}
