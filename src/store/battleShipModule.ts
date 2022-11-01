export interface fieldCell {
  grid: string,
  idx: number,
  isShip: boolean,
  shipState?: ShipState_Type,
  isAvaliable: boolean,
  shotted: boolean,
  adjacentShown?: boolean
}

export type Shooters_Type = 'player' | 'computer';

export type Ships_Types = 'skiffs' | 'brigs' | 'warships' | 'manowars';
type GameFields_Type = 'playerField' | 'computerField';
export type ShipState_Type = { type: Ships_Types, alive: boolean, idx?: number, shipId: number }
export type ShipOwner_Type = 'playerShips' | 'computerShips'
export type ShipsDescr_Type = {
  skiffs: ShipState_Type[][]
  brigs: ShipState_Type[][]
  warships: ShipState_Type[][]
  manowars: ShipState_Type[][]
}
type AdjacentCells_Type = {
  [key: number]: { cellIdx: number, shown: boolean, shipType: Ships_Types }[]
}
type ServeInfoShot_Type = {
  idx?: number,
  state?: 'destroyed' | 'damaged' | undefined,
  direction?: 'column' | 'row' | undefined,
  shipArr?: number[],
}

type PersonStat_Type = {
  totalShots?:     number,
  successfulShots: number,
  missedShots:     number,
  accuracy?:       number,
  winNumbers?:     number,
  roundNum?:       number,
}

type DetailsType = {
  roundNumber: number, player: PersonStat_Type, computer: PersonStat_Type,
}

type Statistics_Type = {
  totalRounds: number,
  totalScore:  number,
  totalShots:  number,
  player:   PersonStat_Type,
  computer: PersonStat_Type,
  rounds:   DetailsType []
}

type AdjacentOwner_Type = 'myAdjacentCells' | 'enemyAdjacentCells'

export type GameState_Type = typeof initState;


const initStats = {
      totalRounds: 0 as number,
      totalShots:  0 as number,
      player:   {
        accuracy: 0 as number,
        missedShots: 0 as number,
        successfulShots: 0 as number,
        totalShots: 0 as number,
        winNumbers: 0 as number,
      },
      computer: {
        accuracy: 0 as number,
        missedShots: 0 as number,
        successfulShots: 0 as number,
        totalShots: 0 as number,
        winNumbers: 0 as number,
      },
      rounds:   [] as DetailsType[],
    } as Statistics_Type

const initState = {
  playerField:              [] as fieldCell[],
  computerField:            [] as fieldCell[],
  playerWinNumbers:         0 as number,
  computerWinNumbers:       0 as number,
  gameInProgress:           false as boolean,
  winFlag:                  undefined as boolean | undefined,
  totalShots:               0 as number,
  cheatMode:                true as boolean,
  cheatModeShown:           true as boolean,
  cursorCheat:              false as boolean,
  cursorCheatShown:         false as boolean,
  statisticsObj:            {...initStats} as Statistics_Type,
  statisticsShown:          false as boolean,
  roundNumber:              1 as number,
  canRoundIncrease:         false as boolean,
  playerShots:              0 as number,
  playerSuccessfulShots:    0 as number,
  playerMissedShots:        0 as number,
  playerLastShot:           {} as fieldCell,
  computerShots:            0 as number,
  computerSuccessfulShots:  0 as number,
  computerMissedShots:      0 as number,
  computerLastShot:         {} as fieldCell,
  computerLastSuccessShot:  {shipArr: []} as unknown as ServeInfoShot_Type,
  moveBy:                   'player' as Shooters_Type,
  cellDictNumbers:          {1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h', 9: 'i', 10: 'j',} as { [key : number]: string},  // юзается
  playerShips:              {
    skiffs:   [],
    brigs:    [],
    warships: [],
    manowars: [],
  } as ShipsDescr_Type,
  myAdjacentCells:          {} as AdjacentCells_Type,
  computerShips:            {
    skiffs: [],
    brigs: [],
    warships: [],
    manowars: [],
  } as ShipsDescr_Type,
  enemyAdjacentCells:       {} as AdjacentCells_Type,
};

export const battleShipModule = {
  state: (): GameState_Type => initState,

  getters: {
    damageCalc: (state: GameState_Type) => ({shipsOwner, shipType, i} :
        {shipsOwner: ShipOwner_Type, shipType: Ships_Types, i: number}) : number => {
      return state[shipsOwner][shipType][i].filter((el: any) => !el.alive).length;
    },
    unShootedSells: (state: GameState_Type) => (gameField: GameFields_Type) => {
      return state[gameField].filter((el: fieldCell) => !el.adjacentShown && !el.shotted )
    },
    unShootedCellsPlayer:  (_: GameState_Type, getters: any) => { return getters.unShootedSells('playerField'  )},
    unShootedCellsComputer:(_: GameState_Type, getters: any) => { return getters.unShootedSells('computerField')},
    playerAccuracy:   (state: GameState_Type) =>  { return Math.round(state.playerSuccessfulShots   / state.playerShots   * 100) || 0 },
    computerAccuracy: (state: GameState_Type) =>  { return Math.round(state.computerSuccessfulShots / state.computerShots * 100) || 0 },


  },

  mutations: {

    createCellMask (state: GameState_Type) {
      let counter = 0;
      for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 10; j++) {
          state.playerField.push({grid: `${(state.cellDictNumbers as any)[i]} ${j}`,  isShip: false, idx: counter, isAvaliable: true, shotted: false});
          state.computerField.push({grid: `${(state.cellDictNumbers as any)[i]} ${j}`,isShip: false, idx: counter, isAvaliable: true, shotted: false});
          ++counter
        }
      }
    },

    reSetGameState (state: GameState_Type) {
      state.playerField             = [];
      state.computerField           = [];
      state.totalShots              = 0;
      state.playerShots             = 0;
      state.playerSuccessfulShots   = 0;
      state.playerMissedShots       = 0;
      state.playerLastShot          = {}  as fieldCell;
      state.computerShots           = 0;
      state.computerSuccessfulShots = 0;
      state.computerLastSuccessShot = { shipArr: [] };
      state.computerMissedShots     = 0;
      state.computerLastShot        = {}  as fieldCell;
      state.moveBy                  = 'player';

      state.playerShips = {
        skiffs:   [],
        brigs:    [],
        warships: [],
        manowars: [],
      };
      state.myAdjacentCells         = {};
      state.computerShips = {
        skiffs:   [],
        brigs:    [],
        warships: [],
        manowars: [],
      };
      state.enemyAdjacentCells      = {};
      state.cursorCheat             = false;
      state.cheatMode               = false;
      state.gameInProgress          = false;

    },

    setRoundNum (state: GameState_Type, number: number) {
      state.roundNumber = number
    },

    setShipsArr (state: GameState_Type, arg: {field: ShipOwner_Type, shipType: Ships_Types, shipsArr: ShipsDescr_Type}): ShipsDescr_Type {
      //@ts-ignore
      return state[arg.field][arg.shipType] = arg.shipsArr
    },

    setAdjacentCells(state: GameState_Type, servInfo: {adjacentOwner: AdjacentOwner_Type, adjacentCells: AdjacentCells_Type }  ) {
      return state[servInfo.adjacentOwner] = servInfo.adjacentCells
    },

    setMove  (state: GameState_Type, moveOwner: Shooters_Type) {
      state.moveBy = moveOwner;
    },

    openFire (state: GameState_Type,  target: {cell: fieldCell, fireBy: Shooters_Type} ) {
      let {cell, fireBy} = target;
      state.totalShots ++;

      const fireFlag = fireBy === 'player';

      const shipsOwner        = fireFlag  ? 'playerShips'           : 'computerShips',
          adjacentCellsOwner  = fireFlag  ? 'myAdjacentCells'       : 'enemyAdjacentCells',
          fieldOwner          = fireFlag  ? 'playerField'           : 'computerField',
          missedShotsOwner    = !fireFlag ? 'playerMissedShots'     : 'computerMissedShots',
          successShotsOwner   = !fireFlag ? 'playerSuccessfulShots' : 'computerSuccessfulShots',
          shotsOwner          = !fireFlag ? 'playerShots'           : 'computerShots',
          lastShotBy          = !fireFlag ? 'playerLastShot'        : 'computerLastShot';

      const fieldCopy      = JSON.parse(JSON.stringify([...state[fieldOwner] ]));
      const cellCopy       = JSON.parse(JSON.stringify({...cell, shotted: true}));
      let successShotCopy  = JSON.parse(JSON.stringify({...state.computerLastSuccessShot}));

      state[ lastShotBy ] = cell;

      state[ shotsOwner ] ++;

      if(cell.shipState) {
        state[successShotsOwner] ++;

        fieldCopy[cellCopy.idx] = {... fieldCopy[cellCopy.idx], shotted: true,  shipState: {... fieldCopy[cellCopy.idx].shipState, alive: false }  };

        const { type, shipId } : { type: Ships_Types, shipId: number } = cellCopy.shipState;

        const dataShipIdx = state[shipsOwner][type].findIndex((el: any) => el[0].shipId === shipId);

        const dataShipEl  = state[shipsOwner][type][dataShipIdx].findIndex(({idx}: any) => idx === cellCopy.idx );

        state[shipsOwner][type][dataShipIdx][dataShipEl].alive = false;

        const isDestroyed = fieldCopy.filter(({shipState}: fieldCell) => shipState?.shipId === shipId).every(({shipState}: fieldCell) => !shipState!.alive );

        if(isDestroyed) {

          if(fireFlag) { state.computerLastSuccessShot = {...successShotCopy, direction: undefined, idx: cellCopy.idx, state: 'destroyed', shipArr: []} };

          state[adjacentCellsOwner][shipId].forEach(({cellIdx}: any) => fieldCopy[cellIdx] = {...fieldCopy[cellIdx], adjacentShown: true} );
          state[fieldOwner] = fieldCopy;
          return

        } else {

          if(fireFlag) {
            successShotCopy.idx = cellCopy.idx;
            successShotCopy.state = 'damaged';
            successShotCopy.shipArr.push(cellCopy.idx)
            state.computerLastSuccessShot = successShotCopy
          }

          cellCopy.shipState!.alive = false;
          state[fieldOwner][cellCopy.idx] = cellCopy
          return
        }
      }
      else {
        state[ missedShotsOwner ] ++;
        state[ fieldOwner ][cellCopy.idx] = cellCopy
        return
      }

    },

    getStatistics(state: GameState_Type) {
      let statObj = window.localStorage.getItem('battleShipStat')
      if(statObj !== null) {
        console.log(JSON.parse(statObj))
        let res = JSON.parse(statObj)
        state.roundNumber = res.totalRounds
        state.statisticsObj = res;

        if(state.statisticsObj.totalShots !== 1) {
          state.canRoundIncrease = true
        }

      }
    },

    gameStopped (state: GameState_Type, flag: boolean) {
      console.log('stopped')
      state.gameInProgress = false;
      flag ? state.playerWinNumbers ++ : state.computerWinNumbers ++;
      state.winFlag = flag;
      state.cheatMode = true;

      // const statCopy = {...state.statisticsObj};
      const statCopy = JSON.parse(JSON.stringify({...state.statisticsObj}));


      statCopy.totalShots += state.totalShots;
      statCopy.totalRounds = state.roundNumber;

      flag ? statCopy.player.winNumbers! ++ : statCopy.computer.winNumbers! ++;

      statCopy.player.totalShots!       += state.playerShots;
      statCopy.player.successfulShots   += state.playerSuccessfulShots;
      statCopy.player.missedShots       += state.playerMissedShots;

      statCopy.computer.totalShots!     += state.computerShots;
      statCopy.computer.successfulShots += state.computerSuccessfulShots;
      statCopy.computer.missedShots     += state.computerMissedShots;

      const roundStat = {
        roundNumber: state.roundNumber,
        player: {
          totalShots:       state.playerShots,
          successfulShots:  state.playerSuccessfulShots,
          missedShots:      state.playerMissedShots,
        },
        computer: {
          totalShots:       state.computerShots,
          successfulShots:  state.computerSuccessfulShots,
          missedShots:      state.computerMissedShots,
        }
      };

      statCopy.rounds.unshift(roundStat);

      state.statisticsObj = statCopy;
      window.localStorage.setItem('battleShipStat', JSON.stringify(statCopy))
      state.canRoundIncrease = true;
    },

    cheatEvent (state: GameState_Type, event:{cursorCheat: boolean, cheatMode: boolean}) {
      if(event.cursorCheat) { state.cursorCheatShown = true }
      if(event.cheatMode)   { state.cheatModeShown   = true }
    },

    cheatModeToggler (state: GameState_Type) { state.cheatMode = !state.cheatMode },

    cursorCheatToggler (state: GameState_Type) { state.cursorCheat = !state.cursorCheat },

    setStatsClear( state: GameState_Type ) {
      console.log('cleared');
      window.localStorage.clear();
      state.statisticsObj = {...initStats};
    },

    startGame (state: GameState_Type) {
      state.gameInProgress = true;
    }

  },

  actions: {

    shipGenerator({state, commit, dispatch}: any,  {size, shipType, gameField}
        : { size: number, shipType: Ships_Types, gameField: GameFields_Type }) {


      const orientation = Math.random() < 0.5; // горизонтально или вертикально
      const startPoint  = Math.floor(Math.random() * 100);

      const fieldFlag = gameField === 'playerField';

      const gameFieldCopy = [...state[gameField]];

      let secondPoint: number = startPoint + (orientation ? 1 : 10);
      let thirdPoint:  number = startPoint + (orientation ? 2 : 20);
      let fourthPoint: number = startPoint + (orientation ? 3 : 30);

      switch (size) {
        case 1:  { secondPoint = 0; thirdPoint = 0; fourthPoint = 0;  break; }
        case 2:  { thirdPoint  = 0; fourthPoint = 0;  break;}
        case 3:  { fourthPoint = 0; break; }
        default: { break; }
      }

      if(
          !gameFieldCopy[startPoint].isAvaliable
          || ( secondPoint && (!gameFieldCopy[secondPoint]?.isAvaliable || secondPoint % 10 === 0 || secondPoint > 99 ) )
          || ( thirdPoint  && (!gameFieldCopy[thirdPoint]?.isAvaliable  || thirdPoint  % 10 === 0 || thirdPoint  > 99 ) )
          || ( fourthPoint && (!gameFieldCopy[fourthPoint]?.isAvaliable || fourthPoint % 10 === 0 || fourthPoint > 99 ) )
      )
      {
        return dispatch('shipGenerator', {size, shipType, gameField})
      }

      const shipId = Math.random();

      const shipState = { isShip: true, isAvaliable: false, shipState: { type: shipType, alive: true, shipId } };

      const shipsArrCopy = [...state[fieldFlag ? 'playerShips' : 'computerShips'][shipType] ];

      const shipStatArr: ShipState_Type[] = [];

                         state[gameField][startPoint]  = {...gameFieldCopy[startPoint],  ...shipState}; shipStatArr.push({shipId, type: shipType, alive: true, idx: startPoint });
      if (secondPoint) { state[gameField][secondPoint] = {...gameFieldCopy[secondPoint], ...shipState}; shipStatArr.push({shipId, type: shipType, alive: true, idx: secondPoint })}
      if (thirdPoint)  { state[gameField][thirdPoint]  = {...gameFieldCopy[thirdPoint],  ...shipState}; shipStatArr.push({shipId, type: shipType, alive: true, idx: thirdPoint })}
      if (fourthPoint) { state[gameField][fourthPoint] = {...gameFieldCopy[fourthPoint], ...shipState}; shipStatArr.push({shipId, type: shipType, alive: true, idx: fourthPoint })}


      shipsArrCopy.push(shipStatArr);

      commit('setShipsArr', {field: fieldFlag ? 'playerShips' : 'computerShips', shipType, shipsArr: shipsArrCopy });


      const leftCell1  = (startPoint -11),
          leftCell2  = (startPoint - 1),
          leftCell3  = (startPoint + 9),
          leftCell4  = orientation ? null : secondPoint ? secondPoint + 9 : null,
          leftCell5  = orientation ? null : thirdPoint  ? thirdPoint  + 9 : null,
          leftCell6  = orientation ? null : fourthPoint ? fourthPoint + 9 : null;

      const somePoint = fourthPoint || thirdPoint || secondPoint || startPoint || 0;

      const rightCell1 =  orientation ?  somePoint  - 9 : ( startPoint -  9 ),
          rightCell2 =  orientation ?  somePoint  + 1 : ( startPoint +  1 ),
          rightCell3 =  orientation ?  somePoint + 11 : ( startPoint + 11 ),
          rightCell4 =  orientation ? null : ( secondPoint ? secondPoint + 11 : null ),
          rightCell5 =  orientation ? null : ( thirdPoint  ? thirdPoint  + 11 : null ),
          rightCell6 =  orientation ? null : ( fourthPoint ? fourthPoint + 11 : null );

      const topCell1   = startPoint - 10,
          topCell2   = orientation ? ( secondPoint ? secondPoint - 10 : null) : null,
          topCell3   = orientation ? ( thirdPoint  ? thirdPoint  - 10 : null) : null,
          topCell4   = orientation ? ( fourthPoint ? fourthPoint - 10 : null) : null;


      const bottomCell1 = orientation ? startPoint + 10 :                  (!secondPoint && !thirdPoint && !fourthPoint) ?  startPoint  + 10 : null,
          bottomCell2 = (orientation && secondPoint) ? secondPoint + 10 :  (secondPoint && !thirdPoint && !fourthPoint)  ?  secondPoint + 10 : null,
          bottomCell3 = (orientation && thirdPoint ) ? thirdPoint  + 10 :  (thirdPoint && !fourthPoint)                  ?  thirdPoint  + 10 : null,
          bottomCell4 = (orientation && fourthPoint) ? fourthPoint + 10 :  (fourthPoint ? fourthPoint + 10 : null);

      const adjacentCopy =  {...state[fieldFlag ? 'myAdjacentCells' : 'enemyAdjacentCells'], [shipId]: []};


      if((leftCell1+1)%10 && leftCell1 >= 0)               { gameFieldCopy[leftCell1].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: leftCell1, shown: false, shipType}]}
      if((leftCell2+1)%10 && leftCell2 > -1)               { gameFieldCopy[leftCell2].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: leftCell2, shown: false, shipType}]}
      if((leftCell3+1)%10 && leftCell3 < 100)              { gameFieldCopy[leftCell3].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: leftCell3, shown: false, shipType}]}
      if(leftCell4 && (leftCell4+1)%10 && leftCell4 < 100) { gameFieldCopy[leftCell4].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: leftCell4, shown: false, shipType}]}
      if(leftCell5 && (leftCell5+1)%10 && leftCell5 < 100) { gameFieldCopy[leftCell5].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: leftCell5, shown: false, shipType}]}
      if(leftCell6 && (leftCell6+1)%10 && leftCell6 < 100) { gameFieldCopy[leftCell6].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: leftCell6, shown: false, shipType}]}


      if(topCell1 > -1)                { gameFieldCopy[topCell1].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: topCell1, shown: false, shipType}]}
      if(topCell2 && (topCell2 > -1))  { gameFieldCopy[topCell2].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: topCell2, shown: false, shipType}]}
      if(topCell3 && (topCell3 > -1))  { gameFieldCopy[topCell3].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: topCell3, shown: false, shipType}]}
      if(topCell4 && (topCell4 > -1))  { gameFieldCopy[topCell4].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: topCell4, shown: false, shipType}]}


      if(bottomCell1 && (bottomCell1 < 100))             { gameFieldCopy[bottomCell1].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: bottomCell1, shown: false, shipType}]}
      if(bottomCell2 && (bottomCell2 < 100)) { gameFieldCopy[bottomCell2].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: bottomCell2, shown: false, shipType}]}
      if(bottomCell3 && (bottomCell3 < 100)) { gameFieldCopy[bottomCell3].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: bottomCell3, shown: false, shipType}]}
      if(bottomCell4 && (bottomCell4 < 100)) { gameFieldCopy[bottomCell4].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: bottomCell4, shown: false, shipType}]}


      if(rightCell1 % 10 && rightCell1 > 0 )                   { gameFieldCopy[rightCell1].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: rightCell1, shown: false, shipType: shipType}]}
      if(rightCell2 % 10)                                      { gameFieldCopy[rightCell2].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: rightCell2, shown: false, shipType: shipType}]}
      if(rightCell3 % 10 && rightCell3 <= 100)                 { gameFieldCopy[rightCell3].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: rightCell3, shown: false, shipType: shipType}]}
      if(rightCell4 && (rightCell4 % 10 && rightCell4 <= 100)) { gameFieldCopy[rightCell4].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: rightCell4, shown: false, shipType: shipType}]}
      if(rightCell5 && (rightCell5 % 10 && rightCell5 <= 100)) { gameFieldCopy[rightCell5].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: rightCell5, shown: false, shipType: shipType}]}
      if(rightCell6 && (rightCell6 % 10 && rightCell6 <= 100)) { gameFieldCopy[rightCell6].isAvaliable = false;
        adjacentCopy[shipId] = [...adjacentCopy[shipId], {cellIdx: rightCell6, shown: false, shipType: shipType}]}

      commit('setAdjacentCells',  {adjacentOwner: fieldFlag ? 'myAdjacentCells' : 'enemyAdjacentCells', adjacentCells: adjacentCopy })

    },

    setBattleField ({dispatch}: any) {
      for(let x = 1; x <= 1; x++) {
        dispatch('shipGenerator', {size: 4, shipType: 'manowars', gameField:  'playerField'});
        dispatch('shipGenerator', {size: 4, shipType: 'manowars', gameField: 'computerField'});
      }

      for(let x = 1; x <= 2; x++) {
        dispatch('shipGenerator', {size: 3, shipType: 'warships',  gameField: 'playerField'});
        dispatch('shipGenerator', {size: 3, shipType: 'warships',  gameField: 'computerField'});
      }

      for(let x = 1; x <= 3; x++) {
        dispatch('shipGenerator', {size: 2, shipType: 'brigs',  gameField:  'playerField'});
        dispatch('shipGenerator', {size: 2, shipType: 'brigs',  gameField:  'computerField'});
      }

      for(let x = 1; x <= 4; x++) {
        dispatch('shipGenerator', {size: 1, shipType: 'skiffs',  gameField:  'playerField'});
        dispatch('shipGenerator', {size: 1, shipType: 'skiffs',  gameField:  'computerField'});
      }

    },

    setInitGameState({commit}: any) {
      commit('reSetGameState');
      commit('createCellMask');
    },

    restartGame({state, commit, dispatch}: any) {
      if (state.canRoundIncrease) {
        commit('setRoundNum', state.roundNumber + 1);
      };
      dispatch('setInitGameState');  // todo: МБ добавить проверку на необходимость ресета
      dispatch('setBattleField');
      commit('startGame');

    },


    playerFire({ state, commit }: any, {cell, fireBy}: any)  {
      if( cell.shotted || cell.adjacentShown || !state.gameInProgress  ) { return }
      commit('openFire', {cell, fireBy});
      commit('setMove', fireBy)
    },

    generateCelltoFire({state, getters, commit}: any) {

      let cellIdx: number, selectedCell;
      let successShotCopy = {...state.computerLastSuccessShot};

      let fireCorrector = (shotIdx: number, firstShotIdx: number = -1): fieldCell => {
        const decade = (arg: number) => arg.toString().length === 1 ? '0' : arg.toString().substring(0, 1); //  '0'|| '1' || '2' ..., || '9'

        const crossCells = [
          successShotCopy.direction === 'row'    ? undefined : state.playerField[shotIdx - 10],
          successShotCopy.direction === 'column' ? undefined : decade(shotIdx) === decade(shotIdx - 1) ? state.playerField[shotIdx - 1] : undefined,
          successShotCopy.direction === 'column' ? undefined : decade(shotIdx) === decade(shotIdx + 1) ? state.playerField[shotIdx + 1] : undefined,
          successShotCopy.direction === 'row'    ? undefined : state.playerField[shotIdx + 10],
        ].filter((el) => el && !el.shotted && !el.adjacentShown);

        if(!crossCells.length && firstShotIdx !== -1) {
          return selectedCell = fireCorrector(firstShotIdx, -1)
        }

        const rand = Math.floor(Math.random() * crossCells.length);
        cellIdx = crossCells[rand]!.idx;

        cellIdx = getters.unShootedCellsPlayer.findIndex((el: fieldCell) => el.idx === cellIdx);

        return getters.unShootedCellsPlayer[cellIdx];
      };


      if(successShotCopy.state === 'damaged' && successShotCopy.shipArr!.length >= 2 ) { // определяем ориентировку корабля
        const [i1, i2] = successShotCopy.shipArr!;
        successShotCopy.direction =  (i1+1 === i2) || (i1-1 === i2)  ?  'row' : 'column';
        selectedCell = fireCorrector(successShotCopy.idx!, i1)
      }

      else if (successShotCopy.state === 'damaged' && !state.computerLastShot.isShip) { // попал, затем промазал
        selectedCell = fireCorrector(successShotCopy.idx!, -1)
      }

      else if (successShotCopy.state === 'damaged') { // первичное попадание
        selectedCell = fireCorrector(state.computerLastShot.idx, -1)
      }
      else {
        cellIdx = Math.floor(Math.random() * getters.unShootedCellsPlayer.length );
        selectedCell = getters.unShootedCellsPlayer[cellIdx];
      }

      state.computerLastSuccessShot = successShotCopy;
      commit('openFire', { cell: selectedCell, fireBy: 'player' } );
      state.moveBy = 'player';
    },

  },


  namespaced: true

};