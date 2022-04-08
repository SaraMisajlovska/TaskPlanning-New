<<<<<<< HEAD
import React, { Component } from "react";
import Gantt from "./components/Gantt";
import Toolbar from "./components/Toolbar";
import MessageArea from "./components/MessageArea";
import "./App.css";
import axios from "axios";
import { useState } from "react/cjs/react.production.min";
import { useEffect } from "react/cjs/react.production.min";
import { gantt } from "dhtmlx-gantt";


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentZoom: "Days",
      messages: [],
      tasks: [],
      users : []
    };
  }



  componentDidMount(){
    this.loadUsers();

    gantt.config.columns = [
      {name:"text",       label:"Task title",  width:"*", tree:true },
      {name:"start_date", label:"Start time", align:"center" },
      {name:"duration",   label:"Duration (days)",   align:"center" },
      {name:"add",        label:"",           width:44 },
      {name:"user_id",        label:"Users", template: (obj)=>{
          return obj.user_id
        } }
    ];

    axios({
      method: "GET",
      url: "http://localhost:9091/api/tasks",
      headers: {
        "Access-Control-AllowOrigin": "*",
      },
    }).then((res) => {
      var tasksArray = res.data;


      const updatedTasks = tasksArray.map((task) => ({
        id: task.id.toString(),
        text: task.title.toString(),
        start_date: task.startTime.toString().substr(0, 10),
        duration: parseInt(task.duration.toString()),
        progress: parseFloat(0.2),
        user_id : task.user.username
      }));

      this.setState({
        tasks: updatedTasks,
      });

      gantt.parse({
        data: updatedTasks,
      });

    });


  }

  componentDidUpdate(){
    gantt.config.lightbox.sections = [
      { name: "title", height: 70, map_to: "text", type: "textarea", focus: true },
      { name: "description", height: 70, map_to: "text", type: "textarea" },
      { name: "users", height: 22, map_to: "user_id", type: "select", options: this.state.users },
      { name: "time", height: 72, map_to: "auto", type: "duration" },
      { name: "start_end_date", height: 72, map_to: "auto", type: "time" }
    ]

    gantt.locale.labels.section_users="Users";
    gantt.locale.labels.section_title="Title";
    gantt.locale.labels.section_start_end_date="Start and end date";
  }

  loadUsers=()=>{

    axios({
      method: "GET",
      url: "http://localhost:9091/api/users",
      headers: {
        "Access-Control-AllowOrigin": "*",
      }
    }).then(res=>{
      var tasksArray = res.data;
      console.log(tasksArray);

      const users = tasksArray.map((user) =>({
        key : user.id.toString(),
        label : user.username
      }))

      this.setState({
        users : users
      })
    })
  }

  addMessage(message) {
    const maxLogLength = 5;
    const newMessage = { message };
    const messages = [newMessage, ...this.state.messages];
=======
import React, {Component} from 'react';
import Gantt from './components/Gantt';
import Toolbar from './components/Toolbar';
import MessageArea from './components/MessageArea';
import './App.css';

const data = {
    data: [
        {id: 1, text: 'Task #1', start_date: '2020-02-12', duration: 3, progress: 0.6},
        {id: 2, text: 'Task #2', start_date: '2020-02-16', duration: 3, progress: 0.4},
        {id: 3, text: " test 3", start_date: '2022-03-12', duration: 3, progress: 0.3},
        {id: 4, text: " test 3", start_date: '2022-03-12', duration: 3, progress: 0.3}
    ],
    links: [
        {id: 1, source: 1, target: 2, type: '0'}
    ]
};

class App extends Component {
    state = {
        currentZoom: 'Days',
        messages: []
    };

    addMessage(message) {
        const maxLogLength = 5;
        const newMessage = {message};
        const messages = [
            newMessage,
            ...this.state.messages
        ];
>>>>>>> 582a34d193cc832ba62a7c8f2a74919f4ff4dc33

        if (messages.length > maxLogLength) {
            messages.length = maxLogLength;
        }
        this.setState({messages});
    }

<<<<<<< HEAD
  logDataUpdate = (type, action, item, id) => {
    let text = item && item.text ? ` (${item.text})` : "";
    let message = `${type} ${action}: ${id} ${text}`;
    if (type === "link" && action !== "delete") {
      console.log("link")
      message += ` ( source: ${item.source}, target: ${item.target} )`;
    }
    this.addMessage(message);
  };

  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom,
    });
  };

  render() {
    const { currentZoom, messages, tasks, users } = this.state;
    const data = {
      data: tasks,
      links: [{ id: 1, source: 1, target: 4, type: "0" }],
    };

    return (
        <div style={{ height: "100%" }}>
          <div className="zoom-bar">
            <Toolbar zoom={currentZoom} onZoomChange={this.handleZoomChange} />
          </div>
          <div id="gant-here" className="gantt-container">
            <Gantt
                tasks={data}
                zoom={currentZoom}
                onDataUpdated={this.logDataUpdate}
            />
          </div>
          <MessageArea messages={messages} />
        </div>
    );
  }
=======
    logDataUpdate = (type, action, item, id) => {
        let text = item && item.text ? ` (${item.text})` : '';
        let message = `${type} ${action}: ${id} ${text}`;
        if (type === 'link' && action !== 'delete') {
            message += ` ( source: ${item.source}, target: ${item.target} )`;
        }
        this.addMessage(message);
    }

    handleZoomChange = (zoom) => {
        this.setState({
            currentZoom: zoom
        });
    }

    render() {
        const {currentZoom, messages} = this.state;
        return (
            <div style={{height: '100%'}}>
                <div className="zoom-bar">
                    <Toolbar
                        zoom={currentZoom}
                        onZoomChange={this.handleZoomChange}
                    />
                </div>
                <div className="gantt-container">
                    <Gantt
                        tasks={data}
                        zoom={currentZoom}
                        onDataUpdated={this.logDataUpdate}
                    />
                </div>
                {/* <MessageArea
          messages={messages}
        /> */}
            </div>
        );
    }
>>>>>>> 582a34d193cc832ba62a7c8f2a74919f4ff4dc33
}

export default App;
