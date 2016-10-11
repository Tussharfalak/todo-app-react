import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        //if(this.props.currentUser){
            Meteor.call('tasks.insert', text);
            ReactDOM.findDOMNode(this.refs.textInput).value = '';
        /*}else {
            alert('Login to add task');
        }*/

    }
    renderTasks() {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map((task) => (
            <Task key={task._id} task={task} />
        ));
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }
    render() {
        return (
            <div className="container">
                <header>
                    <h1>Todo List  ({this.props.incompleteCount}) </h1>
                    <AccountsUIWrapper />
                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted.bind(this)}
                        />
                        Hide Completed Tasks
                    </label>
                        <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                        <input
                            type="text"
                            ref="textInput"
                            placeholder={this.props.currentUser ? "Type to add new tasks" : "Login to add new task"}
                            disabled = {this.props.currentUser ? false : true }
                        />
                    </form>
                </header>
                { this.props.currentUser ?
                <ul>
                    {this.renderTasks()}
                </ul>
                    :''
                }
            </div>
        );
    }
}

App.propTypes = {
    tasks: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object,
};

export default createContainer(() => {
    Meteor.subscribe('tasks');
    return {
        tasks: Tasks.find({"owner":Meteor.userId()}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true }, "owner":Meteor.userId()}).count(),
        currentUser: Meteor.user(),
    };
}, App);