import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const AnnouncementModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isDark = false 
}) => {
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const handleSubmit = () => {
    if (!newAnnouncement.trim()) return;
    onSubmit(newAnnouncement);
    setNewAnnouncement('');
    onClose();
  };

  if (!isOpen) return null;

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
            New Announcement
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
              Announcement Message
            </label>
            <textarea
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              className={`w-full p-3 rounded-md border ${
                isDark
                  ? 'bg-[#121A22] border-[#1E2733] text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              placeholder="Write your announcement here..."
              rows={6}
            />
          </div>

          <div
            className={`flex items-center p-3 rounded-md ${
              isDark
                ? 'bg-[#121A22] border border-[#1E2733]'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <AlertCircle
              size={18}
              className={`mr-2 ${
                isDark ? 'text-[#506EE5]' : 'text-indigo-600'
              }`}
            />
            <p
              className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              This announcement will be visible to all students in the class.
            </p>
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
              onClick={handleSubmit}
              disabled={!newAnnouncement.trim()}
              className={`px-4 py-2 rounded-md ${
                !newAnnouncement.trim()
                  ? isDark
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isDark
                    ? 'bg-[#506EE5] text-white hover:bg-[#4058C7]'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;