import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds }  from 'date-fns'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O valor precisa ser no mínino de 05 minutos.')
    .max(60, 'O valor precisa ser no máximo de 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
}

// eslint-disable-next-line prettier/prettier
export function Home() {  
  const [cycles, setCycles] = useState<Cycles[]>([]);
  const [activeCyclesId, setActiveCyclesId] = useState<string | null>(null);   
  const [amoutSecondPassed, setAmoutSecondPassed] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id == activeCyclesId);   

  useEffect(() => {
    let interval: number

      if (activeCycle) {
      interval = setInterval(() => {
        setAmoutSecondPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)

      }

      return () => {
          clearInterval(interval);
    }
  }, [activeCycle])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycles = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),

  }

    setCycles((state) => [...state, newCycle])
    setActiveCyclesId(String(new Date().getTime()))
    reset()
  }

  const totalSecond = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSecond = activeCycle ? totalSecond - amoutSecondPassed : 0

  const minutesAmount = Math.floor(currentSecond / 60)
  const secondAmount = minutesAmount % 60 // o Resto de 60 minutos

  const minutes = String(minutesAmount).padStart(2, '0') // o padding start inclui os caracteres dos minutos
  const seconds = String(secondAmount).padStart(2, '0')

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
