<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="LALALA"/>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm formBox">
      <el-form-item label="grant_type">
        <el-input type="text" v-model="ruleForm.grantType" :disabled="true" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="appid" prop="appid">
        <el-input type="text" v-model="ruleForm.appid" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="secret" prop="secret">
        <el-input type="text" v-model="ruleForm.secret" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">获取asstoken</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  data () {
    let validateAppid = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入Appid'))
      } else {
        callback()
      }
    }
    let validateSecret = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入Secret'))
      } else {
        callback()
      }
    }

    return {
      ruleForm: {
        grantType: 'client_credential',
        appid: '',
        secret: ''
      },
      rules: {
        appid: [
          {
            validator: validateAppid,
            trigger: 'blur'
          }
        ],
        secret: [
          {
            validator: validateSecret,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
    HelloWorld
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getAsstoken()
        } else {
          this.$message.error('请输入Appid和Secret！！！')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async getAsstoken () {
      let url = `/cgi-bin/token?grant_type=${this.ruleForm.grantType}&appid=${this.ruleForm.appid}&secret=${this.ruleForm.secret}`
      // eslint-disable-next-line
      let data = await axios({
        method: 'get',
        url: url
      })
      console.log('data', data)
      if (data.status === 200 && !!data.data.access_token) {
        this.$store.commit('setAccess', data.data.access_token)
        this.$message({
          message: '获取access_token成功',
          type: 'success'
        })
      } else {
        this.$message.error('获取access_token出错')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.formBox {
  width: 500px;
  margin: 0 auto;
}
</style>
