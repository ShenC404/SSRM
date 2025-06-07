<template>
  <div class="container">
    <Header />
    <StatsContainer :softwareData="softwareData" />
    <div class="main-content">
      <AddSoftware :onAdd="addSoftware" @showNotification="showNotification" />
      <SoftwareList
        :softwareData="softwareData"
        :onDelete="deleteSoftware"
        :onEdit="editSoftware"
      />
    </div>
    <footer>
      <p>© 2025 软件会员管理助手 | 帮助您管理所有订阅服务，避免忘记取消自动续费</p>
    </footer>
    <Notification :message="notificationMessage" :isSuccess="isNotificationSuccess" :show="showNotificationFlag" />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import StatsContainer from './components/StatsContainer.vue';
import AddSoftware from './components/AddSoftware.vue';
import SoftwareList from './components/SoftwareList.vue';
import Notification from './components/Notification.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Header,
    StatsContainer,
    AddSoftware,
    SoftwareList,
    Notification
  },
  data() {
    return {
      softwareData: [],
      notificationMessage: '',
      isNotificationSuccess: true,
      showNotificationFlag: false,
      currentUserId: 1 // 假设当前用户ID为1，实际应用中应该从认证状态获取
    };
  },
  created() {
    this.fetchSubscriptions();
  },
  methods: {
    async fetchSubscriptions() {
      try {
        const response = await axios.get(`/api/subscriptions/${this.currentUserId}`);
        this.softwareData = response.data.data;
        this.showNotification('订阅数据加载成功', true);
      } catch (error) {
        console.error('获取订阅数据失败:', error);
        this.showNotification('获取订阅数据失败', false);
      }
    },
    async addSoftware(newSoftware) {
      try {
        // 查找或创建软件记录
        let softwareId;
        const softwareResponse = await axios.get('/api/software');
        const existingSoftware = softwareResponse.data.data.find(
          sw => sw.name.toLowerCase() === newSoftware.name.toLowerCase()
        );
        
        if (existingSoftware) {
          softwareId = existingSoftware.id;
        } else {
          const createResponse = await axios.post('/api/software', {
            name: newSoftware.name,
            category: newSoftware.category || "未知类别",
            icon: newSoftware.icon || "fas fa-box"
          });
          softwareId = createResponse.data.data.id;
        }
        
        // 创建订阅记录
        const subscriptionData = {
          userId: this.currentUserId,
          softwareId,
          renewalDate: newSoftware.renewalDate,
          expiryDate: newSoftware.expiryDate,
          cost: newSoftware.cost,
          type: newSoftware.type,
          notes: newSoftware.notes,
          status: this.getSubscriptionStatus(newSoftware.expiryDate)
        };
        
        await axios.post('/api/subscriptions', subscriptionData);
        this.fetchSubscriptions();
        this.showNotification('软件订阅添加成功！', true);
      } catch (error) {
        console.error('添加订阅失败:', error);
        this.showNotification('添加订阅失败', false);
      }
    },
    async deleteSoftware(id) {
      try {
        await axios.delete(`/api/subscriptions/${id}`);
        this.fetchSubscriptions();
        this.showNotification('订阅已删除', true);
      } catch (error) {
        console.error('删除订阅失败:', error);
        this.showNotification('删除订阅失败', false);
      }
    },
    async editSoftware(software) {
      try {
        const subscriptionData = {
          renewalDate: software.renewalDate,
          expiryDate: software.expiryDate,
          cost: software.cost,
          type: software.type,
          notes: software.notes,
          status: this.getSubscriptionStatus(software.expiryDate)
        };
        
        await axios.put(`/api/subscriptions/${software.id}`, subscriptionData);
        this.fetchSubscriptions();
        this.showNotification('订阅已更新', true);
      } catch (error) {
        console.error('更新订阅失败:', error);
        this.showNotification('更新订阅失败', false);
      }
    },
    getSubscriptionStatus(expiryDate) {
      const today = new Date();
      const expiry = new Date(expiryDate);
      const diffTime = expiry - today;
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (daysLeft <= 0) {
        return 'expired';
      } else if (daysLeft <= 30) {
        return 'expiring';
      }
      return 'active';
    },
    showNotification(message, isSuccess = true) {
      this.notificationMessage = message;
      this.isNotificationSuccess = isSuccess;
      this.showNotificationFlag = true;
      setTimeout(() => {
        this.showNotificationFlag = false;
      }, 3000);
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

:root {
  --primary: #6c5ce7;
  --secondary: #a29bfe;
  --accent: #fd79a8;
  --dark: #2d3436;
  --light: #f7f7f7;
  --success: #00b894;
  --warning: #fdcb6e;
  --danger: #d63031;
  --card-shadow: 0 10px 20px rgba(0,0,0,0.1);
  --transition: all 0.3s ease;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  color: var(--dark);
  min-height: 100vh;
  padding: 20px;
  background-attachment: fixed;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  animation: fadeInUp 0.8s ease;
}

@media (max-width: 992px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

footer {
  text-align: center;
  margin-top: 50px;
  padding: 20px;
  color: #636e72;
  font-size: 0.9rem;
  animation: fadeIn 1.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>