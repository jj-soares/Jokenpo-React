import * as C from './style'
import { Input } from './components/input';
import { Button } from './components/button';
import { Score } from './components/score';
import { ActionsGame } from './components/action-game';
import { Modal } from './components/modal';
import { useEffect, useState } from 'react';

const messages = {
  rules: {
    title: 'Regras',
    message:
      'Jo ken pô, é um jogo em que as pessoas jogam com as mãos, escolhendo entre pedra (mão fechada), papel (mão espalmada) e tesoura (dois dedos a frente). O jogo é similar ao "par ou ímpar", porém com uma variável a mais. E funciona assim: Cada jogador escolhe uma opção. A tesoura corta o papel, mas quebra com a pedra; o papel embrulha a pedra, mas é cortado pela tesoura e a pedra quebra a tesoura e é embrulhada pelo papel. O desafio aqui é vencer o computador 10 vezes! Faça a sua escolha e boa sorte!'
  },
  user: {
    title: 'Usuário',
    message: 'Preencha o nome do Jogador'
  },
  computerWin: {
    title: 'Que Pena ',
    message: 'Não foi dessa vez, mas não desanime. Tente novamente!!'
  },
  playerWin: {
    title: 'Parabéns',
    message: 'Você foi Incrivel, fez um bom jogo!! '
  }
}

const valueTypeEnum = {
  ROCK: 1,
  PAPER: 2,
  SCISSORS: 3
}


const actions = [{
  value: 1,
  label: '👊🏾',
  description: 'Rock'
},
{
  value: 2,
  label: '🖐🏾',
  description: 'Paper'
},
{
  value: 3,
  label: '✌🏾',
  description: 'Scissors'
}]


function App() {
  const [titleModal, setTitleModal] = useState('')
  const [messageModal, setmessageModal] = useState('')
  const [open, setOpen] = useState(false)
  const [scorePlayerValue, setScorePlayerValue] = useState(0)
  const [scoreComputerValue, setScoreComputerValue] = useState(0)
  const [userAction, setUserAction] = useState('❓')
  const [computerAction, setComputerAction] = useState('❓')
  const [userName, setUserName] = useState('JOGADOR')
  const [playGame, setPlayGame] = useState(false)
  const [textGame, setTextGame] = useState('Iniciar Jogo!!')


  const SCORE_TO_WIN = 10

  const handleOpenModal = (type) => {
    if (!type) {
      setOpen(false)
      setTitleModal('')
      setmessageModal('')
      return
    }

    setTitleModal(messages?.[type]?.title)
    setmessageModal(messages?.[type]?.message)
    setOpen(true)
  }

  const randomActionComputer = () => {
    const number = Math.floor(Math.random() * actions.length)
    return actions[number]
  }


  const handleClick = (value) => {
    setUserAction(value.label)
    const actionComputer = randomActionComputer()
    setComputerAction(actionComputer.label)
    checkWinner(value.value, actionComputer.value)
  }

  const checkWinner = (playerValue, computerValue) => {
    const playerRockWin = playerValue === valueTypeEnum.ROCK && computerValue === valueTypeEnum.SCISSORS
    const playerPaperWin = playerValue === valueTypeEnum.PAPER && computerValue === valueTypeEnum.ROCK
    const playerScissorsWin = playerValue === valueTypeEnum.SCISSORS && computerValue === valueTypeEnum.PAPER

    const drawerResult = playerValue === computerValue

    const playerWin = playerPaperWin || playerRockWin || playerScissorsWin

    if (drawerResult) return (setTextGame('Empate jogue novamente! '))
    if (playerWin) {
      setScorePlayerValue((state) => state + 1)
      return setTextGame('Vitoria jogue novamente!')
    }
    setScoreComputerValue((state) => state + 1)
    return setTextGame('Derrota jogue novamente"')
  }

  const handleUserName = (value) => {
    if (!value) return setUserName('JOGADOR')
    setUserName(value)

  }
  const startGame = () => {
    if (userName === 'JOGADOR') {
      handleOpenModal('user')
      return
    }
    if(playGame) return resetValue()
    setPlayGame(true)
  }

  const resetValue = () => {
    setTextGame('Iniciar o jogo ! ')
    setPlayGame(false)
    setScorePlayerValue(0)
    setScoreComputerValue(0)
    setUserAction('❓')
    setComputerAction('❓')
  }

  useEffect(() => {
    const checkVitory = () => {
      const playerWin = scorePlayerValue === SCORE_TO_WIN
      const computerWin = scoreComputerValue === SCORE_TO_WIN
      if (playerWin) return handleOpenModal('playerWin')
      if (computerWin) return handleOpenModal('computerWin')
    }

    checkVitory()
  }, [scorePlayerValue, scoreComputerValue])


  return (
    <C.Container>
      <C.Flex direction='column'>

        <C.Typography fontWeight='400' size='32px' lineHeight='48px'>JO KEN PO</C.Typography>

        <Input placeholder={'Digite o nome do Jogador'} onChange={(value) => handleUserName(value)} />

        <Button onClick={startGame}>{playGame ? 'Reiniciar' : 'Iniciar'}</Button>

        <Score userName={userName} scorePlayer={scorePlayerValue} scoreComputer={scoreComputerValue} />

        <C.Spacer margin='10px' />
        <C.Flex justify='space-around'>
          <C.Typography size='32px' > {userAction}</C.Typography>

          <C.Typography size='32px' > {computerAction}</C.Typography>

        </C.Flex>

        <C.Flex direction='column' gap='0px'>
          <C.Typography > {textGame}</C.Typography>

          <C.Rules onClick={() => handleOpenModal('rules')} > Regras</C.Rules>

        </C.Flex>

        <ActionsGame actions={actions} onClick={(value) => handleClick(value)} disabled={!playGame} />

        <Modal
          open={open}
          titleModal={titleModal}
          messageModal={messageModal}
          handleOpenModal={() => handleOpenModal(null)}
        />
      </C.Flex>


    </C.Container>
  );
}

export default App
