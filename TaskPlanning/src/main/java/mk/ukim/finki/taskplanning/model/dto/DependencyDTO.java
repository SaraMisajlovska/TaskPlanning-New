package mk.ukim.finki.taskplanning.model.dto;

import lombok.Data;

@Data
public class DependencyDTO {
    Long sourceId;
    String targetId;
}
