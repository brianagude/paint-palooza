import { useOS } from './OSContext';
import { Window } from "./Window";

export function WindowManager() {
  const {openWindows} = useOS();

  return (
    [...openWindows].filter(([id, w]) => !w.isMinimized)
    .map(([id,w]) => 
      <Window key={id} instanceId={id} />
    )
  )
}