import { Hand, HandPalm, Play } from 'phosphor-react'
import { createContext, useEffect, useState } from 'react'


import { 
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton, 
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'




interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null  
  markCurrentCycleAsFinished: () => void 
}

export const CyclesContext = createContext({} as CyclesContextType)

// eslint-disable-next-line prettier/prettier
export function Home() {  
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  // eslint-disable-next-line eqeqeq
  const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

  function markCurrentCycleAsFinished() {
    setCycles(state => state.map((cycle) => {
      if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
      } else {
        return cycle
      }
    }),
    )
  }

  //function handleCreateNewCycle(data: NewCycleFormData) {
  //  const newCycle: Cycle = {
  //    id: String(new Date().getTime()),
  //    task: data.task,
  //    minutesAmount: data.minutesAmount,
  //    startDate: new Date(),
  //  }
//
  //  setCycles((state) => [...state, newCycle])
  //  setActiveCycleId(String(new Date().getTime()))
  //  reset()
  //}

  function handleInterruptCycle() {
    setCycles(state =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }




  //const task = watch('task')
 // const isSubmitDisabled = !task

  
  return (
    <HomeContainer>
      <form /*onSubmit={handleSubmit(handleCreateNewCycle)}*/ action="">
       <CyclesContext.Provider value={ activeCycle, activeCycleId, markCurrentCycleAsFinished }>
       {/* <NewCycleForm/> */}
        <Countdown />
        </CyclesContext.Provider>
        { activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interrromper
          </StopCountdownButton>
        ):(
          <StartCountdownButton /*disabled={isSubmitDisabled}*/ type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
