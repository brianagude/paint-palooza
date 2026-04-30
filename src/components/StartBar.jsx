import { useEffect, useState } from "react";
import { useOS } from "./OS";

import crayonPaper from "../assets/icons/crayon-paper.svg";
import flowers from "../assets/icons/flowers.svg";
import globe from "../assets/icons/globe.svg";
import music from "../assets/icons/music-95.svg";

import recurse from "../assets/icons/recurse-logo.svg";
import smile from "../assets/icons/smile.svg";
import sound from "../assets/icons/sound.svg";
import umbrella from "../assets/icons/umbrella.svg";

export function StartBar() {
  const { openWindows, minimize, restore, focus } = useOS();
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: 'numeric',
          minute: '2-digit',
        }),
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const icons = [
    { id: 'crayonPaper', src: crayonPaper, alt: 'Crayon with Paper Icon' },
    { id: 'flowers', src: flowers, alt: 'Flowers Icon' },
    { id: 'globe', src: globe, alt: 'Globe Icon' },
    { id: 'music', src: music, alt: 'Music Icon' },
    { id: 'smile', src: smile, alt: 'Smiley Face Icon' },
    { id: 'sound', src: sound, alt: 'Sound Icon' },
    { id: 'umbrella', src: umbrella, alt: 'Umbrella Icon' },
  ];

  function handleClick(instanceId, window) {
    // onUpdate(app.name, { minimized: !app.minimized })
    if (window.isMinimized) {
      restore(instanceId);
    } else if (window.isFocused) {
      minimize(instanceId);
    } else {
      focus(instanceId);
    }
  }

  function TaskButton({instanceId}) {
    const { openWindows, registeredApps } = useOS();
    const window = openWindows.find(w => w.instanceId === instanceId);
    const app = registeredApps.get(window.appId);

    return (
      <button
        type="button"
        className={`window-btn ${window.isFocused && 'selected'}`}
        onClick={() => handleClick(instanceId, window)}
      >
        <img src={app.icon} alt={`${app.name} Icon`} />
        {window.title}
      </button>
    )
  }

  return (
    <div className="start-bar window">
      <div className="status-bar">
        <div className="buttons">
          <button type="button" className="start-btn">
            <img src={recurse} alt="Recurse Center Logo" />
            Start
          </button>

          {openWindows.sort((a,b) => a.launchTime - b.launchTime).map(w => 
            <TaskButton instanceId={w.instanceId} />
          )}
        </div>

        <div className="status-field-border">
          {icons.map(({ id, src, alt }) => (
            <img key={id} src={src} alt={alt} />
          ))}
          <p className="nyc-time">{time}</p>
        </div>
      </div>
    </div>
  );
}
