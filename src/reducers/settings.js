const settingsReducer = (state = { pageIndex: 0, pageSize: 10, language: 'en' }, action) => {
  switch (action.type) {
    case "LANGUAGE":
      return { ...state, language: action.payload };
    case "PAGE_INDEX":
      return { ...state, pageIndex: action.payload };
    case "PAGE_SIZE":
      return { ...state, pageSize: action.payload };
    default:
      return state;
  }
};

export default settingsReducer;
