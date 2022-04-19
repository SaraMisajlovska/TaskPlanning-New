import axios from "../CustomAxios/Axios";

const GanttChartRepo = {
    fetchTasks: () => {
        return axios.get("/tasks")
    },
    fetchUsers: () => {
        return axios.get("/users")
    },
    fetchStatuses: () => {
        return axios.get("/tasks/status")
    },
    createTask: (title, description, status, userId, startDate, endDate) => {
        return axios.post("/tasks/add-task",
            {
                "title": title,
                "description": description,
                "status": status,
                "userId": userId,
                "startTime": startDate,
                "endTime": endDate
            })
    }
}

export default GanttChartRepo