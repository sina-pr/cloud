import React, { useState, useEffect } from 'react';

const FileViewer = ({ file, onSave, onClose }) => {
  const [content, setContent] = useState(file.content);

  useEffect(() => {
    // Update content when the file prop changes
    setContent(file.content);
  }, [file]);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <div className="file-viewer">
      <div className="header">
        <div className="title">{file.name}</div>
        <div onClick={onClose} style={{ cursor: 'pointer' }}>
          X
        </div>
      </div>
      <div className="content">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={false}
        />
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default FileViewer;
