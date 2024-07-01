// src/components/FileUpload.js
import React, { useState } from 'react';
import yaml from 'js-yaml';
import { uploadFile } from '../api/githubApi';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const fileContent = e.target.result;
          const parsedContent = file.name.endsWith('.json')
            ? JSON.stringify(JSON.parse(fileContent), null, 2)
            : yaml.dump(yaml.load(fileContent));
          await uploadFile(parsedContent, file.name);
          onUpload();
        } catch (error) {
          alert('Failed to upload file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="mb-8">
      <input
        type="file"
        accept=".yaml,.yml,.json"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
      <button
        onClick={handleFileUpload}
        className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-700"
      >
        Upload File
      </button>
    </div>
  );
};

export default FileUpload;
