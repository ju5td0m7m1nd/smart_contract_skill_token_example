import React from "react";
import { connect } from "react-redux";
import TaskCreator from "./components/TaskCreator";
import { createTask } from "./actions/task";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <section style={{height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <TaskCreator createTask={createTask} />
      </section>
    );
  }
}

export default connect()(Main);
