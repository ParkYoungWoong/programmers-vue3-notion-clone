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
      const workspace = await _request({
        method: 'POST',
        body: JSON.stringify({
          title: '',
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
      const workspaces = await _request({
        method: 'GET'
      })
      commit('assignState', {
        workspaces
      })
      dispatch('findWorkspacePath')
      // 항목이 하나도 없는 경우,
      // 새로운 기본 항목을 하나 생성!
      if (!workspaces.length) {
        dispatch('createWorkspace')
      }
    },
    async readWorkspace({ commit }, payload) {
      const { id } = payload
      try {
        const workspace = await _request({
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
      await _request({
        id,
        method: 'PUT',
        body: JSON.stringify({
          title,
          content
        })
      })
      dispatch('readWorkspaces')
    },
    async deleteWorkspace({ state, dispatch }, payload) {
      const { id } = payload
      await _request({
        id,
        method: 'DELETE'
      })
      await dispatch('readWorkspaces')
      // 현재 페이지에서 도큐먼트를 삭제한 경우,
      // 가지고 있는 첫 번째 도큐먼트 페이지로 이동!
      if (id === parseInt(router.currentRoute.value.params.id, 10)) {
        router.push({
          name: 'Workspace',
          params: {
            id: state.workspaces[0].id
          }
        })
      }
    },
    findWorkspacePath({ state, commit }) {
      const currentWorkspaceId = parseInt(router.currentRoute.value.params.id, 10)
      function _find(workspace, parents) {
        if (currentWorkspaceId === workspace.id) {
          commit('assignState', {
            currentWorkspacePath: [...parents, workspace]
          })
        }
        if (workspace.documents) {
          workspace.documents.forEach(ws => _find(ws, [...parents, workspace]))
        }
      }
      state.workspaces.forEach(workspace => _find(workspace, []))
    }
  }
}

async function _request(options) {
  return await fetch('/.netlify/functions/workspace', {
    method: 'POST',
    body: JSON.stringify(options)
  }).then(res => res.json())
}
