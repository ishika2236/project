import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  PlusCircle, File, MessageSquare, Trash2, Edit2, Download, FileText, Link as LinkIcon
} from 'lucide-react';
import { 
  fetchAnnouncements, editAnnouncement, 
  deleteAnnouncement, postAnnouncement, deleteMaterial, uploadMaterial
} from '../../app/features/classroom/classroomThunks';
import UploadMaterialModal from './modals/UploadMaterialModal';
import AnnouncementModal from './modals/AnnouncementModal';

const MaterialsSharing = ({ isDark, currentTheme, classroom }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [editAnnouncementText, setEditAnnouncementText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmResourceDeleteId, setConfirmResourceDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState('materials'); // 'materials' or 'announcements'
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState(null);
  
  // Get materials and announcements from Redux store
  const { classroomAnnouncements, loading } = useSelector(state => state.classrooms);
  // Get shared materials from Redux store
  const { sharedMaterials } = useSelector(state => state.classrooms);
  const materialByteacher = sharedMaterials?.teacher
  // Use materials directly from sharedMaterials array
  const materials = Array.isArray(materialByteacher) ? materialByteacher : [];
  
  useEffect(() => {
    if (classroom?.id) {
      dispatch(fetchAnnouncements(classroom.id));
    }
  }, [dispatch, classroom]);

  // Handle uploading files
  const handleUploadMaterials = (files, title, description) => {
    if (!files.length || !title) return;
    
    const formData = new FormData();
    
    // Append all files to the formData
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    formData.append('title', title);
    formData.append('description', description);
    
    dispatch(uploadMaterial({ 
      classroomId: classroom.id, 
      resourceData: formData 
    }));
    
    setUploadModalOpen(false);
  };

  // Post announcement
  const handlePostAnnouncement = (message) => {
    if (!message.trim()) return;
    
    dispatch(postAnnouncement({ 
      classroomId: classroom.id, 
      message: message,
      teacherId: user?._id
    }));
    
    setAnnouncementModalOpen(false);
  };

  // Submit edited announcement
  const handleSubmitEdit = () => {
    if (!editAnnouncementText.trim() || !editingAnnouncement) return;
    
    dispatch(editAnnouncement({
      classroomId: classroom.id,
      announcementId: editingAnnouncement._id,
      message: editAnnouncementText,
      teacherId: user?._id
    }));
    
    setEditingAnnouncement(null);
    setEditAnnouncementText('');
  };

  // Delete an announcement
  const handleDeleteAnnouncement = (id) => {
    dispatch(deleteAnnouncement({
      classroomId: classroom.id,
      announcementId: id
    }));
    
    setConfirmDeleteId(null);
  };

  // Delete a resource/material
  const handleDeleteMaterial = (id) => {
    dispatch(deleteMaterial({
      classroomId: classroom.id,
      resourceId: id
    }));
    
    setConfirmResourceDeleteId(null);
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (!type) return '📁'; // Default icon if type is undefined
    
    const fileType = type.toLowerCase();
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('doc')) return '📝';
    if (fileType.includes('xls') || fileType.includes('sheet')) return '📊';
    if (fileType.includes('ppt') || fileType.includes('presentation')) return '📊';
    if (fileType.includes('zip') || fileType.includes('rar')) return '🗜️';
    if (fileType.includes('image') || fileType.includes('png') || fileType.includes('jpg')) return '🖼️';
    return '📁';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle opening file URL
  const handleShowFileUrl = (material) => {
    // Construct URL information with filename and filetype
    const fileName = material.title || material.filename || "Unnamed material";
    const fileType = material.mimeType || "Unknown type";
    const fileUrl = material.url || material.fileUrl || `/api/classroom/${classroom.id}/resources/${material._id}/download`;
    
    setCurrentFileUrl({
      url: fileUrl,
      displayText: `${fileName} (${fileType})`
    });
    setShowUrlModal(true);
  };

  // File URL modal component
  const FileUrlModal = () => {
    if (!showUrlModal || !currentFileUrl) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`w-full max-w-lg p-6 rounded-lg ${isDark ? 'bg-[#121A22]' : 'bg-white'} shadow-xl`}>
          <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>File URL</h3>
          <div className={`flex items-center p-3 rounded ${isDark ? 'bg-[#0A0E13] border border-[#1E2733]' : 'bg-gray-100'}`}>
            <input
              type="text"
              value={currentFileUrl.displayText}
              readOnly
              className={`flex-grow ${isDark ? 'bg-[#0A0E13] text-white' : 'bg-gray-100 text-gray-800'} outline-none`}
            />
            <a
              href={currentFileUrl.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-2 ${isDark ? 'text-[#506EE5]' : 'text-indigo-600'} hover:underline`}
            >
              <LinkIcon size={16} />
            </a>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowUrlModal(false)}
              className={`px-4 py-2 rounded ${
                isDark ? 'bg-[#1E2733] text-white' : 'bg-gray-200 text-gray-800'
              } hover:opacity-90`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Tab Navigation */}
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'materials'
              ? isDark
                ? 'border-b-2 border-[#506EE5] text-[#506EE5]'
                : 'border-b-2 border-pink-500 text-pink-500'
              : isDark
                ? 'text-gray-400'
                : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('materials')}
        >
          <div className="flex items-center">
            <FileText size={16} className="mr-2" />
            Materials
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'announcements'
              ? isDark
                ? 'border-b-2 border-[#506EE5] text-[#506EE5]'
                : 'border-b-2 border-pink-500 text-pink-500'
              : isDark
                ? 'text-gray-400'
                : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('announcements')}
        >
          <div className="flex items-center">
            <MessageSquare size={16} className="mr-2" />
            Announcements
          </div>
        </button>
      </div>

      {/* Materials Tab Content */}
      {activeTab === 'materials' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Class Materials
            </h3>
            <button
              onClick={() => setUploadModalOpen(true)}
              className={`${
                isDark
                  ? 'bg-[#506EE5] hover:bg-[#4058C7] text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors text-sm`}
            >
              <PlusCircle size={16} className="mr-2" />
              Upload Material
            </button>
          </div>

          {/* Materials List */}
          <div
            className={`border rounded-lg overflow-hidden ${
              isDark ? 'border-[#1E2733]' : 'border-gray-200'
            }`}
          >
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Loading materials...
                </p>
              </div>
            ) : materials && materials.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={isDark ? 'bg-[#121A22]' : 'bg-gray-50'}>
                  <tr>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Name
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Type
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      URL
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Size
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Date Added
                    </th>
                    <th
                      className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
  className={`divide-y ${
    isDark ? 'bg-[#0A0E13] divide-[#1E2733]' : 'bg-white divide-gray-200'
  }`}
>
  {materials
    .filter(material => {
      return material.classroomId === classroom?.id || material?.files;
    })
    .map((material) => (
      <tr key={material._id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <span className="mr-2">{getFileIcon(material.mimeType)}</span>
            <div className={isDark ? 'text-white' : 'text-gray-800'}>
              {material.title || material.filename || "Unnamed material"}
            </div>
          </div>
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {material.mimeType ||
            (material.files && material.files.length > 0
              ? `${material.files.length} file(s)`
              : "Unknown type")}
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {/* ✅ Render each file's name as a link */}
          {material.files && material.files.length > 0 ? (
            <div className="flex flex-col space-y-1">
              {material.files.map((file, idx) => (
                <a
                  key={idx}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={isDark ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}
                >
                  {file.filename || "Download File"}
                </a>
              ))}
            </div>
          ) : material.url ? (
            <a
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className={isDark ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}
            >
              {material.filename || "Download File"}
            </a>
          ) : (
            "No file"
          )}
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {material.fileSize && formatFileSize(material.fileSize)}
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {material.createdAt && formatDate(material.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
          <div className="flex justify-end items-center space-x-2">
            <button
              className={`${
                isDark ? 'text-[#506EE5]' : 'text-indigo-600'
              } hover:opacity-80`}
            >
              <Download size={16} />
            </button>
            {confirmResourceDeleteId === material._id ? (
              <div className="flex items-center">
                <button
                  onClick={() => handleDeleteMaterial(material._id)}
                  className="text-red-500 hover:text-red-700 mr-2"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmResourceDeleteId(null)}
                  className={`${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  } hover:opacity-80`}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmResourceDeleteId(material._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </td>
      </tr>
    ))}
</tbody>

              </table>
            ) : (
              <div
                className={`p-8 text-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <File size={40} className="mx-auto mb-2 opacity-30" />
                <p>No materials have been uploaded yet</p>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className={`mt-4 text-sm ${
                    isDark ? 'text-[#506EE5]' : 'text-indigo-600'
                  } hover:underline`}
                >
                  Upload your first material
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Announcements Tab Content */}
      {activeTab === 'announcements' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Class Announcements
            </h3>
            <button
              onClick={() => setAnnouncementModalOpen(true)}
              className={`${
                isDark
                  ? 'bg-[#506EE5] hover:bg-[#4058C7] text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors text-sm`}
            >
              <PlusCircle size={16} className="mr-2" />
              New Announcement
            </button>
          </div>

          {/* Announcements List */}
          <div
            className={`rounded-lg ${
              isDark ? 'bg-[#0A0E13]' : 'bg-gray-50'
            }`}
          >
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Loading announcements...
                </p>
              </div>
            ) : classroomAnnouncements && classroomAnnouncements.length > 0 ? (
              <div className="space-y-4 p-4">
                {classroomAnnouncements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className={`p-4 rounded-lg ${
                      isDark
                        ? 'bg-[#121A22] border border-[#1E2733]'
                        : 'bg-white border border-gray-200 shadow-sm'
                    }`}
                  >
                    {editingAnnouncement && editingAnnouncement._id === announcement._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editAnnouncementText}
                          onChange={(e) => setEditAnnouncementText(e.target.value)}
                          className={`w-full p-3 rounded-lg border ${
                            isDark
                              ? 'bg-[#0A0E13] border-[#1E2733] text-white'
                              : 'bg-white border-gray-300 text-gray-800'
                          }`}
                          rows={4}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingAnnouncement(null);
                              setEditAnnouncementText('');
                            }}
                            className={`px-3 py-1 rounded ${
                              isDark
                                ? 'bg-[#1E2733] text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitEdit}
                            className={`px-3 py-1 rounded ${
                              isDark
                                ? 'bg-[#506EE5] text-white'
                                : 'bg-indigo-600 text-white'
                            }`}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <p
                            className={`text-sm font-medium ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            {formatDate(announcement.createdAt)}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingAnnouncement(announcement);
                                setEditAnnouncementText(announcement.message);
                              }}
                              className={`p-1 rounded-full hover:opacity-80 ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              <Edit2 size={16} />
                            </button>
                            {confirmDeleteId === announcement._id ? (
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleDeleteAnnouncement(announcement._id)}
                                  className="text-red-500 hover:text-red-700 mr-2 text-xs"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className={`${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                  } hover:opacity-80 text-xs`}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(announcement._id)}
                                className="p-1 rounded-full hover:opacity-80 text-red-500"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p
                          className={`mt-2 whitespace-pre-wrap ${
                            isDark ? 'text-white' : 'text-gray-800'
                          }`}
                        >
                          {announcement.message}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`p-8 text-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <MessageSquare size={40} className="mx-auto mb-2 opacity-30" />
                <p>No announcements have been posted yet</p>
                <button
                  onClick={() => setAnnouncementModalOpen(true)}
                  className={`mt-4 text-sm ${
                    isDark ? 'text-[#506EE5]' : 'text-indigo-600'
                  } hover:underline`}
                >
                  Create your first announcement
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {uploadModalOpen && (
        <UploadMaterialModal
          isDark={isDark}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUploadMaterials}
          getFileIcon={getFileIcon}
          formatFileSize={formatFileSize}
        />
      )}

      {announcementModalOpen && (
        <AnnouncementModal
          isOpen={announcementModalOpen}
          isDark={isDark}
          onClose={() => setAnnouncementModalOpen(false)}
          onSubmit={handlePostAnnouncement}
        />
      )}

      {/* File URL Modal */}
      <FileUrlModal />
    </div>
  );
};

export default MaterialsSharing;