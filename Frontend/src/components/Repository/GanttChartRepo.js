import axios from "../CustomAxios/Axios";

const GanttChartRepo = {
    fetchTasks: (taskFilter, selectedUser) => {
        return axios.get("/tasks",{
            params:{
                filter : taskFilter,
                userId : selectedUser
            }
        })
    },
    fetchUsers: () => {
        return axios.get("/users")
    },
    fetchStatuses: () => {
        return axios.get("/tasks/status")
    },
    createTask: (title, description, status, user, startDate, endDate) => {
        return axios.post("/tasks/add-task",
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
        return axios.put(`/tasks/edit-task/${id}`,
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
        return axios.delete(`${id}/delete`);
    },
    findUserById: (id)=>{
        return axios.get(`/users/${id}`);
    },
    saveDependency: (sourceId, targetId) => {
        return axios.put("/tasks/addDependency",
            {
            "sourceId": sourceId,
            "targetId": targetId
        }
        )
    }
}

export default GanttChartRepo;