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
            links: [],
            filter: null,
            selectedUser: '',
            counter: 0
        };
    }

    componentDidMount() {
        this.loadTasks();
        this.loadUsers();
        this.loadStatuses();
        this.handleAddLinkEvent();
        this.handleDeleteLinkEvent();
        gantt.config.columns = [
            {name: "title", label: "Task title", align: "center", width: 150, tree: true},
            {name: "start_date", label: "Start time", width: 100, align: "center"},
            {name: "duration", label: "Duration", width: 50, align: "center"},
            {
                name: "username", label: "Users", align: "center", width: 80, template: (obj) => {
                    return obj.users;
                }
            },
            {name: "add", label: "", width: 44}
        ];
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.tasks.length !== this.state.tasks.length) {
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


                let tempLinks = [];
                let currentId = this.state.counter;
                // eslint-disable-next-line no-sequences
                const updatedTasks = tasksArray.map((task) => ({
                    id: task.id.toString(),
                    title: task.title.toString(),
                    start_date: task.startTime.toString().substr(0, 10),
                    duration: parseInt(task.duration.toString()),
                    progress: task.progress,
                    description: task.description.toString(),
                    users: task.user == null ? "" : task.user.name,
                    user: task.user,
                    status: task.status,
                    depends_on: task.dependsOn,

                }));

                ////console.log(updatedTasks[1].start_date)
                updatedTasks.forEach((mapped) => {
                    if (mapped.depends_on.length > 0) {
                        mapped.depends_on.forEach((taskWhichMappedDependsOn) => {
                            gantt.addLink({
                                id: currentId,
                                source: taskWhichMappedDependsOn.id,
                                target: mapped.id,
                                type: gantt.config.links.finish_to_start
                            })

                            tempLinks.push(gantt.getLink(currentId));
                            currentId++;
                        })
                    }
                });


                this.setState({
                    tasks: updatedTasks,
                    links: tempLinks,
                    counter: currentId
                });

                gantt.parse({
                    data: updatedTasks,
                    links: tempLinks
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
    handleAddLinkEvent = () => {
        gantt.attachEvent("onAfterLinkAdd", (id, item) => {
            this.saveLinkFromEvent(item.source, item.target);
        });

    }
    saveLinkFromEvent = (sourceId, targetId) => {
        GanttChartRepo.saveDependency(sourceId, targetId)
            .then((response) => {
            });
    }
    handleDeleteLinkEvent = () => {
        gantt.attachEvent("onAfterLinkDelete", (id,item) =>{
            console.log(item);
            this.deleteLinkFromEvent(item.source, item.target);
        })
    }
    deleteLinkFromEvent =  (sourceId, targetId) =>{
        GanttChartRepo.deleteDependency(sourceId, targetId)
            .then(resp => {
                this.loadTasks();
            });
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

            message += `(source: ${item.source}, target: ${item.target})`;
        }

        this.addMessage(message);

        const startingTimeToSet = new Date(item.start_date)
        const endingTimeToset = new Date(item.end_date);

        startingTimeToSet.setUTCHours(parseInt(item.start_date.toString().substr(11,13)),parseInt(item.start_date.toString().substr(3)))
        startingTimeToSet.setUTCMonth(parseInt(item.start_date.toString().substr(6,7))-1,parseInt(item.start_date.toString().substr(8,10)))

        endingTimeToset.setUTCHours(parseInt(item.end_date.toString().substr(11,13)),parseInt(item.end_date.toString().substr(3)))
        endingTimeToset.setUTCMonth(parseInt(item.end_date.toString().substr(6,7))-1,parseInt(item.end_date.toString().substr(8,10)))

        const startTime=startingTimeToSet.toISOString();
        const endTime=endingTimeToset.toISOString();

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
                    GanttChartRepo.findUserById(item.user.id).then((response) => {
                        this.updateTask(item.id, item.title, item.description, item.status, response.data, startTime, endTime,item.progress);
                    });
                    break;
                }

                if(item.user==="" && item.username){
                    if(item.username==='undefined'){
                        this.updateTask(item.id, item.title, item.description, item.status, null, startTime, endTime,item.progress);
                        break;
                    }
                    GanttChartRepo.findUserById(item.username).then((response) => {
                        this.updateTask(item.id, item.title, item.description, item.status, response.data, startTime, endTime,item.progress);
                    });
                    break;
                }

                if(item.user==="" && item.username===undefined){
                    this.updateTask(item.id, item.title, item.description, item.status, null, startTime, endTime,item.progress);
                    break;
                }

                if(item.user && item.username==='undefined'){
                    this.updateTask(item.id, item.title, item.description, item.status, null, startTime, endTime,item.progress);
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

    updateTask = (id, title, description, status, user, startTime, endTime, progress) => {
        GanttChartRepo.updateTask(id, title, description, status, user, startTime, endTime, progress)
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

    handleFilterChange = (e) =>{
        this.setState({
            filter: e.target.value,
        });
    }
    handleUserFilterChange =(e) =>{
        this.setState({
            selectedUser: e.target.value
        });
    }
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
                    <Toolbar zoom={currentZoom}
                             onZoomChange={this.handleZoomChange}
                             onFilterChange={this.handleFilterChange}
                             onUserFilterChange={this.handleUserFilterChange}
                             userOptions={userOptions}
                             onFilterClick={this.filterTasks}
                    />
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
