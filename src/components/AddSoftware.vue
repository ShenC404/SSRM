<template>
  <div class="add-software">
    <h2 class="section-title"><i class="fas fa-plus-circle"></i> 添加新软件</h2>
    <div class="form-group">
      <label for="software-name">软件名称</label>
      <input type="text" id="software-name" v-model="name" placeholder="例如：网易云音乐">
    </div>
    <div class="form-group">
      <label for="renewal-date">自动续费日期</label>
      <input type="date" id="renewal-date" v-model="renewalDate">
    </div>
    <div class="form-group">
      <label for="membership-type">会员类型</label>
      <select id="membership-type" v-model="type">
        <option value="">选择会员类型</option>
        <option value="monthly">月度会员</option>
        <option value="quarterly">季度会员</option>
        <option value="yearly">年度会员</option>
        <option value="lifetime">终身会员</option>
      </select>
    </div>
    <div class="form-group">
      <label for="expiry-date">到期日期</label>
      <input type="date" id="expiry-date" v-model="expiryDate">
    </div>
    <div class="form-group">
      <label for="cost">订阅费用 (¥)</label>
      <input type="number" id="cost" v-model="cost" placeholder="例如：15.00" step="0.01">
    </div>
    <div class="form-group">
      <label for="notes">备注信息</label>
      <input type="text" id="notes" v-model="notes" placeholder="例如：自动续费，需提前3天取消">
    </div>
    <button class="btn" @click="addSoftware"><i class="fas fa-save"></i> 保存软件信息</button>
  </div>
</template>

<script>
export default {
  name: 'AddSoftware',
  data() {
    return {
      name: '',
      renewalDate: '',
      type: '',
      expiryDate: '',
      cost: '',
      notes: ''
    };
  },
  props: {
    onAdd: {
      type: Function,
      required: true
    }
  },
  methods: {
    addSoftware() {
      if (!this.name || !this.renewalDate || !this.type || !this.expiryDate || !this.cost) {
        this.$emit('showNotification', '请填写所有必填字段', false);
        return;
      }
      const newSoftware = {
        id: Date.now(),
        name: this.name,
        category: "软件类别",
        icon: "fas fa-box",
        renewalDate: this.renewalDate,
        expiryDate: this.expiryDate,
        cost: parseFloat(this.cost),
        type: this.type,
        notes: this.notes,
        status: "active"
      };
      this.onAdd(newSoftware);
      this.name = '';
      this.renewalDate = '';
      this.type = '';
      this.expiryDate = '';
      this.cost = '';
      this.notes = '';
    }
  },
  created() {
    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    this.renewalDate = today.toISOString().split('T')[0];
    this.expiryDate = expiryDate.toISOString().split('T')[0];
  }
}
</script>

<style scoped>
.add-software {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.add-software::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #6c5ce7, #fd79a8);
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 25px;
  color: #6c5ce7;
  padding-bottom: 15px;
  border-bottom: 2px solid #a29bfe;
  display: flex;
  align-items: center;
}

.section-title i {
  margin-right: 10px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2d3436;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 14px;
  border: 2px solid #dfe6e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus, select:focus {
  border-color: #6c5ce7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
}

.btn {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  border: none;
  padding: 14px 25px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -60px;
  width: 20px;
  height: 200%;
  background: rgba(255,255,255,0.3);
  transform: rotate(30deg);
  transition: all 0.6s;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(108, 92, 231, 0.5);
}

.btn:hover::after {
  left: 120%;
}

.btn i {
  margin-right: 8px;
}
</style>