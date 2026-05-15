import React, { useEffect, useRef, useState } from "react";

export function MenuBar({ children }) {
	return <div className="menu-bar toolbar">{children}</div>;
}

export function MenuBarGroup({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="menu-bar-group">
			<button 
        type="button" 
        className={`menu-bar-title ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
				{title}
			</button>
			{isOpen && <div className="menu-list">{children}</div>}
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
