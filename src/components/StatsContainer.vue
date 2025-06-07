<template>
  <div class="stats-container">
    <div class="stat-card">
      <div class="stat-icon">
        <i class="fas fa-box"></i>
      </div>
      <div class="stat-info">
        <h3 id="total-software">{{ totalSoftware }}</h3>
        <p>已记录软件</p>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <div class="stat-info">
        <h3 id="expiring-soon">{{ expiringSoon }}</h3>
        <p>即将到期</p>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">
        <i class="fas fa-money-bill-wave"></i>
      </div>
      <div class="stat-info">
        <h3 id="monthly-cost">¥{{ monthlyCost.toFixed(2) }}</h3>
        <p>月度订阅费用</p>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">
        <i class="fas fa-calendar-day"></i>
      </div>
      <div class="stat-info">
        <h3 id="renewal-this-month">{{ renewalThisMonth }}</h3>
        <p>本月自动续费</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsContainer',
  props: {
    softwareData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    totalSoftware() {
      return this.softwareData.length;
    },
    expiringSoon() {
      return this.softwareData.filter(software => {
        const today = new Date();
        const expiry = new Date(software.expiryDate);
        const diffTime = expiry - today;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return daysLeft > 0 && daysLeft <= 30;
      }).length;
    },
    monthlyCost() {
      return this.softwareData.reduce((total, software) => {
        if (software.type === 'monthly') {
          return total + software.cost;
        } else if (software.type === 'quarterly') {
          return total + (software.cost / 3);
        } else if (software.type === 'yearly') {
          return total + (software.cost / 12);
        }
        return total;
      }, 0);
    },
    renewalThisMonth() {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      return this.softwareData.filter(software => {
        const renewalDate = new Date(software.renewalDate);
        return renewalDate.getMonth() === currentMonth && 
               renewalDate.getFullYear() === currentYear;
      }).length;
    }
  }
}
</script>

<style scoped>
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  animation: fadeIn 1s ease;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(to bottom, #6c5ce7, #a29bfe);
}

.stat-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: white;
  font-size: 1.8rem;
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
}

.stat-info h3 {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: #6c5ce7;
}

.stat-info p {
  color: #636e72;
  font-size: 1rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>