import TaskContract from "../../../build/contracts/Task.json";
import AuthenticationContract from "../../../build/contracts/Authentication.json";
import store from "../../store";

const contract = require("truffle-contract");

export async function createTask({ taskName, skillPoints }) {
  // Double-check web3's status.
  let web3 = store.getState().web3.web3Instance;
  if (typeof web3 !== "undefined") {
    const task = contract(TaskContract);
    task.setProvider(web3.currentProvider);

    const taskInstance = await task.deployed();
    // Get current ethereum wallet.
    web3.eth.getCoinbase(async (error, coinbase) => {
      // Log errors, if any.
      if (error) {
        return console.error(error);
      }
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

export async function getTask() {
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
      const result = await taskInstance.getTask(0, { from: coinbase });
      console.log(result);
    });
  } else {
    console.error("Web3 is not initialized.");
  }
}
