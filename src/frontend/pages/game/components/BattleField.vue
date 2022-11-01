<template>
  <div class="game-field--wrapper"
       :class="[isPlayer ? 'game-field-player' : 'game-field-computer']"
  >
    <div class="game-field--header">
      <div class="cell centred"
           :class="[isPlayer ? 'player-colored' : 'computer-colored']"
           v-for="(_, number) in cellDictNumbers">{{ number }}
      </div>
    </div>
    <div class="game-field--navbar">
      <div class="cell centred"
           :class="[isPlayer ? 'player-colored' : 'computer-colored']"
           v-for="letter in cellDictNumbers">{{ letter.toUpperCase() }}
      </div>
    </div>
    <div class="game-field"
         :class="[isPlayer ? 'player-outline' : 'computer-outline']"
    >
      <div class="cell centred"
           :class="[
              isPlayer ? 'player-outline' : 'computer-outline',
              isPlayer ? 'player-cell'    : 'computer-cell',
              cell.isShip ? isPlayer ? 'playerShip' :  cheatMode ? 'enemyShip' : '' :'',
              (!cell.isAvaliable && !cell.isShip) ? isPlayer ? 'playerBorderCell': cheatMode ? 'computerBorderCell' : '' : '',
              (!cell.isShip && cell.shotted) && (cell.grid !== lastShot.grid) ? isPlayer ? 'playerCellShotted' : 'computerCellShotted' : '',
              (cell.isShip && cell.shotted)  && (cell.grid !== lastShot.grid) ? isPlayer ? 'playerShipShotted' : 'computerShipShotted' : '',
              cell.adjacentShown ? isPlayer ? 'playerAdjacentShowed' : 'computerAdjacentShowed' : '',
              (cell.isShip && cell.shotted) && cell.grid === lastShot.grid ? isPlayer ? 'playerShipLastShotted' : 'computerShipLastShotted' : '',
              cell.grid === lastShot?.grid ? isPlayer ? 'playerLastShotted' : 'computerLastShotted' : '',
              ]"
           v-for="cell in fieldOwnerObj"
           :id="`${cell.idx} ${operator}`"
           @click="isPlayer ? null : playerFire({cell, fireBy: operator})"
           @mouseover="mouseOver($event, operator, cell )"
           @mouseout="mouseOut(cell,    operator)"
      >
        {{ cell.grid.toUpperCase() }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "@vue/runtime-core";

  type Shooters_Type = 'player' | 'computer';
  type Ships_Types = 'skiffs' | 'brigs' | 'warships' | 'manowars';

  type ShipState_Type = { type: Ships_Types, alive: boolean, idx?: number, shipId: number }

  interface fieldCell {
    grid: string, idx: number,
    isShip: boolean,
    shipState?: ShipState_Type,
    isAvaliable: boolean,
    shotted: boolean,
    adjacentShown?: boolean
  }

  export default defineComponent({
    name: "BattleField",
    props: {
      operator:        { type: String,   required: true },
      playerFire:      { type: Function, required: true },
      fieldOwnerObj:   { type: Object,   required: true },
      fieldOwner:      { type: String,   required: true },
      lastShot:        { type: Object,   required: true },
      cellDictNumbers: { type: Object,   required: true },
      cursorCheat:     { type: Boolean,  required: true },
      cheatMode:       { type: Boolean,  required: true },
    },

    computed: {
      isPlayer: function () {
        return this.operator === 'player';
      }
    },

    methods: {
      mouseOver({target}: { target: HTMLDivElement }, fieldOwner: Shooters_Type, cell: fieldCell) {
        return (this.cursorCheat && fieldOwner === 'computer') ?
            this.mouseOverSmart(cell, fieldOwner) : this.mouseOverSimple(target, fieldOwner)
      },

      mouseOverSmart(cell: fieldCell, fieldOwner: Shooters_Type,) {

        const getEl = (el: string) => document.getElementById(el);

        let cellFinder = (point: number, fieldOwner: Shooters_Type) => {

          const el = getEl(`${point} ${fieldOwner}`);
          const adjacentCell = this.fieldOwnerObj[point];

          if (!el || !adjacentCell) {
            return
          }

          const enemyShip = adjacentCell.isShip ? 'enemyShip' : '';
          const computerBorderCell = (!adjacentCell.isAvaliable && !adjacentCell.isShip) ? 'computerBorderCell' : '';
          const classHover = fieldOwner === 'player' ? 'player-hovered' : 'computer-hovered';

          if (el) {
            return el.classList.add(enemyShip || computerBorderCell || classHover)
          }
        };

        const startPoint = cell.idx;
        const rightCell1 = (startPoint - 9), rightCell2 = (startPoint + 1), rightCell3 = (startPoint + 11);
        const leftCell1 = (startPoint - 11), leftCell2 = (startPoint - 1), leftCell3 = (startPoint + 9);

        if ((leftCell1 + 1) % 10) {
          cellFinder(leftCell1, fieldOwner)
        }
        if ((leftCell2 + 1) % 10) {
          cellFinder(leftCell2, fieldOwner)
        }
        if ((leftCell3 + 1) % 10) {
          cellFinder(leftCell3, fieldOwner)
        }

        cellFinder(startPoint - 10, fieldOwner); // верхняя
        cellFinder(startPoint, fieldOwner); // таргетная
        cellFinder(startPoint + 10, fieldOwner); // нижняя

        if (rightCell1 % 10) {
          cellFinder(rightCell1, fieldOwner)
        }
        if (rightCell2 % 10) {
          cellFinder(rightCell2, fieldOwner)
        }
        if (rightCell3 % 10) {
          cellFinder(rightCell3, fieldOwner)
        }

      },

      mouseOverSimple(target: HTMLDivElement, fieldOwner: Shooters_Type) {

        const getEl = (el: string) => document.getElementById(el);
        const classHover = fieldOwner === 'player' ? 'player-hovered' : 'computer-hovered';
        const arr = [...target.attributes[1].value.split(' ')];
        const startPoint = +arr[0];

        const rightCell1 = (startPoint - 9), rightCell2 = (startPoint + 1), rightCell3 = (startPoint + 11);
        const leftCell1 = (startPoint - 11), leftCell2 = (startPoint - 1), leftCell3 = (startPoint + 9);

        if (rightCell1 % 10) {
          getEl(`${rightCell1} ${arr[1]}`)?.classList.add(classHover)
        }
        if (rightCell2 % 10) {
          getEl(`${rightCell2} ${arr[1]}`)?.classList.add(classHover)
        }
        if (rightCell3 % 10) {
          getEl(`${rightCell3} ${arr[1]}`)?.classList.add(classHover)
        }
        getEl(`${startPoint - 10} ${arr[1]}`)?.classList.add(classHover);
        target.classList.add(classHover);
        getEl(`${startPoint + 10} ${arr[1]}`)?.classList.add(classHover);
        if ((leftCell1 + 1) % 10) {
          getEl(`${leftCell1} ${arr[1]}`)?.classList.add(classHover)
        }
        if ((leftCell2 + 1) % 10) {
          getEl(`${leftCell2} ${arr[1]}`)?.classList.add(classHover)
        }
        if ((leftCell3 + 1) % 10) {
          getEl(`${leftCell3} ${arr[1]}`)?.classList.add(classHover)
        }
      },

      pointsCalc(startPoint: number) {
        return [startPoint - 11, startPoint - 10, startPoint - 9, startPoint - 1, startPoint, startPoint + 1, startPoint + 9, startPoint + 10, startPoint + 11]
      },

      mouseOut(cell: fieldCell, fieldOwner: Shooters_Type) {

        const classHover = fieldOwner === 'player' ? 'player-hovered' : 'computer-hovered';
        const ship = 'enemyShip';
        const borderCell = 'computerBorderCell';
        const points = this.pointsCalc(cell.idx);

        const getEl = (el: string) => document.getElementById(el);

        let classRemover = (point: number) => {
          let el = getEl(`${point} ${fieldOwner}`)?.classList;
          el?.remove(classHover);
          !this.cheatMode && el?.remove(ship);
          !this.cheatMode && el?.remove(borderCell);
        };

        for (let i = 0; i <= points.length; i++) {
          classRemover(points[i])
        }
      },
    },

    updated(): void {
      // console.log(this)
    }


  })
</script>

<style scoped lang="less">

  @baseFontSize: 20px;

  @playerColor: dodgerblue;
  @playerBorderCell: #d4ffb3;
  @playerHoverTarget: #36f050;
  @playerHovered: aquamarine;
  @playerAdjacentShowed: darkolivegreen;
  @playerShipShotted: #212d57;
  @playerCellShotted: #5a0309;


  @computerColor: firebrick;
  @computerBorderCell: bisque;
  @computerHoverTarget: red;
  @computerHovered: #ff7d6c;
  @computerAdjacentShowed: rgba(103, 27, 33, 0.87);
  @computerShipShotted: #570e0b;
  @computerCellShotted: #2b6f3b;

  @fieldScale: 390px;


  .centred {
    justify-content: space-evenly;
    align-items: center;
  }

  .game-field--wrapper {
    height: calc(@fieldScale + 10);
    width: calc(@fieldScale + 10);
    display: grid;

    grid-template-areas: 'header header' 'navbar content';

    grid-template-rows: calc(@fieldScale / 10) @fieldScale;
    grid-template-columns: calc(@fieldScale / 10) @fieldScale;
    grid-gap: 10px;
  }

  .game-field-player {
    outline: 3px solid @playerColor;
  }

  .game-field-computer {
    outline: 3px solid @computerColor;
  }

  .game-field--header {
    grid-area: header;
    display: flex;
    justify-content: end;
  }

  .game-field--navbar {
    grid-area: navbar;
    display: flex;
    flex-direction: column;
  }

  .game-field {
    height: @fieldScale;
    width: @fieldScale;
    display: flex;
    flex-wrap: wrap;
    grid-area: content;
  }

  .cell {
    width: calc(@fieldScale / 10);
    height: calc(@fieldScale / 10);
    display: flex;
  }


  .player-cell:hover {
    cursor: default;
    /*<!--background: @playerHoverTarget;-->*/
  }

  .computer-cell:hover {
    cursor: default;
    /*<!--background: @computerHoverTarget;-->*/
  }

  .footer > div {
    width: 50%;
  }

  .flexed {
    display: flex;
  }

  .player-outline {
    outline: 1px solid @playerColor;
  }

  .computer-outline {
    outline: 1px solid @computerColor;
  }

  .player-colored {
    color: @playerColor;
    font-weight: 700;
  }

  .computer-colored {
    color: @computerColor;
    font-weight: 700;
  }


  .playerBorderCell {
    background: @playerBorderCell;
  }

  .computerBorderCell {
    background: @computerBorderCell;
  }

  .player-hovered {
    background: @playerHovered;
  }

  .computer-hovered {
    background: @computerHovered;
  }

  .playerShip {
    background-color: @playerColor;
  }

  .enemyShip {
    background: @computerColor;
  }

  .playerAdjacentShowed {
    background: @playerAdjacentShowed;
  }

  .computerAdjacentShowed {
    background: @computerAdjacentShowed;
  }

  .playerShipShotted {
    background: @playerShipShotted;
    position: relative;
  }

  .computerShipShotted {
    background: @computerShipShotted;
  }

  .playerCellShotted {
    position: relative;
  }

  .playerShipShotted::after,
  .playerCellShotted::after {
    background: @playerCellShotted;
    content: '';
    height: 20%;
    width: 20%;
    position: absolute;
    top: 10%;
    left: 10%;
    border-radius: 50%;
  }

  .playerShipLastShotted {
    position: relative;
    background: @playerShipShotted;
  }

  .playerLastShotted {
    position: relative;
  }

  .playerShipLastShotted::after,
  .playerLastShotted::after {
    color: red;
    font-size: @baseFontSize;
    font-weight: 600;
    content: '♕';
    /*content: '★';*/
    position: absolute;
    top: -5%;
    left: 5%;
    border-radius: 50%;
  }


  .computerShipShotted,
  .computerCellShotted,
  .computerLastShotted {
    position: relative;
  }


  .computerShipShotted::after,
  .computerCellShotted::after {
    background: @computerCellShotted;
    content: '';
    height: 20%;
    width: 20%;
    position: absolute;
    top: 10%;
    left: 10%;
    border-radius: 50%;
  }


  .computerShipLastShotted {
    position: relative;
    background: @computerShipShotted;
  }

  .computerShipLastShotted::after,
  .computerLastShotted::after {
    color: @computerCellShotted;
    font-size: @baseFontSize;
    font-weight: 600;
    /*content: '♕';*/
    content: '★';
    position: absolute;
    top: -5%;
    left: 5%;
    border-radius: 50%;
  }


</style>