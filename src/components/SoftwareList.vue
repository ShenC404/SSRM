<template>
  <div class="software-list">
    <div class="controls">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" v-model="searchTerm" placeholder="搜索软件名称...">
      </div>
      <div class="filter-sort">
        <select v-model="statusFilter">
          <option value="all">所有状态</option>
          <option value="active">正常</option>
          <option value="expiring">即将到期</option>
          <option value="expired">已到期</option>
        </select>
        <select v-model="sortBy">
          <option value="expiry">按到期日排序</option>
          <option value="renewal">按续费日排序</option>
          <option value="cost">按费用排序</option>
        </select>
      </div>
    </div>
    <h2 class="section-title"><i class="fas fa-list"></i> 我的软件订阅</h2>
    <div class="software-grid" v-if="filteredSoftware.length > 0">
      <SoftwareCard
        v-for="software in filteredSoftware"
        :key="software.id"
        :software="software"
        :onDelete="deleteSoftware"
        :onEdit="editSoftware"
      />
    </div>
    <div class="empty-state" v-else>
      <i class="fas fa-box-open"></i>
      <h3>暂无订阅记录</h3>
      <p>添加您的第一个软件订阅开始管理</p>
    </div>
  </div>
</template>

<script>
import SoftwareCard from './SoftwareCard.vue';

export default {
  name: 'SoftwareList',
  components: {
    SoftwareCard
  },
  props: {
    softwareData: {
      type: Array,
      default: () => []
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
  data() {
    return {
      searchTerm: '',
      statusFilter: 'all',
      sortBy: 'expiry'
    };
  },
  computed: {
    filteredSoftware() {
      let filtered = this.softwareData;
      if (this.searchTerm) {
        filtered = filtered.filter(software => 
          software.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(software => {
          const daysLeft = this.calculateDaysLeft(software.expiryDate);
          if (this.statusFilter === 'active') {
            return daysLeft > 30;
          } else if (this.statusFilter === 'expiring') {
            return daysLeft > 0 && daysLeft <= 30;
          } else if (this.statusFilter === 'expired') {
            return daysLeft <= 0;
          }
          return false;
        });
      }
      filtered.sort((a, b) => {
        if (this.sortBy === 'expiry') {
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        } else if (this.sortBy === 'renewal') {
          return new Date(a.renewalDate) - new Date(b.renewalDate);
        } else if (this.sortBy === 'cost') {
          return b.cost - a.cost;
        }
        return 0;
      });
      return filtered;
    }
  },
  methods: {
    calculateDaysLeft(expiryDate) {
      const today = new Date();
      const expiry = new Date(expiryDate);
      const diffTime = expiry - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    deleteSoftware(id) {
      this.onDelete(id);
    },
    editSoftware(software) {
      this.onEdit(software);
    }
  }
}
</script>

<style scoped>
.software-list {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  position: relative;
}

.software-list::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #fd79a8, #fdcb6e);
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  gap: 15px;
}

.search-box {
  flex-grow: 1;
  position: relative;
}

.search-box input {
  padding-left: 45px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #636e72;
}

.filter-sort {
  display: flex;
  gap: 10px;
}

.software-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #636e72;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #dfe6e9;
}
</style>