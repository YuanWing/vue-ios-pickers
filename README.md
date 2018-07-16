## vue-ios-pickers 组件使用说明
### 属性说明:  
| 属性 | 描述 | 类型 | 默认值 |
  | --- | --- | --- | --- |
  | show | 是否显示 | Boolean | `false` |
  | cols | 展示数据的列数, 可取值 `1`, `2`, `3` | Number | `1` |
  | pickerData | 需要展示的数据 | Array | `[]` |
  | date | 设置日期类型, 可取值 `date`, `time`, `datetime`, (`pickerData` 将失效) | String | `无` |
  | minDate | 开始时间 | Number | `1949` |
  | maxDate | 结束时间 | Number | `当前年份往后 + 50` |
  | defaultValue | 初始值 | Array | String | `无` |
  | cancelFn | 取消的回调函数 | Function | `无` |
  | confirmFn | 确认的回调函数 | Function | `当前选中的数据(Array)` |  
- `pickerData` 数据格式说明:  
  ```javascript
  // 格式一, 非联动, 三列数据互相独立
  [
    [
      { name: '北京', id: '010' },
      { name: '天津', id: '022' }
    ], [
      { name: '东城区', id: '0101' },
      { name: '西城区', id: '0102' }
    ], [
      { name: '长安街', id: '010101' },
      { name: '长椿街', id: '010102' }
    ]
  ]

  // 格式二，联动，后一列的数据依赖前一列
  [
    [
      {
        name: '北京', id: '010', children: [
          {
            name: '东城区', id: '0101', children: [
              { name: '长安街', id: '010101' },
              { name: '长椿街', id: '010102' }
            ]
          }, {
            name: '西城区', id: '0102', children: [
              { name: '西长安街', id: '010201' },
              { name: '西长椿街', id: '010202' }
            ]
          }
        ]
      }
    ]
  ]
  ```
- `defaultValue` 数据格式说明:  
  ```javascript
  [
    { name: '北京' },
    { name: '西城区' },
    { name: '西长椿街' }
  ]
  ```  
  如果 `date === 'date'` 则 `defaultValue` 取值为 `String`: `2016.02.28 | 2016-02-28`  
  如果 `date === 'time'` 则 `defaultValue` 取值为 `String`: `15:45`
