
const getDefaultState = () => {
    return {
        tname: '',
        total: 1
    }
}

const state = getDefaultState()

const mutations = {
    SET_NAME: (state, tname) => {
        state.tname = tname
    },
    SET_TOTAL: (state) => {
        state.total++
    }
}

export default {
    state,
    mutations
}