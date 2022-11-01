<template>
  <div class="progress">
    <div class="progress-bar">
      <progress :value="liveCounter" max="100"
                class="progress"
                :class="{
                  progressHigh: ( 80 <= liveCounter ),
                  progressMedium: liveCounter > 20 && liveCounter < 80,
                  progressLow: (liveCounter <= 20)
                }"
      ></progress>
      <div v-if="accuracy">
        <span>{{ Math.round(liveCounter) }} / 100</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  //@ts-ignore
  import {ShipState_Type, ShipsDescr_Type} from '@/pages/BattleShip.vue'

  export default defineComponent({
    name: "ProgressBar",

    updated(): void {
      // console.log('accuracy', this.accuracy)
    },

    props: {
      ships:         { type: Object,  required: true  },
      shipsOwner:    { type: String,  required: true  },
      accuracy:      { type: Boolean, required: false },
      gameInProgress:{ type: Boolean, required: true }
    },

    methods: {
      emitBubble() {
        this.$emit('gameStopped', this.shipsOwner === 'computer')
      }
    },


    computed: {
      liveCounter() {
        console.log(1111)
        let value = 0, maxValue = 0;

        for (let ship in this.ships) {
          this.ships[ship].forEach((el: ShipState_Type[]) => {
            el.forEach(({alive}) => {
              maxValue++;
              alive && value++
            })
          })
        }
        let lives = ((value / maxValue) * 100)  ;
        if (!isNaN(lives) && !lives && this.gameInProgress) {
          console.log(lives)
          this.emitBubble()
        }

        return lives || 0
      },
    },
  })
</script>

<style scoped>

  .progress-bar {
    display: flex;
    justify-content: center;
  }

  .progress {
    border-radius: 0;
    margin: 5px auto;
    width: 80%;
    /*box-shadow: 1px 1px 4px rgba( 0, 0, 0, 0.2 );*/
  }

  .progress::-webkit-progress-bar {
    /*background-color: lightyellow;*/
    /*border-radius: 7px;*/
  }

  .progress::-webkit-progress-value {
    border-radius: 7px;
    /*box-shadow: 1px 1px 5px 3px rgba( 255, 0, 0, 0.8 );*/
  }

  .progressHigh::-webkit-progress-bar {
    background-color: lightgreen;
  }

  .progressHigh::-webkit-progress-value {
    background-color: green;
  }

  .progressMedium::-webkit-progress-bar {
    background-color: lightyellow;
  }

  .progressMedium::-webkit-progress-value {
    background-color: yellow;
  }

  .progressLow::-webkit-progress-bar {
    background-color: pink;
  }

  .progressLow::-webkit-progress-value {
    background-color: red;
  }


</style>