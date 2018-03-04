const initialState = {
  data: []
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case "APPEND_TASKS":
      return { ...state, data: state.data.concat(...action.payload) };
    case "ACHIEVE_TASK":
      return state;
    default:
      return state;
  }
};

export default taskReducer;
