<template>
  <li>
    <div
      :style="{ paddingLeft: `${14 * depth}px` }"
      :class="{ active: $route.fullPath === `/workspaces/${workspace.id}` }"
      class="title"
      @click="$router.push(`/workspaces/${workspace.id}`)">
      <span
        :class="{ active: showChildren }"
        class="material-icons"
        @click.stop="showChildren = !showChildren">
        play_arrow
      </span>
      <span class="text">
        {{ title }}
      </span>
      <div class="actions">
        <span
          class="material-icons"
          @click.stop="createWorkspace">
          add
        </span>
        <span
          class="material-icons"
          @click.stop="deleteWorkspace">
          delete
        </span>
      </div>
    </div>
    <div
      v-if="!hasChildren && showChildren"
      :style="{ paddingLeft: `${14 * depth + 22}px` }"
      class="no-children">
      하위 페이지가 없습니다.
    </div>
    <ul v-if="hasChildren && showChildren">
      <WorkspaceItem
        v-for="ws in workspace.documents"
        :key="ws.id"
        :workspace="ws"
        :depth="depth + 1" />
    </ul>
  </li>
</template>

<script>
export default {
  props: {
    workspace: {
      type: Object,
      default: () => ({})
    },
    depth: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showChildren: false
    }
  },
  computed: {
    title() {
      return this.workspace.title ? this.workspace.title : '제목 없음'
    },
    hasChildren() {
      return this.workspace.documents && this.workspace.documents.length
    }
  },
  methods: {
    async createWorkspace() {
      await this.$store.dispatch('workspace/createWorkspace', {
        parentId: this.workspace.id
      })
      this.showChildren = true
    },
    async deleteWorkspace() {
      await this.$store.dispatch('workspace/deleteWorkspace', {
        id: this.workspace.id
      })
      // 현재 페이지에서 도큐먼트를 삭제한 경우,
      // 가지고 있는 첫 번째 도큐먼트 페이지로 이동!
      if (this.workspace.id === parseInt(this.$route.params.id, 10)) {
        this.$router.push({
          name: 'Workspace',
          params: {
            id: this.$store.state.workspace.workspaces[0].id
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  cursor: pointer;
  user-select: none;
  .title {
    display: flex;
    align-items: center;
    white-space: nowrap;
    padding: 5px 14px;
    position: relative;
    color: rgba($color-font, .7);
    &:hover {
      background-color: $color-background--hover1;
      padding-right: 4px;
      .actions {
        display: flex;
      }
    }
    &.active {
      .text {
        font-weight: 700;
        color: rgba($color-font, .8);
      }
    }
    .material-icons {
      font-size: 18px;
      color: #37352f66;
      margin-right: 4px;
      &:hover {
        background-color: $color-background--hover2;
      }
      &.active {
        transform: rotate(90deg);
      }
    }
    .text {
      flex-grow: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .actions {
      display: none;
      align-items: center;
    }
  }
  .no-children {
    color: rgba($color-font, .35);
    padding: 5px 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>