export function MenuBar({ children }) {

    return (
        <div className="menu-bar">
            { children }
        </div>
    );
}

export function MenuBarGroup({ title, children }) {
  return (
    <div className="menu-bar-group">
      <button type="button" className="remove-styling">
        {title}
      </button>
      <div className="menu-list">{children}</div>
    </div>
  );
}

export function MenuBarItem({ title, action }) {
  return (
    <button
      type="button"
      className="menu-bar-item remove-styling"
      onClick={action}
    >
      {title}
    </button>
  );
}