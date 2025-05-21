import { useState } from 'react';
import { X, Upload } from 'lucide-react';

const UploadMaterialModal = ({ isDark, onClose, onUpload, getFileIcon, formatFileSize }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileTitle, setFileTitle] = useState('');
  const [fileDescription, setFileDescription] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...filesArray]);
      
      // Set default title from first file if title is empty
      if (!fileTitle && filesArray.length > 0) {
        setFileTitle(filesArray[0].name.split('.')[0]);
      }
    }
  };

  // Remove a file from the selected files
  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  // Handle upload click
  const handleUpload = () => {
    if (selectedFiles.length === 0 || !fileTitle) return;
    onUpload(selectedFiles, fileTitle, fileDescription);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`w-full max-w-lg p-6 rounded-lg ${
          isDark ? 'bg-[#0F1419]' : 'bg-white'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`font-medium text-lg ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            Upload Materials
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className={`block mb-1 text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Title
            </label>
            <input
              type="text"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              className={`w-full p-2 rounded-md border ${
                isDark
                  ? 'bg-[#121A22] border-[#1E2733] text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              placeholder="Enter a title for your materials"
            />
          </div>

          <div>
            <label
              className={`block mb-1 text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Description (optional)
            </label>
            <textarea
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              className={`w-full p-2 rounded-md border ${
                isDark
                  ? 'bg-[#121A22] border-[#1E2733] text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              placeholder="Add a description"
              rows={3}
            />
          </div>

          <div>
            <label
              className={`block mb-1 text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Files
            </label>
            
            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mb-3">
                <p className={`mb-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Selected files ({selectedFiles.length}):
                </p>
                <div className={`max-h-40 overflow-y-auto rounded-md ${
                  isDark ? 'bg-[#121A22] border border-[#1E2733]' : 'bg-gray-50 border border-gray-200'
                }`}>
                  {selectedFiles.map((file, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-2 ${
                        index !== selectedFiles.length - 1 ? 
                          isDark ? 'border-b border-[#1E2733]' : 'border-b border-gray-200' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{getFileIcon(file.type)}</span>
                        <span className={`font-medium truncate max-w-xs ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {file.name}
                        </span>
                        <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center ${
                isDark
                  ? 'border-[#1E2733] bg-[#0A0E13]'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Upload
                className={`mx-auto h-10 w-10 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <div className="mt-3 text-sm">
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer font-medium ${
                    isDark
                      ? 'text-[#506EE5] hover:text-[#4058C7]'
                      : 'text-indigo-600 hover:text-indigo-500'
                  }`}
                >
                  <span>{selectedFiles.length > 0 ? 'Add more files' : 'Upload files'}</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    multiple
                  />
                </label>
                <p
                  className={`pl-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  or drag and drop
                </p>
              </div>
              <p
                className={`text-xs mt-2 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                PDF, Word, Excel, PowerPoint, etc.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                isDark
                  ? 'bg-[#1E2733] text-white hover:bg-[#2D3A49]'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || !fileTitle}
              className={`px-4 py-2 rounded-md ${
                selectedFiles.length === 0 || !fileTitle
                  ? isDark
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isDark
                    ? 'bg-[#506EE5] text-white hover:bg-[#4058C7]'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterialModal;