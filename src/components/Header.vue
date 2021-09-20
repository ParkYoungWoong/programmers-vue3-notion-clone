<template>
  <header>
    <div class="title"></div>
    <div class="actions">
      <button>공유</button>
      <button>업데이트</button>
      <button>즐겨찾기</button>
      <button>기타</button>
    </div>
  </header>
</template>

<script>
export default {
  computed: {
    title() {
      return this.$store.state.workspace.currentWorkspace.title
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  height: 45px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  .title {
    flex-grow: 1;
  }
  .actions {
    display: flex;
    button {
      background: none;
      border: none;
      outline: none;
      font-size: 14px;
      height: 28px;
      padding: 0 10px;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: $color-background;
      }
    }
  }
}
</style>