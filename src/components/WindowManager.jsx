import { useOS } from './OS';
import { Window } from "./Window";

export function WindowManager() {
  const {openWindows} = useOS();

  return (
    openWindows.filter(w => !w.isMinimized)
    .map(w => 
      <Window key={w.instanceId} instanceId={w.instanceId} />
    )
  )
}