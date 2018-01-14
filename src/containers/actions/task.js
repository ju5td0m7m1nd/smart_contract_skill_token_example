import TaskContract from "../../../build/contracts/Task.json";
import AuthenticationContract from "../../../build/contracts/Authentication.json";
import store from "../../store";

const contract = require("truffle-contract");

export async function createTask({ taskName, skillPoints }) {
  let web3 = store.getState().web3.web3Instance;
  // Double-check web3's status.
  if (typeof web3 !== "undefined") {
    // Using truffle-contract we create the authentication object.
    const authentication = contract(AuthenticationContract);
    authentication.setProvider(web3.currentProvider);
    const authInstance = await authentication.deployed();

    const task = contract(TaskContract);
    task.setProvider(web3.currentProvider);

    const taskInstance = await task.deployed();
    // Using truffle-contract we create the authentication object.

    // Get current ethereum wallet.
    web3.eth.getCoinbase(async (error, coinbase) => {
      // Log errors, if any.
      if (error) {
        return console.error(error);
      }
      task
        .deployed()
        .then(function(instance) {
          instance
            .createTask(taskName, skillPoints, { from: coinbase })
            .then(() => {
              console.log("Task created");
            });
        })
        .catch(err => console.log(err));
    });
  } else {
    console.error("Web3 is not initialized.");
  }
}
