package mk.ukim.finki.taskplanning.web;

import mk.ukim.finki.taskplanning.model.Status;
import mk.ukim.finki.taskplanning.model.Task;
import mk.ukim.finki.taskplanning.model.User;
import mk.ukim.finki.taskplanning.model.exceptions.TimeNotAllowedException;
import mk.ukim.finki.taskplanning.service.TaskService;
import mk.ukim.finki.taskplanning.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;


@Controller
@RequestMapping(value = {"/tasks", "/"})
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping
    public String getTasks(@RequestParam(required = false) String error,Model model) {
        if(error != null && !error.isEmpty()){
            model.addAttribute("hasError",true);
            model.addAttribute("error",error);
        }
        model.addAttribute("tasks", taskService.findAll());
        return "tasks";
    }

    @GetMapping("/add-task")
    public String addTask(@RequestParam(required = false) String error,  Model model) {
        if(error != null && !error.isEmpty()){
            model.addAttribute("hasError",true);
            model.addAttribute("error",error);
        }
        model.addAttribute("tasks", this.taskService.findAll());
        model.addAttribute("users", this.userService.findAll());
        model.addAttribute("statusList", Arrays.asList(Status.values()));

        return "form";
    }

    @GetMapping("/edit-task/{id}")
    public String editTask(@PathVariable Long id,Model model,@RequestParam(required = false) String error){
        if(error != null && !error.isEmpty()){
            model.addAttribute("hasError",true);
            model.addAttribute("error",error);
        }
        model.addAttribute("task",this.taskService.findById(id).get());
        model.addAttribute("possibleDependants", this.taskService.getOtherTasks(id));
        model.addAttribute("users", this.userService.findAll());
        model.addAttribute("statusList", Arrays.asList(Status.values()));
        return "form";
    }

    @PostMapping("/add-task")
    public String createTask(@RequestParam String title,
                             @RequestParam String description,
                             @RequestParam String status,
                             @RequestParam(required = false) List<Task> dependsOn,
                             @RequestParam Long userId,
                             @RequestParam String startTime,
                             @RequestParam(required = false) String endTime) {

        try{
            taskService.create(title, description, status, dependsOn, userId, LocalDateTime.parse(startTime), LocalDateTime.parse(endTime));
        }catch (TimeNotAllowedException timeNotAllowedException){
            return "redirect:/tasks/add-task?error="+timeNotAllowedException.getMessage();
        }
        return "redirect:/tasks";
    }

    @PostMapping("/edit-task/{id}")
    public String updateTask(@PathVariable Long id,
                             @RequestParam String title,
                             @RequestParam String description,
                             @RequestParam String status,
                             @RequestParam(required = false) List<Task> dependsOn,
                             @RequestParam Long userId,
                             @RequestParam String startTime,
                             @RequestParam(required = false)String endTime) {

       try{
           taskService.update(id, title, description, status, dependsOn, userId, LocalDateTime.parse(startTime), LocalDateTime.parse(endTime));
       }catch (TimeNotAllowedException timeNotAllowedException){
           return String.format("redirect:/tasks/edit-task/%d?error="+timeNotAllowedException.getMessage(),id);
       }
        return "redirect:/tasks";
    }

    @PostMapping("/{id}/delete")
    public String deleteTask(@PathVariable Long id) {
        taskService.delete(id);
        return "redirect:/tasks";
    }
}
