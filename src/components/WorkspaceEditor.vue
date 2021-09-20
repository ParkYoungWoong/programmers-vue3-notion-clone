<template>
  <section :key="$route.params.id">
    <div class="inner">
      <div
        ref="title"
        class="title"
        placeholder="제목 없음"
        contenteditable
        @input="onInput('title')">
        {{ title }}
      </div>
      <div
        ref="content"
        class="content"
        placeholder="내용을 입력하세요!"
        contenteditable
        @input="onInput('content')">
        {{ content }}
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    title() {
      return this.$store.state.workspace.currentWorkspace.title
    },
    content() {
      return this.$store.state.workspace.currentWorkspace.content
    }
  },
  watch: {
    $route() {
      this.$store.dispatch('workspace/readWorkspace', {
        id: this.$route.params.id
      })
    }
  },
  created() {
    this.$store.dispatch('workspace/readWorkspace', {
      id: this.$route.params.id
    })  
  },
  methods: {
    onInput() {
      this.$store.dispatch('workspace/updateWorkspace', {
        id: this.$route.params.id,
        title: this.$refs.title.innerText,
        content: this.$refs.content.innerText
      })
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  padding: 100px 0 200px;
  .inner {
    max-width: 700px;
    margin: 0 auto;
    padding: 0 20px;
    [contenteditable] {
      outline: none;
      &.title {
        font-size: 44px;
        font-weight: 600;
        margin-bottom: 20px;
      }
      &:empty::before {
        content: attr(placeholder);
        color: rgba(#000, .2);
      }
    }
  }
}
</style>