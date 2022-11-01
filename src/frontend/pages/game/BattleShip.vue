<template>

  <div class="game-wrapper">

    <div class="header flexed centred">

      <div class="flexed columned base-font">

        <stat-item text="Player shots"     :value="playerShots"/>
        <stat-item text="Successful shots" :value="playerSuccessfulShots"/>
        <stat-item text="Missed shots"     :value="playerMissedShots"/>
        <stat-item text="Accuracy"         :value="playerAccuracy" units="%" />
        <stat-item text="Last shot"        :value="playerLastShot.grid?.toUpperCase() || 'None'" />
        <stat-item text="Unfired cells"    :value="unShootedCellsPlayer.length" />
      </div>

      <div class="flexed columned base-font centred">

        <span>Round: {{ statisticsObj.totalRounds || 1 }}</span>
        <span>Score</span>
        <span>{{ statisticsObj.player.winNumbers }} : {{ statisticsObj.computer.winNumbers }} </span>
        <span>Shots:  {{ totalShots }} </span>
        <my-button v-show="!gameInProgress" @click="restartGame" class="small-font">
          {{ canRoundIncrease  ? 'Next round!' : 'Start game!' }}
        </my-button>



        <span v-show="!gameInProgress && winFlag !== undefined"
        :class="[winFlag ? 'silent' : 'alert']"
        >
          {{ winFlag ? 'You win!' : 'You lose!' }}
        </span>

      </div>

      <div class="flexed columned base-font">

        <stat-item text="AI shots"         :value="computerShots"           reversed />
        <stat-item text="Successful shots" :value="computerSuccessfulShots" reversed />
        <stat-item text="Missed shots"     :value="computerMissedShots"     reversed />
        <stat-item text="Accuracy"         :value="computerAccuracy"     reversed units="%"/>
        <stat-item text="Last shot"        :value="computerLastShot.grid?.toUpperCase() ||'None'" reversed />
        <stat-item text="Unfired cells"    :value="unShootedCellsComputer.length" reversed />
      </div>

    </div>

    <div class="game-body flexed centred">
      <battle-field
              operator="player"
              :playerFire="playerFire"
              :fieldOwnerObj="playerField"
               fieldOwner="playerField"
              :lastShot="computerLastShot"
              :cheatMode="cheatMode"
              :cursorCheat="cursorCheat"
              :cellDictNumbers="cellDictNumbers"
      />
      <battle-field
              operator="computer"
              :playerFire="playerFire"
              :fieldOwnerObj="computerField"
               fieldOwner="computerField"
              :lastShot="playerLastShot"
              :cheatMode="cheatMode"
              :cursorCheat="cursorCheat"
              :cellDictNumbers="cellDictNumbers"
      />


    </div>

    <div class="toolbar flexed centred">

      <statistics-modal  :totalStat="statisticsObj" v-if="statisticsShown" @closeModal="statisticsShown = !statisticsShown"
       @cheatEvent="cheatEvent"
      />

<!--      <my-button @click="restartGame">Restart game</my-button>-->

      <my-button @click="statisticsShown = !statisticsShown" :disabled="gameInProgress">Show statistics</my-button>

      <my-button @click="setStatsClear" class="small-font">Clear Stats</my-button>

      <my-button
              v-show="cheatModeShown"
              :lightToggle="cheatMode"
              @click="cheatModeToggler"
      >Cheat mode: {{ cheatMode ? 'Enabled' : 'Disabled' }}
      </my-button>
      <my-button
              v-show="cursorCheatShown"
              :lightToggle="cursorCheat"
              @click="cursorCheatToggler"
      >Cursor cheat: {{ cursorCheat ? 'Enabled' : 'Disabled' }}
      </my-button>

    </div>

    <div class="footer flexed centred">

    <div>
      <progress-bar :ships="playerShips" @gameStopped="gameStopped" shipsOwner="player"  :gameInProgress="gameInProgress" />
      <div class="flexed justifyed">

        <ship-statuses v-for="(shipArr, name) in playerShips"
                       :shipArr="shipArr"
                       :shipType="name"
                       shipsOwner="playerShips"
        />
      </div>

    </div>

    <div>
      <progress-bar :ships="computerShips" @gameStopped="gameStopped" shipsOwner="computer" :gameInProgress="gameInProgress" accuracy/>
      <div class="flexed justifyed">

        <ship-statuses v-for="(shipArr, name) in computerShips"
                       :shipArr="shipArr"
                       :shipType="name"
                       shipsOwner="computerShips"
        />
      </div>

    </div>

  </div>

  </div>


</template>

<script lang="ts">

  import {defineComponent} from 'vue';
  import ShipStatuses    from '@/frontend/pages/game/components/ShipStatuses.vue';
  import ProgressBar     from '@/frontend/pages/game/components/ProgressBar.vue';
  import StatItem        from "@/frontend/pages/game/components/StatItem.vue";
  import BattleField     from "@/frontend/pages/game/components/BattleField.vue";
  import StatisticsModal from "@/frontend/pages/game/components/StatisticsModal.vue";

  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default defineComponent({

  name: 'BattleShip',

  components: {
    ShipStatuses, ProgressBar, StatItem, BattleField, StatisticsModal,
  },

  data: () => ({ statisticsShown: false as boolean }),

  methods: {

    ...mapMutations({
      createCellMask:     'ships/createCellMask',
      reSetGameState:     'ships/reSetGameState',
      gameStopped:        'ships/gameStopped',
      cheatEvent:         'ships/cheatEvent',
      cheatModeToggler:   'ships/cheatModeToggler',
      cursorCheatToggler: 'ships/cursorCheatToggler',
      getStatistics:      'ships/getStatistics',
      setStatsClear:      'ships/setStatsClear',
    }),

    ...mapActions({
      shipGenerator:       'ships/shipGenerator',
      setBattleField:      'ships/setBattleField',
      restartGame:         'ships/restartGame',
      playerFire:          'ships/playerFire',
      generateCelltoFire:  'ships/generateCelltoFire',
    }),
  },

  computed: {
    ...mapState({
      playerField:             (state: any) => state.ships.playerField,
      computerField:           (state: any) => state.ships.computerField,
      playerWinNumbers:        (state: any) => state.ships.playerWinNumbers,
      computerWinNumbers:      (state: any) => state.ships.computerWinNumbers,
      gameInProgress:          (state: any) => state.ships.gameInProgress,
      winFlag:                 (state: any) => state.ships.winFlag,
      totalShots:              (state: any) => state.ships.totalShots,
      cheatMode:               (state: any) => state.ships.cheatMode,
      cheatModeShown:          (state: any) => state.ships.cheatModeShown,
      cursorCheat:             (state: any) => state.ships.cursorCheat,
      cursorCheatShown:        (state: any) => state.ships.cursorCheatShown,
      statisticsObj:           (state: any) => state.ships.statisticsObj,
      statisticsShown:         (state: any) => state.ships.statisticsShown,
      roundNumber:             (state: any) => state.ships.roundNumber,
      canRoundIncrease:        (state: any) => state.ships.canRoundIncrease,
      playerShots:             (state: any) => state.ships.playerShots,
      playerSuccessfulShots:   (state: any) => state.ships.playerSuccessfulShots,
      playerMissedShots:       (state: any) => state.ships.playerMissedShots,
      playerLastShot:          (state: any) => state.ships.playerLastShot,
      computerShots:           (state: any) => state.ships.computerShots,
      computerSuccessfulShots: (state: any) => state.ships.computerSuccessfulShots,
      computerMissedShots:     (state: any) => state.ships.computerMissedShots,
      computerLastShot:        (state: any) => state.ships.computerLastShot,
      computerLastSuccessShot: (state: any) => state.ships.computerLastSuccessShot,
      moveBy:                  (state: any) => state.ships.moveBy,
      cellDictLetters:         (state: any) => state.ships.cellDictLetters,
      cellDictNumbers:         (state: any) => state.ships.cellDictNumbers, // юзается
      playerShips:             (state: any) => state.ships.playerShips,
      myAdjacentCells:         (state: any) => state.ships.myAdjacentCells,
      computerShips:           (state: any) => state.ships.computerShips,
      enemyAdjacentCells:      (state: any) => state.ships.enemyAdjacentCells,


    }),
    ...mapGetters({
      unShootedCellsPlayer:    'ships/unShootedCellsPlayer',
      unShootedCellsComputer:  'ships/unShootedCellsComputer',
      playerAccuracy:          'ships/playerAccuracy',
      computerAccuracy:        'ships/computerAccuracy',
    }),

  },

  watch: {
    moveBy: function () {
      if(this.moveBy === 'computer') {
        this.generateCelltoFire()
      }
    }
  },

  created():   void { this.createCellMask() },
  mounted():   void {
    this.getStatistics();
    // this.setBattleField()
  },
  unmounted(): void {
    this.reSetGameState()
  },

  props: {
    msg: String
  }

})

</script>




<style scoped lang="less">
  @baseColor: teal;
  @baseFontSize: 20px;
  @smallFontSize: 15px;
  @largeFontSize: 25px;


  .game-wrapper {
    outline: 2px solid @baseColor;
  }

  .header {
    min-height: 100px;
  }

  .base-font {
    font-size: @baseFontSize;
  }
  .small-font {
    font-size:  @smallFontSize;
  }

  .game-body {
    /*height: 600px;*/
    padding: 10px 0;
    outline: 2px solid @baseColor;
  }

  .flexed {
    display: flex;
  }

  .justifyed {
    justify-content: space-evenly;
    flex-wrap: wrap;
  }

  .centred {
    justify-content: space-evenly;
    align-items: center;
  }

  .columned {
    flex-direction: column;
  }


  .footer > div {
    width: 50%;
  }

  .alert {
    background: firebrick;
  }

  .silent {
    background: lightgreen;
  }


</style>
