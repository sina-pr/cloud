// Desktop.js
import React, { useState, useEffect } from 'react';
import { FaFile, FaPowerOff } from 'react-icons/fa';
import FileViewer from './FileViewer';

const Desktop = () => {
  const [files, setFiles] = useState([]);
  const [openFile, setOpenFile] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [screenOff, setScreenOff] = useState(false);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  const handlePanelItemClick = (action) => {
    if (action === 'newFile') {
      const newFileWidth = 75; // Adjust the width of the new file item
      const newFileHeight = 85; // Adjust the height of the new file item
      const margin = 10; // Adjust the margin between files

      // Calculate a position that avoids conflicts with existing files
      const newPosition = calculateNewFilePosition(
        newFileWidth,
        newFileHeight,
        margin
      );

      const newFile = {
        id: new Date().getTime(),
        name: `New File ${files.length + 1}`,
        content: 'Type your content here...',
        width: 75,
        height: 85,
        position: newPosition,
      };
      setFiles([...files, newFile]);
      setOpenFile(newFile);
    } else if (action === 'deleteFiles') {
      setFiles([]);
    }
    setShowPanel(false);
  };
  const calculateNewFilePosition = (width, height, margin) => {
    const desktopWidth = window.innerWidth;
    const desktopHeight = window.innerHeight;

    // Initial position for the new file
    let left = 100;
    let top = 100;

    // Flag to indicate if there is a conflict with existing files
    let conflict = true;

    while (conflict) {
      conflict = false;

      // Check against existing files
      for (const existingFile of files) {
        if (
          left < existingFile.position.left + existingFile.width + margin &&
          left + width + margin > existingFile.position.left &&
          top < existingFile.position.top + existingFile.height + margin &&
          top + height + margin > existingFile.position.top
        ) {
          conflict = true;
          // Adjust the position to avoid conflicts
          left += existingFile.width + margin;

          // Start a new row if the new file exceeds the desktop width
          if (left + width > desktopWidth) {
            left = 100;
            top += existingFile.height + margin;
          }
          break;
        }
      }

      // Check if the new file goes beyond the desktop boundaries
      if (left + width > desktopWidth || top + height > desktopHeight) {
        conflict = true;
        // Reset position if the new file exceeds desktop boundaries
        left = 100;
        top = 300;
      }
    }

    return { left, top };
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!screenOff) {
        setCurrentTime(getCurrentTime());
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [screenOff]);

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const handleMouseDown = (e) => {
    if (e.button === 2) {
      // Right click to show the panel
      e.preventDefault();

      setPanelPosition({ x: e.clientX, y: e.clientY });
      setShowPanel(true);
    } else {
      // Left click to open a file
      const clickedFile = files.find(
        (file) =>
          e.clientX >= file.position.left &&
          e.clientX <= file.position.right &&
          e.clientY >= file.position.top &&
          e.clientY <= file.position.bottom
      );

      if (clickedFile) {
        handleFileClick(clickedFile);
      }
    }
  };

  const handleFileClick = (file) => {
    setOpenFile(file);
  };

  const handleCloseFile = () => {
    setOpenFile(null);
  };
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const handleFileContextMenu = (e, file) => {
    e.preventDefault();

    const menu = document.getElementById('context-menu');
    menu.style.top = `${e.clientY}px`;
    menu.style.left = `${e.clientX}px`;
    menu.style.display = 'block';

    const deleteAction = () => {
      setFiles(files.filter((f) => f.id !== file.id));
      menu.style.display = 'none';
    };

    document.addEventListener('click', () => {
      menu.style.display = 'none';
    });

    document
      .getElementById('delete-action')
      .addEventListener('click', deleteAction);
  };

  const handleTurnOff = () => {
    setScreenOff(true);
  };

  const handleScreenClick = (e) => {
    e.preventDefault();
    if (screenOff) {
      setScreenOff(false);
    }
  };
  console.log(files, openFile);
  return (
    <div
      className={`desktop ${screenOff ? 'screen-off' : ''}`}
      //   onClick={handleScreenClick}
      onMouseDown={handleMouseDown}
    >
      {files.map((file) => (
        <div
          key={file.id}
          className="file"
          onClick={() => handleFileClick(file)}
          onContextMenu={(e) => handleFileContextMenu(e, file)}
          style={{
            left: file.position.left,
            top: file.position.top,
          }}
        >
          <FaFile />
          <div className="file-name">{file.name}</div>
        </div>
      ))}

      {openFile && (
        <FileViewer
          file={openFile}
          onSave={(content) => {
            setFiles(
              files.map((f) => (f.id === openFile.id ? { ...f, content } : f))
            );
          }}
          onClose={handleCloseFile}
        />
      )}

      {/* Context Menu */}
      <div id="context-menu" className="context-menu">
        <div id="delete-action">Delete</div>
      </div>

      {/* Panel */}
      {showPanel && (
        <div
          className="panel"
          style={{ top: panelPosition.y, left: panelPosition.x }}
        >
          <div onClick={() => handlePanelItemClick('newFile')}>New File</div>
          <div onClick={() => handlePanelItemClick('deleteFiles')}>
            Delete All Files
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="taskbar">
        <div className="power-off" onClick={handleTurnOff}>
          {/* <FaPowerOff /> */}
        </div>
        <div className="taskbar-clock">{screenOff ? '' : currentTime}</div>
      </div>
    </div>
  );
};

export default Desktop;
