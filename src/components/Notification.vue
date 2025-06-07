<template>
  <div :class="`notification ${isSuccess ? 'success' : 'error'} ${show ? 'show' : ''}`">
    <i :class="isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
    <span>{{ message }}</span>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      default: ''
    },
    isSuccess: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  transform: translateX(150%);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.notification.show {
  transform: translateX(0);
}

.notification.success {
  border-left: 4px solid #00b894;
}

.notification.error {
  border-left: 4px solid #d63031;
}

.notification i {
  margin-right: 10px;
  font-size: 1.2rem;
}

.notification.success i {
  color: #00b894;
}

.notification.error i {
  color: #d63031;
}
</style>