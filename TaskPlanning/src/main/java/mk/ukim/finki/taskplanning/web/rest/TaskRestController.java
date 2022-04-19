package mk.ukim.finki.taskplanning.web.rest;

import mk.ukim.finki.taskplanning.model.Status;
import mk.ukim.finki.taskplanning.model.Task;
import mk.ukim.finki.taskplanning.model.dto.TaskDTO;
import mk.ukim.finki.taskplanning.service.TaskService;
import mk.ukim.finki.taskplanning.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = {"/api/tasks", "/api"})
@CrossOrigin(origins = "http://localhost:3000")
public class TaskRestController {

    private final TaskService taskService;

    public TaskRestController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping()
    public List<Task> findAll(@RequestParam(required = false) String filter,
                              @RequestParam(required = false) Long userId) {
        if (filter != null) {
            switch (filter) {
                case "non-dependent":
                    return this.taskService.tasksWithoutDependencies();
                case "completed-dependent-tasks":
                    return this.taskService.completedDependentTasks();
                case "non-assigned":
                    return this.taskService.withoutAssignees();
            }
        }
        if (userId != null) {
            return this.taskService.findAllByUser(userId);
        }
        return this.taskService.findAll();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Task> findById(@PathVariable Long id) {
        return this.taskService.findById(id)
                .map(task -> ResponseEntity.ok().body(task))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/status")
    public List<Status> getStatuses() {
        return List.of(Status.values());
    }


    @PostMapping("/add-task")
    public ResponseEntity<Task> save(@RequestBody TaskDTO taskDTO) {
        return this.taskService.create(taskDTO.getTitle(),
                        taskDTO.getDescription(),
                        taskDTO.getStatus() == null ? Status.todo.toString() : taskDTO.getStatus().toString(),
                        taskDTO.getDependsOn(),
                        taskDTO.getUser() == null ? null : taskDTO.getUser().getId(),
                        taskDTO.getStartTime(),
                        taskDTO.getEndTime())
                .map(
                        task -> ResponseEntity.ok().body(task))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/edit-task/{id}")
    public ResponseEntity<Task> save(@PathVariable Long id,
                                     @RequestBody TaskDTO taskDTO) {

        return this.taskService.update(id, taskDTO.getTitle(), taskDTO.getDescription(),
                        taskDTO.getStatus() == null ? Status.todo.toString() : taskDTO.getStatus().toString(),
                        taskDTO.getDependsOn(), taskDTO.getUser() == null ? null : taskDTO.getUser().getId(),
                        taskDTO.getStartTime(), taskDTO.getEndTime()).map(
                        task -> ResponseEntity.ok().body(task)
                )
                .orElseGet(() -> ResponseEntity.badRequest().build());


    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        this.taskService.delete(id);
        if (this.taskService.findById(id).isEmpty()) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().build();
    }

}