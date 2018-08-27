<template>
  <div class="about">
    <h1>获取无限制小程序码</h1>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm formBox">
      <el-form-item label="页面地址" prop="url">
        <el-input type="text" v-model="ruleForm.url" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <img :src="src" alt="">
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    let validateUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入页面地址'))
      } else {
        let reg = /^pages\/\S{1,}$/i
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('请以pages/****开头'))
        }
      }
    }

    return {
      ruleForm: {
        url: ''
      },
      rules: {
        url: [
          {
            validator: validateUrl,
            trigger: 'blur'
          }
        ]
      },
      src: ''
    }
  },
  computed: {
    ...mapState(['access_token'])
  },
  methods: {
    submitForm (formName) {
      console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.access_token !== '') {
            this.getwxacode()
          } else {
            this.$message.error('请先获取access_token')
          }
        } else {
          this.$message.error('页面地址填写错误！！！')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.src = ''
    },
    async getwxacode () {
      console.log(this.access_token)
      let url = `/wxa/getwxacode?access_token=${this.access_token}`
      // eslint-disable-next-line
      let data = await axios({
        method: 'post',
        url: url,
        responseType: 'blob',
        data: {
          path: this.ruleForm.url
        }
      })
      console.log('getwxacode', data)
      if (data.status === 200 && !!data.data) {
        let aUrl = window.URL.createObjectURL(data.data)
        this.src = aUrl
        this.$message({
          message: '获取二维码成功',
          type: 'success'
        })
      } else {
        this.$message.error('获取二维码出错')
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
