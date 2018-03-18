import TaskContract from "../../../build/contracts/Task.json";
import AuthenticationContract from "../../../build/contracts/Authentication.json";
import store from "../../store";
import actionTypes from "../actionTypes";

const contract = require("truffle-contract");

export async function createTask({ taskName, skillPoints }) {
  // Double-check web3's status.
  let web3 = store.getState().web3.web3Instance;
  if (typeof web3 !== "undefined") {
    const task = contract(TaskContract);
    task.setProvider(web3.currentProvider);
    const auth = contract(AuthenticationContract);
    auth.setProvider(web3.currentProvider);
    const authInstance = await auth.deployed();
    const taskInstance = await task.deployed();
    // Get current ethereum wallet.
    web3.eth.getCoinbase(async (error, coinbase) => {
      // Log errors, if any.
      if (error) {
        return console.error(error);
      }

      await taskInstance.bindAuthAddress(authInstance.address, {
        from: coinbase
      });
      taskInstance
        .createTask(taskName, skillPoints, { from: coinbase })
        .then(() => {
          console.log("Task created");
        });
    });
  } else {
    console.error("Web3 is not initialized.");
  }
}

export async function getTask(dispatch) {
  let web3 = store.getState().web3.web3Instance;
  if (typeof web3 !== "undefined") {
    // Get current ethereum wallet.
    web3.eth.getCoinbase(async (error, coinbase) => {
      const task = contract(TaskContract);
      task.setProvider(web3.currentProvider);
      const taskInstance = await task.deployed();
      // Log errors, if any.
      if (error) {
        return console.error(error);
      }
      const taskCount = web3.utils.toDecimal(
        await taskInstance.getTasksCount.call()
      );
      if (taskCount > 0) {
        const payload = [];
        for (var i = 0; i < taskCount; i++) {
          const result = await taskInstance.getTask(i, { from: coinbase });
          const taskName = web3.utils.toUtf8(result[0]);
          const skillPoints = web3.utils.toDecimal(result[1]);
          // 0x00 is false
          // 0x01 is true
          const isDone = web3.utils.toHex(result[2]);
          const doneBy = web3.utils.toHex(result[3])
          console.log(doneBy)
          payload.push({
            taskName,
            skillPoints,
            isDone,
            doneBy
          });
        }
        return dispatch({
          type: actionTypes.APPEND_TASKS,
          payload
        });
      }
    });
  } else {
    console.error("Web3 is not initialized.");
  }
}

export async function finishTask(taskId) {
  let web3 = store.getState().web3.web3Instance;
  if (typeof web3 !== "undefined") {
    // Get current ethereum wallet.
    web3.eth.getCoinbase(async (error, coinbase) => {
      const task = contract(TaskContract);
      task.setProvider(web3.currentProvider);
      const taskInstance = await task.deployed();
      if (error) {
        return console.error(error);
      }
      const skillPoints = await taskInstance.finishTask(taskId, {
        from: coinbase
      });
      console.log(skillPoints);
    });
  } else {
    console.error("Web3 is not initialized.");
  }
}

export async function getSkillPoint() {
  let web3 = store.getState().web3.web3Instance;
  if (typeof web3 !== "undefined") {
    // Get current ethereum wallet.
    web3.eth.getCoinbase(async (error, coinbase) => {
      const auth = contract(AuthenticationContract);
      auth.setProvider(web3.currentProvider);
      const authInstance = await auth.deployed();
      // Log errors, if any.
      if (error) {
        return console.error(error);
      }

      const skillPoints = web3.utils.toDecimal(
        await authInstance.getUserSkill.call(coinbase)
      );
      console.log(skillPoints)
    });
  } else {
    console.error("Web3 is not initialized.");
  }
}
