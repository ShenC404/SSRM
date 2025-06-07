<template>
  <header>
    <h1><i class="fas fa-calendar-check"></i> 软件会员管理助手</h1>
    <p class="subtitle">帮助您轻松管理所有软件的自动续费日期和会员时长，避免忘记取消订阅造成的额外扣费</p>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  animation: fadeInDown 0.8s ease;
}

h1 {
  font-size: 2.8rem;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #6c5ce7, #fd79a8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.subtitle {
  font-size: 1.2rem;
  color: #636e72;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>