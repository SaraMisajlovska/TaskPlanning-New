package mk.ukim.finki.taskplanning.model;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "task_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String username;
    private String password;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Task> tasks;

    public User(){

    }

    public User(String name, String surname, String username, String password, List<Task> tasks) {
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.password = password;
        this.tasks = tasks;
    }
}
