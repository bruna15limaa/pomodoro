import { useContext, useEffect, useState } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../..";


export function Countdown() {
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished } = useContext(CyclesContext)
  const [amoutSecondsPassed, setAmoutSecondsPassed] = useState(0)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0


 useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(), 
          activeCycle.startDate
          )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setAmoutSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmoutSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

    
  const currentSeconds = activeCycle ? totalSeconds - amoutSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondAmount = currentSeconds % 60 // o Resto de 60 minutos

  const minutes = String(minutesAmount).padStart(2, '0') // o padding start inclui os caracteres dos minutos
  const seconds = String(secondAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}