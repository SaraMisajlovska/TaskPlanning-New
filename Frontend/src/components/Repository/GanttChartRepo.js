import axios from "../CustomAxios/Axios";

const GanttChartRepo = {
    fetchTasks: (taskFilter) => {
        return axios.get("/tasks",{
            params:{
                filter : taskFilter
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
    updateTask: (id,title, description, status, user, startDate, endDate) =>{
        return axios.put(`/tasks/edit-task/${id}`,
        {
            "id":id,
            "title": title,
            "description": description,
            "status": status,
            "user": user,
            "startTime": startDate,
            "endTime": endDate
        })
    },
    deleteTask: (id)=>{
        return axios.delete(`${id}/delete`);
    },
    findUserById: (id)=>{
        return axios.get(`/users/${id}`);
    }
}

export default GanttChartRepo