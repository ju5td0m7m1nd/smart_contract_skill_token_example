import React from "react";
import { connect } from "react-redux";
import TaskCreator from "./components/TaskCreator";
import Task from "./components/Task";
import {
  createTask,
  getTask,
  getCurrentToken,
  finishTask
} from "./actions/task";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    getTask(this.props.dispatch);
    getCurrentToken();
  }

  render() {
    const { data } = this.props.task;

    return (
      <section
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {data.map((d, key) =>
          <Task {...d} key={key} finishTask={() => finishTask(key)} />
        )}
        <TaskCreator createTask={createTask} />
      </section>
    );
  }
}

const mapStateToProps = state => ({
  task: state.task
});

export default connect(mapStateToProps)(Main);
