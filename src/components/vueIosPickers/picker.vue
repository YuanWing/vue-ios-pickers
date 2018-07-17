<template>
  <transition name="fade">
    <div class="vue-ios-pickers" v-show="show">
      <div class="picker-mask" key="mask" />
      <div id="picker" class="picker-wrapper" key="wrapper">
        <div class="btn-box">
          <a class="btn btn-cancel" @click="onCancelHandler">取消</a>
          <a class="btn btn-confirm" @click="onConfirmHandler">确定</a>
        </div>
        <div class="data-box">
          <div class="scroll-mask" />
          <!-- 第一列 -->
          <div
            class="items"
            v-for="(column, index) in colsData"
            :key="index"
          >
            <ul
              class="scroll"
              :data-column="index"
              :style="dynamicStyle(index)"
              @touchstart="onStart"
              @touchmove="onMove"
              @touchend="onEnd"
            >
              <li
                class="item"
                v-for="(item, index) in column"
                v-text="item.name"
                :key="index"
              />
            </ul>
            <div class="border" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'vue-ios-pickers',
    props: {
      show: {
        default: false,
        required: true
      },
      cols: {
        type: Number,
        default: 3
      },
      pickerData: {
        type: Array,
        defalut: []
      },
      date: String,
      minDate: [Number, String],
      maxDate: [Number, String],
      defaultValue: {
        type: [Array, String]
      },
      onCancel: Function,
      onConfirm: Function
    },
    data() {
      return {
        itemHeight: 0,
        // 实际页面展示的数据
        colsData: [],
        pos: []
      };
    },
    created() {
      this.init();
    },
    methods: {
      onCancelHandler() {
        this.onCancel();
      },
      onConfirmHandler() {
        const data = this.colsData;
        const cols = data.length;
        const pos = this.pos;
        const selected = [];
        let index = 0;
        let str = '';
        while (index < cols) {
          const { name, id } = data[index][pos[index].index];
          selected.push({
            name,
            id
          });
          str += name;
          index += 1;
        }

        this.onConfirm({
          str,
          obj: JSON.parse(JSON.stringify(selected))
        });
      },
      setTransition(el, val) {
        el.style.transition = val;
        el.style.webkitTransition = val;
      },
      setTransform(el, val) {
        el.style.transform = val;
        el.style.webkitTransform = val;
      },
      dynamicStyle(column) {
        const moveY = this.pos[column].moveY;
        let value = `translate3d(0, ${this.pos[column].moveY}px, 0)`;
        if (typeof moveY === 'string' && moveY.indexOf('em') !== -1) {
          value = `translate3d(0, ${this.pos[column].moveY}, 0)`;
        }
        return {
          webkitTransform: value,
          transform: value
        };
      },
      setPosAttr(index, attr, val) {
        this.pos[index][attr] = val;
      },
      getScreenY(e) {
        return e.touches[0].screenY;
      },
      getColumn(el) {
        return +el.dataset.column;
      },
      moveTo(el, y, time = 0.3) {
        const currentColumn = this.pos[el.dataset.column];
        let moveY = currentColumn.moveY;
        if (moveY !== y) {
          currentColumn.moveY = y;
          if (time) {
            this.setTransition(el, `cubic-bezier(0,0,0.2,1.15) ${time}s`);
          }
          setTimeout(() => {
            this.setTransition(el, '');
          }, time * 1000);
        }
      },
      /**
       * @param {number} column - 代表的列数(0, 1, 2);
       * @param {number} index - 当前列表，滚动到的行数索引
       */
      onChange(column, index) {
        if (index === this.pos[column].index) return;
        this.setPosAttr(column, 'index', index);
        // 这里要注意是级连的还是单独的
        if (this.date === 'date' || this.date === 'datetime') {
          return this.setDateColumn(column, index);
        } else if (this.date === 'time') {
          return this.setTimeColumn(column, index);
        }
        if (column >= 2 || this.pickerData.length > 1) return;
        const { id, children } = this.colsData[column][index];
        if (id === -1) return;
        const noData = [{ name: '请选择', id: -1 }];
        if (this.cols === 3) this.resetColumn(2);
        if (column === 0) {
          if (this.cols > 1) {
            this.$set(this.colsData, 1, children || noData);
            this.resetColumn(1);
          }
          if (this.cols !== 3) return;
          if (children && children[0]) {
            this.$set(this.colsData, 2, children[0].children || noData);
          } else {
            this.$set(this.colsData, 2, noData);
          }
        } else if (column === 1 && this.cols === 3) {
          this.$set(this.colsData, 2, children || noData);
        }
      },
      onStart(e) {
        e.preventDefault();
        const target = e.target;
        const children = target.children;
        const itemHeight = children[0].getBoundingClientRect().height;
        const len = children.length;
        const scrollHeight = itemHeight * (len - 1);
        const column = this.getColumn(target);
        let moveY = this.pos[column].moveY;
        // 如果初始化是取的默认值 moveY 的单位为 em，itemHeight === 2em;
        if (typeof moveY === 'string' && moveY.indexOf('em') !== -1) {
          moveY = parseInt(moveY) * (itemHeight / 2);
        }
        this.itemHeight = itemHeight;
        this.setPosAttr(column, 'startY', this.getScreenY(e));
        this.setPosAttr(column, 'moveY', moveY);
        this.setPosAttr(column, 'lastY', moveY);
        this.setPosAttr(column, 'scrollHeight', scrollHeight);
        this.setTransition(target, 'cubic-bezier(0, 0, 0.2, 1.15) 0s');
      },
      // 进行数据运算时，记得判断一下数值是否存在
      onMove(e) {
        e.preventDefault();
        const target = e.target;
        const column = this.getColumn(target);
        const currentY = this.getScreenY(e);
        const currentColumn = this.pos[column];
        const newMoveY = currentColumn.lastY - currentColumn.startY + currentY;
        this.setPosAttr(column, 'moveY', newMoveY);
      },
      onEnd(e) {
        e.preventDefault();
        const target = e.target;
        const column = this.getColumn(target);
        const currentPos = this.pos[column];
        const itemHeight = this.itemHeight;
        const scrollHeight = currentPos.scrollHeight;
        let targetY = currentPos.moveY;

        if (targetY % itemHeight !== 0) {
          targetY = Math.round(targetY / itemHeight) * itemHeight;
        }

        if (targetY > 0) {
          targetY = 0;
        } else if (Math.abs(targetY) > scrollHeight) {
          targetY = -scrollHeight;
        }
        const index = Math.abs(targetY / itemHeight);
        this.moveTo(target, targetY);
        this.onChange(column, index);
      },
      // 组件初始化数据
      init() {
        const cols = +this.cols || 3;
        let index = 0;
        while (index < cols) {
          this.$set(this.pos, index, {
            startY: 0,
            moveY: 0,
            lastY: 0,
            index: 0,
            scrollHeight: 0
          });
          index += 1;
        }
        if (this.date) {
          this.initDate();
          return;
        }
        if (this.pickerData.length > 1) {
          this.$set(this, 'colsData', this.pickerData);
        } else {
          this.colsData[0] = this.pickerData[0];
          if (cols > 1) {
            this.colsData[1] = this.pickerData[0][0].children || [];
            if (cols === 3) {
              this.colsData[2] = this.pickerData[0][0].children[0].children;
            }
          }
        }

        if (this.defaultValue && this.defaultValue.length) {
          this.setDefaultValue();
        }
      },
      // 组件默认值(初始化从父组件传进来的)
      setDefaultValue() {
        const firstDefault = this.defaultValue[0];
        /**
         * isChildren 用来判断 picker 取值是级联(取上一列的children) 还是并联(取pickerData[index])
         */
        const isChildren = this.pickerData.length === 1;
        const defaultValueFn = (defaultValue, column) => {
          if (!defaultValue) return;
          this.colsData[column].map((item, index) => {
            if (item.name === defaultValue.name || item.id === defaultValue.id) {
              this.pos[column].index = index;
              this.pos[column].moveY = `-${2 * index}em`;
            }
          });
        };
        defaultValueFn(firstDefault, 0);
        if (this.cols === 1) return;
        if (this.pickerData.length > 1) {
          this.$set(this, 'colsData', this.pickerData);
        }
        if (this.cols > 1) {
          if (isChildren) {
            this.colsData[1] = this.pickerData[0][this.pos[0].index].children || [];
          }
          const secondDefault = this.defaultValue[1];
          defaultValueFn(secondDefault, 1);
          if (this.cols === 3) {
            if (isChildren) {
              this.colsData[2] = this.pickerData[0][this.pos[0].index].children[this.pos[1].index].children;
            }
            const thirdDefault = this.defaultValue[2];
            defaultValueFn(thirdDefault, 2);
          }
        }
      },
      // 日期初始化
      initDate() {
        let now = new Date(this.defaultValue);
        if (now.toString().toLowerCase().indexOf('invalid') !== -1) {
          now = new Date();
        }
        let nowYear = now.getFullYear();
        let nowMonths = now.getMonth();
        let nowDay = now.getDate();
        let nowHours = now.getHours();
        let nowMinutes = now.getMinutes();
        if (this.date === 'time') {
          this.setHours(nowHours);
          this.setMinutes(nowMinutes);
        } else {
          this.setYear(nowYear);
          if (this.cols > 1) {
            this.setMonths(nowMonths);
            if (this.cols > 2) {
              this.setDay(nowDay);
              this.setDateColumn(this.cols);
            }
          }
          if (this.date === 'datetime') {
            this.setHours(nowHours);
            this.setMinutes(nowMinutes);
          }
        }
      },
      setYear(nowYear) {
        const startYear = parseInt(this.minDate) || 1949;
        const endYear = parseInt(this.maxDate) || (nowYear + 50);
        let year = startYear;
        const yearColumn = [];
        while (year <= endYear) {
          yearColumn.push({
            name: `${year}年`,
            id: year
          });
          year += 1;
        }
        const index = nowYear - startYear;
        this.pos[0].index = index;
        this.pos[0].moveY = `-${2 * index}em`;
        this.colsData[0] = yearColumn;
      },
      setMonths(nowMonths) {
        const monthsColum = [];
        let months = 1;
        while (months <= 12) {
          monthsColum.push({
            name: `${months}月`,
            id: months
          });
          months += 1;
        }
        this.pos[1].index = nowMonths;
        this.pos[1].moveY = `-${2 * nowMonths}em`;
        this.colsData[1] = monthsColum;
      },
      setDay(nowDay) {
        const dayColum = [];
        let day = 1;
        while (day <= 31) {
          dayColum.push({
            name: `${day}日`,
            id: day
          });
          day += 1;
        }
        this.pos[2].index = nowDay - 1;
        this.pos[2].moveY = `-${2 * (nowDay - 1)}em`;
        this.colsData[2] = dayColum;
      },
      /**
       * 跟据年、月来控制日期的天数
       * @param {number} column - 代表的列数(0, 1, 2);
       * @param {number} index - 当前列表，滚动到的行数索引
       */
      setDateColumn(column, index) {
        if (this.cols < 3) return;
        const year = this.colsData[0][this.pos[0].index];
        const month = this.colsData[1][this.pos[1].index];
        const dayIndex = this.pos[2].index;
        const day = this.colsData[2][dayIndex];
        const isLeapYear = this.isLeapYear(year.id);
        if (column === 2) return;
        this.setDay(day.id);
        // 小月份，共 30 天
        if (month.id === 2) {
          if (isLeapYear) {
            this.colsData[2].splice(29, 2);
            if (dayIndex >= 29) {
              this.pos[2].moveY = -28 * this.itemHeight;
              this.pos[2].index = 28;
            }
          } else {
            this.colsData[2].splice(28, 3);
            if (dayIndex >= 28) {
              this.pos[2].moveY = -27 * this.itemHeight;
              this.pos[2].index = 27;
            }
          }
        } else if ([4, 6, 9, 11].indexOf(month.id) !== -1) {
          this.colsData[2].splice(30, 1);
          if (dayIndex === 30) {
            this.pos[2].moveY = -29 * this.itemHeight;
            this.pos[2].index = 29;
          }
        }
      },
      /**
       * 判断是否为闰年
       * 能被 400 整除 或 能被 4 整除但不能被 100 整除
       * @param {number} year - 当前年份
       */
      isLeapYear(year) {
        if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) return true;
        return false;
      },
      setHours(nowHours) {
        const hoursColum = [];
        let hours = 0;
        let column = this.date === 'time' ? 0 : 3;
        while (hours < 24) {
          hoursColum.push({
            name: `${(hours + '').length === 1 ? '0' + hours : hours}时`,
            id: hours
          });
          hours += 1;
        }
        this.pos[column].index = nowHours;
        this.pos[column].moveY = `-${2 * nowHours}em`;
        this.colsData[column] = hoursColum;
      },
      setMinutes(nowMinutes) {
        const minutesColum = [];
        let minutes = 0;
        let column = this.date === 'time' ? 1 : 4;
        while (minutes < 60) {
          minutesColum.push({
            name: `${(minutes + '').length === 1 ? '0' + minutes : minutes}分`,
            id: minutes
          });
          minutes += 1;
        }
        this.pos[column].index = nowMinutes;
        this.pos[column].moveY = `-${2 * nowMinutes}em`;
        this.colsData[column] = minutesColum;
      },
      setTimeColumn(column, index) {
        console.log(column, index);
      },
      /**
       * @param {number} column - 当前的列数
       **/
      resetColumn(column) {
        this.$set(this.pos, column, {
          startY: 0,
          moveY: 0,
          lastY: 0,
          index: 0
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  @borderColor: #ececec;
  .picker-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
    z-index: 999;
  }
  .picker-wrapper {
    background-color: #fff;
    color: #333;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
    overflow: hidden;
  }
  .btn-box {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background-color: #fff;
    border-top: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
  }
  .btn {
    text-decoration: none;
    color: #0575f2;
    padding: .6em;
  }
  .data-box {
    display: flex;
    position: relative;
    .scroll-mask {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.6)),
                        linear-gradient(0deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.6));
      background-position: top, bottom;
      background-size: 100% 6em;
      background-repeat: no-repeat;
      pointer-events: none;
    }
    .items {
      flex: 1;
      font-size: 1em;
      height: 14em;
      position: relative;
      overflow: hidden;
    }
    .item {
      height: 2em;
      line-height: 2em;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      pointer-events: none;
    }
    .border {
      height: 2em;
      width: 100%;
      border-top: 1px solid darken(@borderColor, 10%);
      border-bottom: 1px solid darken(@borderColor, 10%);
      position: absolute;
      left: 0;
      top: 6em;
      z-index: 2;
      pointer-events: none;
    }
    .scroll {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding-top: 6em;
      padding-bottom: 6em;
      margin-top: 0;
      margin-top: 0;
      list-style: none;
      padding-left: 0;
    }
  }
</style>
