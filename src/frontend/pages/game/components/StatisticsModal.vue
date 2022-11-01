<template>
  <div class="background" @click="closeModal" id="back">
    <div class="modal">
      <div class="header">
        <my-button size="small" @click="closeModal" id="btn"> X</my-button>
      </div>
      <div class="content">

        <div class="total-stats base-font">
          <h3 class="title" @click="cheatConsoleShown = !cheatConsoleShown">Total Statistics</h3>
          <span class="base-font">Rounds: {{ totalStat.totalRounds }}</span>
          <span class="base-font">Score:  {{ totalStat.player.winNumbers || 0 }} : {{ totalStat.computer.winNumbers || 0 }} </span>
          <span class="base-font">Shots:  {{ totalStat.totalShots  }} </span>

          <input v-show="cheatConsoleShown" type="text" :value="inputValue" @input="cheatValidator">

          <span v-show="msgVisible">Cheat activated</span>

        </div>

        <div class="person-stats">

          <div>
            <h3>Player</h3>
            <stat-items :personStat="totalStat.player"/>
          </div>
          <div>
            <h3>Computer</h3>
            <stat-items :personStat="totalStat.computer" reversed/>
          </div>
        </div>

        <div class="person-stats-wrapper">
          <hr v-show="totalStat.rounds.length">
          <div v-for="round in totalStat.rounds" class="total-stats base-font">
            <h3 class="sub-title">Round {{ round.roundNumber }}</h3>
            <h4 class="sub-title"> {{ round.player.successfulShots > round.computer.successfulShots ? "Win" : "Lose"
              }} </h4>
            <div class="person-stats">
              <stat-items :personStat="round.player"/>
              <stat-items :personStat="round.computer" reversed/>
            </div>
          </div>
        </div>


      </div>

    </div>

  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  // import MyButton from "@/components/Button.vue";
  import StatItems from "@/frontend/pages/game/components/StatItems.vue";


  export default defineComponent({

    components: {/*MyButton,*/ StatItems},

    name: "StatisticsModal",
    props: {
      totalStat: {type: Object, required: true},
    },

    data: () => ({
      inputValue: '' as string,
      debouncedValue: '' as string,
      msgVisible: false as boolean,
      cheatConsoleShown: false as boolean,
      _timeoutID: null as any,
    }),

    methods: {
      closeModal({target}: { target: HTMLElement }) {
        if (target.id === 'back' || target.id === 'btn') {
          this.$emit('closeModal', false)
        }
      },

      cheatValidator({target}: { target: HTMLInputElement }) {
        this.inputValue = target.value;
      },

      debounce(value: string, delay: number) {

        clearTimeout(this._timeoutID);

        this._timeoutID = setTimeout(() => {
          this.debouncedValue = value
        }, delay)
      }

    },

    watch: {
      inputValue: function () {
        this.debounce(this.inputValue, 1000)
      },

      debouncedValue: function () {

        if (this.debouncedValue === 'Marco') {
          this.msgVisible = true;
          this.$emit('cheatEvent', {cursorCheat: true});
          this.cheatConsoleShown = false;
          this.inputValue = '';
        }

        if (this.debouncedValue === 'Polo') {
          this.msgVisible = true;
          this.$emit('cheatEvent', {cheatMode: true});
          this.cheatConsoleShown = false
          this.inputValue = '';
        }

        if (this.debouncedValue === 'Marco Polo') {
          this.msgVisible = true;
          this.$emit('cheatEvent', {cheatMode: true, cursorCheat: true});
          this.cheatConsoleShown = false;
          this.inputValue = '';
        }

        setTimeout(() => {
          this.msgVisible = false
        }, 2000)

      }

    }
  })
</script>

<style scoped lang="less">

  @baseColor: teal;

  @smallFontSize: 15px;
  @baseFontSize: 20px;
  @largeFontSize: 25px;

  .base-font {
    font-size: @baseFontSize;
  }

  .small-font {
    font-size: @smallFontSize;
  }

  .large-font {
    font-size: @largeFontSize;
  }

  .background {
    height: 100vh;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(190, 191, 195, .7);
  }

  .modal {

    min-height: 500px;
    width: 500px;

    border-radius: 5px;
    border: 2px solid @baseColor;

    background: whitesmoke;
  }

  .header {
    display: flex;
    justify-content: end;
    padding: 10px 15px;
  }

  .total-stats {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    min-height: 100px;
    margin: 5px auto;
  }

  .title {
    margin: 10px auto;
  }

  .title:hover {
    cursor: not-allowed;
  }

  .sub-title {
    margin: 5px auto;
  }

  .person-stats-wrapper {
    max-height: 350px;
    overflow: auto;
  }

  .person-stats {
    display: flex;
    justify-content: space-around;
  }

  .person-stats h3 {
    text-align: center;
  }

</style>