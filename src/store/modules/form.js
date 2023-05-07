
const getDefaultState = () => {
    return {
        tname: ''
    }
}

const state = getDefaultState()

const mutations = {
    SET_NAME: (state, tname) => {
        state.tname = tname
    }
}

export default {
    state,
    mutations
}