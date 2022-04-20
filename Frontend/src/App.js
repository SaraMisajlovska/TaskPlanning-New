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
            statuses: [],
            filter: null,
            selectedUser: ''
        };
    }

    componentDidMount() {
        this.loadTasks();
        this.loadUsers();
        this.loadStatuses();
        gantt.config.columns = [
            {name: "title", label: "Task title", align: "center", width: 150, tree: true},
            {name: "start_date", label: "Start time", width: 100, align: "center"},
            {name: "duration", label: "Duration", width: 50, align: "center"},
            {
                name: "username", label: "Users", align: "center", width: 80, template: (obj) => {
                    //console.log(obj.users)
                    return obj.users;
                }
            },
            {name: "add", label: "", width: 44}
        ];
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.tasks.length !== this.state.tasks.length){
            this.forceUpdate();           
            gantt.parse({
                data: this.state.tasks
            });
            gantt.clearAll();
        }
        
        gantt.refreshData();
        gantt.config.lightbox.sections = [
            {name: "title", height: 70, map_to: "title", type: "textarea", focus: true},
            {name: "description", height: 70, map_to: "description", type: "textarea"},
            {
                name: "users",
                height: 22,
                map_to: "username",
                type: "select",
                options: ['unassigned', ...this.state.users]
            },
            {name: "status", height: 22, map_to: "status", type: "select", options: this.state.statuses},
            {name: "time", height: 72, map_to: "auto", type: "duration"},
            {name: "duration", height: 72, map_to: "duration", type: "date"},
            // {name: "start_time", height: 72, map_to: "start-time", type: "time"}
        ]

        gantt.locale.labels.section_users = "Users";
        gantt.locale.labels.section_title = "Title";
        gantt.locale.labels.section_status = "Status";
        // gantt.locale.labels.section_start_end_date = "Start and end date"      
         

        gantt.templates.leftside_text = function (start, end, task) {
            return "<b>Status: </b>" + task.status;
        };

        gantt.templates.task_text = (start, end, task) => {
            return "<b>Description:</b>" + task.description;
        }
    }

    loadTasks = (filter, selectedUser) => {
        GanttChartRepo.fetchTasks(filter, selectedUser)
            .then((data) => {
                const tasksArray = data.data;

                // eslint-disable-next-line no-sequences
                const updatedTasks = tasksArray.map((task) => ({
                    id: task.id.toString(),
                    title: task.title.toString(),
                    start_date: task.startTime.toString().substr(0, 10),
                    duration: parseInt(task.duration.toString()),
                    progress: 0.0,
                    description: task.description.toString(),
                    users: task.user == null ? "" : task.user.name,
                    user: task.user,
                    status: task.status
                }));

                this.setState({
                    tasks: updatedTasks
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

        this.addMessage(message);

        const startTime = new Date(item.start_date).toISOString();
        const endTime = new Date(item.end_date).toISOString();
        // console.log(item);
        // console.log(item.user);
        // console.log(item.username)
        switch (action) {
            case "create":
                if (item.username === 'undefined') {
                    this.createTask(item.title, item.description, item.status, null, startTime, endTime);
                    break;
                } else {
                    GanttChartRepo.findUserById(item.username).then((response) => {
                        this.createTask(item.title, item.description, item.status, response.data, startTime, endTime);
                    });
                    break;
                }

            case "update":           
                if(item.user!='' && item.username!='undefined'){
                    GanttChartRepo.findUserById(item.user.id).then((data) => {
                        this.updateTask(item.id, item.title, item.description, item.status, data.data, startTime, endTime);
                    });
                    break;
                }

                if(item.user==="" && item.username){
                    GanttChartRepo.findUserById(item.username).then((data) => {
                        this.updateTask(item.id, item.title, item.description, item.status, data.data, startTime, endTime);
                    });
                    break;
                }

                if(item.user==="" && item.username===undefined){
                    this.updateTask(item.id, item.title, item.description, item.status, null, startTime, endTime);
                    break;
                }

                if(item.user && item.username==='undefined'){                    
                    this.updateTask(item.id, item.title, item.description, item.status, null, startTime, endTime);
                    break;
                }
                break;

            case "delete":
                this.deleteTask(item.id)
                break;

            default:
                break;
        }
    };

    createTask = (title, description, status, user, startTime, endTime) => {
        GanttChartRepo.createTask(title, description, status, user, startTime, endTime)
            .then(() => {
                this.loadTasks();
            });
    }

    updateTask = (id, title, description, status, user, startTime, endTime) => {
        GanttChartRepo.updateTask(id, title, description, status, user, startTime, endTime)
            .then(() => {
                this.loadTasks();
            });
    }

    deleteTask = (id) => {
        GanttChartRepo.deleteTask(id)
            .then(() => {
                this.loadTasks();
            });
    }

    handleZoomChange = (zoom) => {
        this.setState({
            currentZoom: zoom,
        });
    };

    filterTasks = () => {
        this.loadTasks(this.state.filter, this.state.selectedUser);
        this.forceUpdate();
    }

    render() {
        const {currentZoom, messages, tasks, users, statuses} = this.state;
        const data = {
            data: this.state.tasks
        };

        const usersMapped = [...this.state.users];

        const userOptions = usersMapped.map(user => <option key={user.key} value={user.key}>{user.label}</option>)

        return (
            <div style={{height: "100%"}}>
                <div className="zoom-bar">
                    <Toolbar zoom={currentZoom} onZoomChange={this.handleZoomChange}/>
                </div>
                <div>
                    <label>Select filter</label>
                    <select
                        onChange={(e) => this.setState({filter: e.target.value})}
                    >
                        <option/>
                        <option value="non-dependent">Non-dependent tasks</option>
                        <option value="completed-dependent-tasks">Completed dependent tasks</option>
                        <option value="non-assigned">Non-assigned tasks</option>
                    </select>
                    <div>
                        <label>Select user</label>
                        <select
                            onChange={(e) => this.setState({selectedUser: e.target.value})}
                        >
                            <option/>
                            {userOptions}
                        </select>
                    </div>
                    <button onClick={this.filterTasks}>Filter</button>
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
