<template>
  <div class="app__inner">
    <LNB />
    <div class="app__page">
      <Header />
      <div class="container">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import LNB from '~/components/LNB'
import Header from '~/components/Header'

export default {
  components: {
    LNB,
    Header
  }
}
</script>

<style lang="scss" scoped>
.app__inner {
  display: flex;
  height: 100vh;
  color: $color-font;
  font-size: 14px;
  line-height: 1.4;
  font-family: 'Noto Sans KR', sans-serif;
  .app__page {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    .container {
      flex-grow: 1;
      overflow-y: auto;
    }
  }
}
</style>
