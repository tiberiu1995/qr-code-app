const settingsReducer = (state = { pageIndex: 0, pageSize: 10 }, action) => {
  switch (action.type) {
    case "PAGE_INDEX":
      return { ...state, pageIndex: action.payload };
    case "PAGE_SIZE":
      return { ...state, pageSize: action.payload };
    default:
      return state;
  }
};

export default settingsReducer;
