<template>
  <div :class="`software-card ${statusClass}`">
    <div class="card-header">
      <div class="card-icon">
        <i :class="software.icon"></i>
      </div>
      <div class="card-title">
        <h3>{{ software.name }}</h3>
        <p>{{ software.category }}</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-row">
        <span class="info-label">自动续费日</span>
        <span class="info-value renewal-date">{{ software.renewalDate }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">到期日期</span>
        <span class="info-value">{{ software.expiryDate }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">{{ daysLeft > 0 ? '剩余天数' : '状态' }}</span>
        <span class="info-value" :class="{ 'days-left': daysLeft > 0 }" :style="{ color: daysLeft <= 0 ? 'var(--danger)' : '' }">
          {{ daysLeft > 0 ? `${daysLeft} 天` : statusText }}
        </span>
      </div>
      <div class="info-row">
        <span class="info-label">订阅费用</span>
        <span class="info-value">¥{{ software.cost.toFixed(2) }}/{{ software.type === 'monthly' ? '月' : software.type === 'quarterly' ? '季' : software.type === 'yearly' ? '年' : '终身' }}</span>
      </div>
      <div class="progress-container">
        <div class="info-row">
          <span class="info-label">会员进度</span>
          <span class="info-value">{{ progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="progress-info">
          <span>{{ software.renewalDate }}</span>
          <span>{{ software.expiryDate }}</span>
        </div>
      </div>
    </div>
    <div class="card-actions">
      <button class="action-btn edit-btn" @click="editSoftware"><i class="fas fa-edit"></i> 编辑</button>
      <button class="action-btn delete-btn" @click="deleteSoftware"><i class="fas fa-trash-alt"></i> 删除</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SoftwareCard',
  props: {
    software: {
      type: Object,
      required: true
    },
    onDelete: {
      type: Function,
      required: true
    },
    onEdit: {
      type: Function,
      required: true
    }
  },
  computed: {
    daysLeft() {
      const today = new Date();
      const expiry = new Date(this.software.expiryDate);
      const diffTime = expiry - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    statusClass() {
      if (this.daysLeft <= 0) {
        return 'expired';
      } else if (this.daysLeft <= 30) {
        return 'soon-expire';
      }
      return '';
    },
    statusText() {
      if (this.daysLeft <= 0) {
        return '已过期';
      } else if (this.daysLeft <= 30) {
        return '即将到期';
      }
      return '';
    },
    progress() {
      const start = new Date(this.software.renewalDate);
      const end = new Date(this.software.expiryDate);
      const today = new Date();
      const totalDuration = end - start;
      const elapsedDuration = today - start;
      return Math.min(100, Math.max(0, Math.floor((elapsedDuration / totalDuration) * 100)));
    }
  },
  methods: {
    deleteSoftware() {
      this.onDelete(this.software.id);
    },
    editSoftware() {
      this.onEdit(this.software);
    }
  }
}
</script>

<style scoped>
.software-card {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border: 1px solid #f1f2f6;
  background: white;
  animation: scaleIn 0.5s ease;
}

.software-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.15);
}

.card-header {
  padding: 20px;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  position: relative;
}

.card-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255,255,255,0.3);
}

.card-icon {
  width: 50px;
  height: 50px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 15px;
}

.card-title h3 {
  font-size: 1.3rem;
  margin-bottom: 5px;
}

.card-title p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.card-body {
  padding: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f1f2f6;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #636e72;
  font-weight: 500;
}

.info-value {
  font-weight: 600;
  text-align: right;
}

.renewal-date {
  color: #d63031;
}

.days-left {
  color: #00b894;
}

.progress-container {
  margin-top: 15px;
}

.progress-bar {
  height: 8px;
  background: #dfe6e9;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 5px;
}

.progress {
  height: 100%;
  background: linear-gradient(to right, #fdcb6e, #00b894);
  border-radius: 4px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 0.85rem;
  color: #636e72;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background: #f8f9fa;
  border-top: 1px solid #f1f2f6;
}

.action-btn {
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  border: none;
}

.action-btn i {
  margin-right: 5px;
}

.edit-btn {
  background: rgba(108, 92, 231, 0.1);
  color: #6c5ce7;
}

.edit-btn:hover {
  background: rgba(108, 92, 231, 0.2);
  transform: translateY(-2px);
}

.delete-btn {
  background: rgba(214, 48, 49, 0.1);
  color: #d63031;
}

.delete-btn:hover {
  background: rgba(214, 48, 49, 0.2);
  transform: translateY(-2px);
}

.soon-expire {
  border-left: 5px solid #fdcb6e;
}

.expired {
  border-left: 5px solid #d63031;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>