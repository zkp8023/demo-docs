// 上传文件组件变化的事件
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import type { IFormSchema } from './types'
export const useFormConfig = () => {
  const modelData = ref<any>({ age: '这是详情或预览展示的age属性值', username: 99999 })
  // 上传文件变化
  const fileChange = ({ file, fileList }) => {
    if (fileList.length >= 2)
      message.error('一张就够了')
    modelData.value.avatar = file
  }
  const cityOptions = [
    {
      value: '湖北省',
      label: '湖北省',
      children: [
        {
          value: '武汉市',
          label: '武汉市',
          children: [
            {
              value: '黄陂区',
              label: '黄陂区',
            },
          ],
        },
      ],
    },
  ]
  // 表单配置
  const formShcema = ref<IFormSchema>({
    // 传递给el-form的属性 model可以不用给
    form: {
      // detail: true, // 传入此字段，详情展示组件，但是不会影响formItem中有自定以插槽的情况
      labelCol: { span: 3 },
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
      },
    },
    items: [
      // 用户信息自定义列 最外层传递slot属性
      {
        slot: 'userInfo',
        formItem: {},
        attrs: { title: '用户信息 :' },
      },
      {
        // 传递给el-form-item的配置
        formItem: {
          label: '用户名',
          span: 12,
          name: 'username',
          placeholder: 'iii',
        },
        // 传递给表单控件的属性
        attrs: {
          class: 'userInput',
          typeName: 'input',
          // 传递给el-input的插槽名数组（插槽名称参照组件库）
          slots: ['prefix', 'suffix'],
        },
      },
      {
        formItem: {
          label: '密码',
          span: 12,
          name: 'password',
        },
        attrs: {
          typeName: 'input',
          type: 'password',
          slots: ['suffix'],
        },
      },
      // 用户爱好自定义列
      {
        slot: 'custom',
        formItem: { title: '用户爱好 :' },
        attrs: {},
      },
      {
        formItem: {
          span: 12,
          name: 'hobby',
          label: '爱好-联动 :',
        },
        attrs: {
          typeName: 'select',
          placeholder: '请选择',
          options: [
            { label: '篮球', value: 1 },
            { label: '足球', value: 2 },
            { label: '乒乓', value: 3 },
          ],
        },
      },

      {
        formItem: {
          name: 'time',
          label: '时间',
          span: 12,
        },
        attrs: {
          typeName: 'date-picker',
        },
      },
      /**
       * 联动列，指定render函数，返回boolean来指定当前列是否显示
       * item:当前列    model：表单绑定的数据
       * */
      {
        formItem: {
          label: '这是什么爱好？',
          name: 'hobbyName',
        },
        attrs: {
          typeName: 'input',
          placeholder: '这是爱好选了足球才展示的输入框',
        },
        // render函数 返回当前列显示的条件
        render: (model, item) => {
          console.log('model', model)
          console.log('item', item)
          return model.hobby === 2
        },
      },
      {
        formItem: {
          label: '年龄',
          labelCol: { offset: 2 },
          name: 'age',
        },
        attrs: {
          typeName: 'input',
          placeholder: '请输入年龄',
        },
        // render函数 返回当前列显示的条件
      },
      // 其他信息自定义列
      {
        slot: 'custom',
        formItem: {
          title: '其他信息自定义列 :',
          otherInfo: '其他信息自定义列才有的',
          // labelWidth: 100,
        },
        attrs: {},
      },
      {
        formItem: {
          name: 'city',
          label: '地址',
          span: 12,
        },
        attrs: {
          typeName: 'cascader',
          options: cityOptions,
          placeholder: '你住哪里',
        },
      },
      // 嵌套类型的组件需要传递child属性
      {
        formItem: {
          span: 12,
          name: 'type',
          label: '复选框',
        },
        attrs: {
          typeName: 'checkbox-group',
          options: [
            { label: '吃饭', value: 1 },
            { label: '睡觉', value: 2 },
            { label: '打豆豆', value: 3 },
          ],
        },
      },

      {
        slot: 'custom',
        formItem: { title: '详情展示时 :' },
        attrs: {},
      },
      {
        formItem: {
          label: '使用itemType=preview :',
          labelWidth: 180,
          name: 'age',
        },
        /**
         *  指定typeName：'preview',直接展示信息，不用el-input这些控件,如需自定义展示:
         * 可指定attrs ：{slots:[自定义展示的插槽名数组]}，
         * 还可以直接指定forItem的slot 来自定义渲染
         */
        attrs: { typeName: 'preview', style: { fontSize: '20px' }, slots: ['age'] },
      },
      // 展示详情还可以直接使用formItem插槽
      {
        formItem: {
          label: '使用formItem插槽 :',
          labelWidth: 160,
          name: 'age',
          slot: 'age',
        },
        attrs: {},
      },
      {
        slot: 'custom',
        formItem: { title: '上传头像 : ' },
        attrs: {},
      },
      // 上传文件el-upload比较特殊  双向绑定是通过v-model:file-list来的，可以使用上传事件来拿到上传的文件
      // 或者直接使用formItem选项的插槽来直接书写el-upload
      {
        formItem: {
          name: 'fileList',
          label: '头像',
        },
        attrs: {
          typeName: 'upload',
          listType: 'picture-card',
          autoUpload: false,
          onChange: fileChange,
          slots: ['default'],
        },
      },
    ],
  })
  return { formShcema, modelData }
}
