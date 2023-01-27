const update_user_Customer = (user) => {
  return {
    type: 'SET_USER',
    data: user,
  };
};
const remove_user_Customer = () => {
  return { 
    type: 'REMOVE_USER',
    data: null,
  };
};

export { update_user_Customer, remove_user_Customer };