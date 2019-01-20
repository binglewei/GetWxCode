<template>
  <el-container>
    <el-header height="auto">
      <h1>{{headerText}}</h1>
      <h3>{{headerPro}}</h3>
    </el-header>
    <el-main>
      <el-aside class="asideBox">
        <el-select @change="selectFun" v-model="selctVal" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-aside>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" :label-position="labelPosition" class="demo-ruleForm formBox">
        <el-form-item label="页面地址：" prop="url">
          <el-input type="text" v-model="ruleForm.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="selctVal === 'B'" label="scene页面参数：">
          <el-input type="text" v-model="ruleForm.scene" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="二维码的宽度：" prop="width">
          <el-input type="text" v-model.number="ruleForm.width" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="selctVal !== 'C'" label="自动配置线条颜色：">
          <el-radio v-model="ruleForm.radio" :label="true">true</el-radio>
          <el-radio v-model="ruleForm.radio" :label="false">false</el-radio>
        </el-form-item>
        <el-form-item v-if="selctVal !== 'C'" label="手动设置线条颜色：(自动配置 为 false 时生效)">
          <el-input type="text" v-model="ruleForm.Rgb" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="selctVal !== 'C'" label="是否需要透明底色：">
          <el-switch
            v-model="ruleForm.hyaline"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="goBack">返回上一页</el-button>
        </el-form-item>
      </el-form>
      <div class="qrcodeBox">
        <img :src="src" alt="">
      </div>
    </el-main>
  </el-container>
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

    let validateWidth = (rule, value, callback) => {
      let reg = /\d/g
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('必须是数字'))
      }
    }

    return {
      headerText: '获取微信小程序二维码',
      headerPro: '接口 A: 适用于需要的码数量较少的业务场景',
      selctVal: 'A',
      labelPosition: 'left',
      ruleForm: {
        url: '',
        scene: '',
        width: '430',
        radio: false,
        Rgb: '{"r":0,"g":0,"b":0}',
        hyaline: false
      },
      options: [{
        value: 'A',
        label: '接口A'
      }, {
        value: 'B',
        label: '接口B'
      }, {
        value: 'C',
        label: '接口C'
      }],
      rules: {
        url: [
          {
            validator: validateUrl,
            trigger: 'blur'
          }
        ],
        width: [
          {
            validator: validateWidth,
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
    selectFun (val) {
      switch (val) {
        case 'A':
          this.headerPro = '接口 A: 适用于需要的码数量较少的业务场景'
          break
        case 'B':
          this.headerPro = '接口 B：适用于需要的码数量极多的业务场景'
          break
        case 'C':
          this.headerPro = '接口 C：适用于需要的码数量较少的业务场景'
          break
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    submitForm (formName) {
      console.log(formName)
      console.log('ruleForm', this.ruleForm)
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
      this.ruleForm = {
        url: '',
        scene: '',
        width: '430',
        radio: false,
        Rgb: '',
        hyaline: false
      }
      this.selctVal = 'A'
      this.selectFun('A')
      this.src = ''
    },
    getwxacode () {
      let reqUrl = ''
      let { url, scene, width, radio, Rgb, hyaline } = this.ruleForm
      let reqBody = {
        width: Number(width),
        auto_color: radio,
        line_color: JSON.parse(Rgb),
        is_hyaline: hyaline
      }
      switch (this.selctVal) {
        case 'A':
          reqUrl = '/wxa/getwxacode'
          reqBody.path = url
          break
        case 'B':
          reqUrl = '/wxa/getwxacodeunlimit'
          reqBody.scene = scene
          reqBody.page = url
          break
        case 'C':
          reqUrl = '/cgi-bin/wxaapp/createwxaqrcode'
          reqBody = {
            path: url,
            width
          }
          break
      }
      reqUrl += `?access_token=${this.access_token}`
      this.fetchData(reqUrl, reqBody)
    },
    async fetchData (url, reqBody) {
      // eslint-disable-next-line
      let data = await axios({
        method: 'post',
        url: url,
        responseType: 'blob', // 二进制文件
        data: reqBody
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
.asideBox {
  padding-top: 15px;
}
.qrcodeBox {
  width: 200px;
  height: 200px;
  margin: 15px auto 0;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
