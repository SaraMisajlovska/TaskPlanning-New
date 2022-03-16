package mk.ukim.finki.taskplanning.web.rest;

import mk.ukim.finki.taskplanning.model.Task;
import mk.ukim.finki.taskplanning.service.TaskService;
import mk.ukim.finki.taskplanning.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = {"/api/tasks", "/api"})
public class TaskControllerRest {

    private final TaskService taskService;
    private final UserService userService;


    public TaskControllerRest(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping
    public List<Task> findAll(){
        return this.taskService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> findById(@PathVariable Long id){
        return this.taskService.findById(id)
                .map(task -> ResponseEntity.ok().body(task))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PostMapping("/add-task")
    public ResponseEntity<Task> save(@RequestParam String title,
                                     @RequestParam String description,
                                     @RequestParam String status,
                                     @RequestParam(required = false) List<Task> dependsOn,
                                     @RequestParam(required = false) Long userId,
                                     @RequestParam(required = false) String startTime,
                                     @RequestParam(required = false) String endTime) {

        //wtf? zaso nejke map tuka vrska neam
    /*return this.taskService.create(title, description, status, dependsOn, userId, startTime.equals("") ? null: LocalDateTime.parse(startTime), endTime.equals("") ? null : LocalDateTime.parse(endTime))
            .map(manufacturer -> ResponseEntity.ok().body(manufacturer))
            .orElseGet(() -> ResponseEntity.badRequest().build());*/
        return null;
}

    @PutMapping("/edit-task/{id}")
    public ResponseEntity<Task> save(@PathVariable Long id,
                                     @RequestParam String title,
                                     @RequestParam String description,
                                     @RequestParam String status,
                                     @RequestParam(required = false) List<Task> dependsOn,
                                     @RequestParam(required = false)Long userId,
                                     @RequestParam(required = false) String startTime,
                                     @RequestParam(required = false) String endTime) {
        return this.taskService.update(id, title, description, status, dependsOn, userId, startTime.equals("") ? null: LocalDateTime.parse(startTime), endTime.equals("") ? null : LocalDateTime.parse(endTime))
                .map(task -> ResponseEntity.ok().body(task))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity deleteById(@PathVariable Long id) {
        this.taskService.delete(id);
        if(this.taskService.findById(id).isEmpty()) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().build();
    }
}