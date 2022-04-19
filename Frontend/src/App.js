import React, {Component} from "react";
import Gantt from "./components/Gantt";
import Toolbar from "./components/Toolbar";
import MessageArea from "./components/MessageArea";
import "./App.css";
import {gantt} from "dhtmlx-gantt";
import GanttChartRepo from "./components/Repository/GanttChartRepo";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentZoom: "Days",
            messages: [],
            tasks: [],
            users: [],
            statuses: []
        };
    }

    componentDidMount() {
        this.loadTasks();
        this.loadUsers();
        this.loadStatuses();

        gantt.config.columns = [
            {name: "title", label: "Task title", width: "*", tree: true},
            {name: "start_date", label: "Start time", align: "center"},
            {name: "duration", label: "Duration (days)", align: "center"},
            {name: "add", label: "", width: 44},
            {
                name: "username", label: "Users", template: (obj) => {
                    console.log(obj)
                    return obj.username;
                }
            }
        ];
    }

    componentDidUpdate() {
        gantt.config.lightbox.sections = [
            {name: "title", height: 70, map_to: "title", type: "textarea", focus: true},
            {name: "description", height: 70, map_to: "description", type: "textarea"},
            {name: "users", height: 22, map_to: "username", type: "select", options: this.state.users},
            {name: "status", height: 22, map_to: "status", type: "select", options: this.state.statuses},
            {name: "time", height: 72, map_to: "auto", type: "duration"},
            {name: "duration", height: 72, map_to: "duration", type: "date"},
            // {name: "start_time", height: 72, map_to: "start-time", type: "time"}
        ]

        gantt.locale.labels.section_users = "Users";
        gantt.locale.labels.section_title = "Title";
        gantt.locale.labels.section_status = "Status";
        // gantt.locale.labels.section_start_end_date = "Start and end date";

    }


    loadTasks = () => {
        GanttChartRepo.fetchTasks()
            .then((data) => {
                var tasksArray = data.data;
                console.log(tasksArray);

                // eslint-disable-next-line no-sequences
                const updatedTasks = tasksArray.map((task) => ({
                    id: task.id.toString(),
                    title: task.title.toString(),
                    start_date: task.startTime.toString().substr(0, 10),
                    duration: parseInt(task.duration.toString()),
                    progress: parseFloat(0.2),
                    username: task.user.username
                }));

                this.setState({
                    tasks: updatedTasks,
                });

                gantt.parse({
                    data: updatedTasks,
                });
            })
    }

    loadUsers = () => {
        GanttChartRepo.fetchUsers()
            .then((data) => {
                const users = data.data.map((user) => ({
                    key: user.id.toString(),
                    label: user.username
                }))

                this.setState({
                    users: users
                })
            })
    }

    loadStatuses = () => {
        GanttChartRepo.fetchStatuses()
            .then((response) => {
                const statuses = response.data.map((status) => ({
                    key: status.toString(),
                    label: status.toString()
                }))

                this.setState({
                    statuses: statuses
                })
            })
    }

    addMessage(message) {
        const maxLogLength = 5;
        const newMessage = {message};
        const messages = [newMessage, ...this.state.messages];

        if (messages.length > maxLogLength) {
            messages.length = maxLogLength;
        }
        this.setState({messages});
    }

    logDataUpdate = (type, action, item, id) => {
        let text = item && item.title ? ` (${item.title})` : "";
        let message = `${type} ${action}: ${id} ${text}`;
        if (type === "link" && action !== "delete") {
            console.log(item.target)
            message += ` ( source: ${item.source}, target: ${item.target} )`;
        }
        console.log(item);
        this.addMessage(message);

        const startTime = new Date(item.start_date).toISOString();
        const endTime = new Date(item.end_date).toISOString();
        console.log(startTime);
        GanttChartRepo.createTask(item.title, item.description, item.status, item.id, startTime, endTime)
            .then(r => {
                this.loadTasks();
            });
    };

    handleZoomChange = (zoom) => {
        this.setState({
            currentZoom: zoom,
        });
    };

    render() {
        const {currentZoom, messages, tasks, users, statuses} = this.state;
        const data = {
            data: tasks,
            links: [{id: 1, source: 1, target: 4, type: "0"}],
        };

        return (
            <div style={{height: "100%"}}>
                <div className="zoom-bar">
                    <Toolbar zoom={currentZoom} onZoomChange={this.handleZoomChange}/>
                </div>
                <div id="gant-here" className="gantt-container">
                    <Gantt
                        tasks={data}
                        zoom={currentZoom}
                        onDataUpdated={this.logDataUpdate}
                    />
                </div>
                <MessageArea messages={messages}/>
            </div>
        );
    }
}

export default App;
