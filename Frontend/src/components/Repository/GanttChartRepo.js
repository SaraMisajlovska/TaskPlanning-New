import axios from "../CustomAxios/Axios";

const GanttChartRepo={
    fetchTasks: ()=>{
        return axios.get("/tasks")
    },
    fetchUsers:()=>{
        return axios.get("/users")
    }
}

export default GanttChartRepo