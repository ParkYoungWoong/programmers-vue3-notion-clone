import router from '~/routes'

export default {
  namespaced: true,
  state() {
    return {
      workspaces: [],
      currentWorkspace: {},
      currentWorkspacePath: []
    }
  },
  getters: {},
  mutations: {
    assignState(state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    }
  },
  actions: {
    async createWorkspace({ dispatch }, payload = {}) {
      const { parentId } = payload
      const workspace = await _requestWorkspace({
        method: 'POST',
        body: JSON.stringify({
          title: '',
          content: '',
          parent: parentId
        })
      })
      await dispatch('readWorkspaces')

      router.push({
        name: 'Workspace',
        params: {
          id: workspace.id
        }
      })
    },
    async readWorkspaces({ commit, dispatch }) {
      const workspaces = await _requestWorkspace({
        method: 'GET'
      })
      commit('assignState', {
        workspaces
      })
      // 항목이 하나도 없는 경우,
      // 새로운 기본 항목을 하나 생성!
      if (!workspaces.length) {
        dispatch('createWorkspace')
      }
    },
    async readWorkspace({ commit }, payload) {
      const { id } = payload
      try {
        const workspace = await _requestWorkspace({
          id,
          method: 'GET'
        })
        commit('assignState', {
          currentWorkspace: workspace
        })
      } catch (error) {
        router.push('/error')
      }
    },
    async updateWorkspace({ dispatch }, payload) {
      const { id, title, content } = payload
      await _requestWorkspace({
        id,
        method: 'PUT',
        body: JSON.stringify({
          title,
          content
        })
      })
      await dispatch('readWorkspaces')
    },
    async deleteWorkspace({ dispatch }, payload) {
      const { id } = payload
      await _requestWorkspace({
        id,
        method: 'DELETE'
      })
      await dispatch('readWorkspaces')
    }
  }
}

async function _requestWorkspace(options) {
  const { id = '' } = options
  return await fetch(`https://kdt.roto.codes/documents/${id}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-username': 'leon'
    }
  }).then(res => res.json())
}
