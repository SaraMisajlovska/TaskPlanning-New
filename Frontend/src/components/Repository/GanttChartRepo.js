import taskAxios from "../CustomAxios/taskAxios";
import userAxios from "../CustomAxios/userAxios";

const GanttChartRepo = {
    fetchTasks: (taskFilter, selectedUser) => {
        return taskAxios.get("/tasks",{
            params:{
                filter : taskFilter,
                userId : selectedUser
            }
        })
    },
    fetchUsers: () => {
        return userAxios.get("/users")
    },
    fetchStatuses: () => {
        return taskAxios.get("/tasks/status")
    },
    createTask: (title, description, status, user, startDate, endDate) => {
        return taskAxios.post("/tasks/add-task",
            {
                "title": title,
                "description": description,
                "status": status,
                "user": user,
                "startTime": startDate,
                "endTime": endDate
            })
    },
    updateTask: (id,title, description, status, user, startDate, endDate,progress) =>{
        return taskAxios.put(`/tasks/edit-task/${id}`,
        {
            "id":id,
            "title": title,
            "description": description,
            "status": status,
            "user": user,
            "startTime": startDate,
            "endTime": endDate,
            "progress" : progress
        })
    },
    deleteTask: (id)=>{
        return taskAxios.delete(`${id}/delete`);
    },
    findUserById: (id)=>{
        return userAxios.get(`/users/${id}`);
    },
    saveDependency: (sourceId, targetId) => {
        return taskAxios.put("/tasks/addDependency",
            {
            "sourceId": sourceId,
            "targetId": targetId
        }
        )
    },
    deleteDependency: (sourceId, targetId) => {
        return taskAxios.put("/tasks/deleteDependency",
            {
                "sourceId": sourceId,
                "targetId": targetId
            }
        )
    }
}

export default GanttChartRepo;