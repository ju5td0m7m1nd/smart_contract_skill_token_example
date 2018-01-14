import React from "react";

class TaskCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: "",
      skillPoints: 0
    };
  }
  render() {
    const { taskName, skillPoints } = this.state;
    return (
      <div>
        <input
          value={taskName}
          onChange={e => this.setState({ taskName: e.target.value })}
        />
        <input
          value={skillPoints}
          onChange={e => this.setState({ skillPoints: e.target.value })}
        />
        <button onClick={this._createTask}>Create Task</button>
      </div>
    );
  }
  _createTask = () => {
    const { skillPoints, taskName } = this.state;
    
    if (skillPoints !== 0 && taskName !== "") {
      this.props.createTask({ taskName, skillPoints });
    }
  };
}

export default TaskCreator;
