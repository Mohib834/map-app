export default function() {
  return {
    namespaced: true,
    state: state(),
    getters : getters,
    mutations: mutations,
    actions : actions
  }
}

const state = () => {
  return {
    valid: false,
    firstname: "",
    lastname: "",
    address1: "",
    address2: "",
    city: "",
    countryCode: "",
    stateCode: "",
    zip: "",
    email: "",
    phoneNumber: ""
  }
};

const getters = {


  valid: (state, getters) => {
    return state.valid;
  },
  firstname: (state, getters) => {
    return state.firstname;
  },
  lastname: (state, getters) => {
    return state.lastname;
  },
  address1: (state, getters) => {
    return state.address1;
  },
  address2: (state, getters) => {
    return state.address2;
  },

  city: (state, getters) => {
    return state.city;
  },
  countryCode: (state, getters) => {
    return state.countryCode;
  },
  stateCode: (state, getters) => {
    return state.stateCode;
  },
  zip: (state, getters) => {
    return state.zip;
  },
  email: (state, getters) => {
    return state.email;
  },
  phoneNumber: (state, getters) => {
    return state.phoneNumber;
  }
};

const mutations = {

  valid: (state, payload) => {
    state.valid = payload;
  },

  firstname: (state, payload) => {
    state.firstname = payload;
  },
  lastname: (state, payload) => {
    state.lastname = payload;
  },
  address1: (state, payload) => {
    state.address1 = payload;
  },
  address2: (state, payload) => {
    state.address2 = payload;
  },

  city: (state, payload) => {
    state.city = payload;
  },
  countryCode: (state, payload) => {
    state.countryCode = payload;
  },
  stateCode: (state, payload) => {
    state.stateCode = payload;
  },
  zip: (state, payload) => {
    state.zip = payload;
  },
  email: (state, payload) => {
    state.email = payload;
  },
  phoneNumber: (state, payload) => {
    state.phoneNumber = payload;
  }

};

const actions = {};
