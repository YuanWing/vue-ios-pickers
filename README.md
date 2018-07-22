## vue-ios-pickers 组件使用说明
基于Vue，iOS风格的picker组件，支持三级联动，日期(年.月.日)，时间(时:分)，日期+时间，年，年+月
### DEMO
[查看demo](https://yuanwing.github.io/vue-ios-pickers/)
![vue-ios-pickers](./qrCode.png)
### 安装
```
$ yarn add vue-ios-pickers
```
Or
```
$ npm install vue-ios-pickers
```
### 使用
- 引入`js`全局使用:
  ```javascript
  <script src="./node_modules/vue-ios-pickers/dist/vue-ios-pickers.min.js"></script>
  ```
- 使用 `Vue.use` 导入
  ```javascript
  import VueIosPickers from 'vue-ios-pickers';
  Vue.use(VueIosPickers);
  ```
- 页面中使用
  ```javascript
  // 一个日期的 picker  支持 年.月.日 时:分
  <vue-ios-pickers
    date="datetime"
    :cols="5"
  ></vue-ios-pickers>
  ```
### 属性说明:  
| 属性 | 描述 | 类型 | 默认值 |
  | --- | --- | --- | --- |
  | v-model | 组件通信, 初始值(**必填**) | String | Number | Array | `-` |
  | cols | 展示数据的列数, 可取值 `1`, `2`, `3`, `5` | Number | `3` |
  | name | 设置 `picker` 的唯一名称, 会在 `onConfirm` 一起返回 | String | `-` |
  | align | 设置文本对齐方式, 可取值 `css -> text-align` | String | `right`
  | pickerData | 需要展示的数据 | Array | `[]` |
  | date | 设置日期类型, 可取值 `date`, `time`, `datetime`, (`pickerData` 将失效) | String | `-` |
  | minDate | 开始时间 | Number | `1949` |
  | maxDate | 结束时间 | Number | `当前年份往后 + 50` |
  | onCancel | 取消的回调函数 | Function | `-` |
  | onConfirm | 确认的回调函数 | Function | `当前选中的数据(Array)及name值` |  
  | onItemChange | 列数据变更的回调函数 | Function | `变更前、后的数据` |
### 其他说明
1. 当使用 `date=datetime` 时 **必须** 传 `cols=5`;
2. 使用 `v-model` 进行数据传输, 如果需要初始默认值, 刚把默认值赋值给 `v-model`;
3. `date=datetime` 取值格式必须是 `年.月.日 时:分`
4. 默认值格式: 如果存在 `date`, 则必须是 `String`, 否则可以是`String` 或 `Array`:
    - `date`存在的`String`: `2018.08.19 08:08`
    - `Array`: `['北京', '西城区', '西长椿街']`
    - `String`: `北京,西城区,西长椿街`
5. 三级联动时, 后一列的数据取前一列的 `children` 属性值
6. `pickerData`的数据格式:
    ```
    [
      [
        {
          name: '北京',
          id: '010',
          children: [
            {
              name: '北京',
              id: '0101',
              children: [
                { name: '西城区', id: '010101' },
                { name: '东城区', id: '010102' },
                { name: '海淀区', id: '010103' },
              ]
            }
          ]
        }, {
          name: '四川',
          id: '028',
          children: [
            {
              name: '成都市',
              id: '0281',
              children: [
                { name: '武侯区', id: '02811' },
                { name: '青羊区', id: '02812' },
                { name: '成华区', id: '02813' },
                { name: '锦江区', id: '02814' },
                { name: '金牛区', id: '02815' },
              ]
            }, {
              name: '泸州市',
              id: '0282',
              children: [
                { name: '江阳区', id: '02821' },
                { name: '龙马潭区', id: '02822' },
                { name: '纳西区', id: '02823' },
                { name: '泸县', id: '02824' },
              ]
            }
          ]
        }
      ]
    ]
    ```