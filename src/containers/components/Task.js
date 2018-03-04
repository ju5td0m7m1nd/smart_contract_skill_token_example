import React from "react";

class Task extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { taskName, skillPoints, isDone, finishTask } = this.props;
    return (
      <div>
        <h2>
          {taskName}
        </h2>
        <h3>
          {skillPoints}
        </h3>
        <h4>
          {isDone}
        </h4>
        <button onClick={finishTask}>Finish</button>
      </div>
    );
  }
}

export default Task;
