import React, {Component} from "react";
import Gantt from "./components/Gantt";
import Toolbar from "./components/Toolbar";
import MessageArea from "./components/MessageArea";
import "./App.css";
import axios from "axios";
import {useState} from "react/cjs/react.production.min";
import {useEffect} from "react/cjs/react.production.min";
import {gantt} from "dhtmlx-gantt";
import GanttChartRepo from "./components/Repository/GanttChartRepo";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentZoom: "Days",
            messages: [],
            tasks: [],
            users: []
        };
    }

    componentDidMount() {
        this.fetchTasks();
        this.loadUsers();

        gantt.config.columns = [
            {name: "title", label: "Task title", width: "*", tree: true},
            //{name: "description", label: "Task description", width: "*", tree: true},
            {name: "start-date", label: "Start time", align: "center"},
            {name: "duration", label: "Duration (days)", align: "center"},
            {name: "add", label: "", width: 44},
            {
                name: "user_id", label: "Users", template: (obj) => {
                    return obj.user_id;
                }
            }
        ];
    }

    componentDidUpdate() {
        gantt.config.lightbox.sections = [
            {name: "title", height: 70, map_to: "title", type: "textarea", focus: true},
            {name: "description", height: 70, map_to: "description", type: "textarea"},
            {name: "users", height: 22, map_to: "user_id", type: "select", options: this.state.users},
            {name: "time", height: 72, map_to: "start-date", type: "duration"},
            {name: "duration", height: 72, map_to: "duration", type: "duration"},
            // {name: "start_time", height: 72, map_to: "start-time", type: "time"}
        ]

        gantt.locale.labels.section_users = "Users";
        gantt.locale.labels.section_title = "Title";
        // gantt.locale.labels.section_start_end_date = "Start and end date";


    }



    fetchTasks = () => {
        GanttChartRepo.fetchTasks()
            .then((data) => {
                var tasksArray = data.data;

                const updatedTasks = tasksArray.map((task) => ({
                    id: task.id.toString(),
                    text: task.title.toString(),
                    start_date: task.startTime.toString().substr(0, 10),
                    duration: parseInt(task.duration.toString()),
                    progress: parseFloat(0.2),
                    user_id: task.user.username
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
        console.log("Added task is:" + item);
        this.addMessage(message);
    };

    handleZoomChange = (zoom) => {
        this.setState({
            currentZoom: zoom,
        });
    };

    render() {
        const {currentZoom, messages, tasks, users} = this.state;
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
