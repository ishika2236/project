// components/views/MaterialsSharing.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { File, FileText, FilePlus, Download, Link, ExternalLink, Trash2, Edit } from 'lucide-react';

const MaterialsSharing = ({ course, group, classItem }) => {
  const { themeConfig, theme } = useTheme();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Simulated data fetch
  useEffect(() => {
    if (course && group && classItem) {
      // Mock API call for materials data
      setTimeout(() => {
        setMaterials([
          { 
            id: 1, 
            name: 'Lecture Slides.pdf', 
            type: 'pdf', 
            uploadedAt: '2025-04-11T14:30:00Z', 
            size: '2.4 MB',
            downloadCount: 12
          },
          { 
            id: 2, 
            name: 'Assignment Instructions.docx', 
            type: 'document', 
            uploadedAt: '2025-04-11T14:35:00Z', 
            size: '1.1 MB',
            downloadCount: 15
          },
          { 
            id: 3, 
            name: 'Code Examples.zip', 
            type: 'archive', 
            uploadedAt: '2025-04-11T15:10:00Z', 
            size: '5.7 MB',
            downloadCount: 8
          },
          { 
            id: 4, 
            name: 'Additional Resources', 
            type: 'link', 
            uploadedAt: '2025-04-11T16:20:00Z', 
            url: 'https://example.com/resources',
            clickCount: 10
          },
          { 
            id: 5, 
            name: 'Syllabus Overview.pdf', 
            type: 'pdf', 
            uploadedAt: '2025-04-10T09:15:00Z', 
            size: '1.8 MB',
            downloadCount: 23
          }
        ]);
        setLoading(false);
      }, 600);
    }
  }, [course, group, classItem]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FileText size={24} className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />;
      case 'document':
        return <FileText size={24} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />;
      case 'archive':
        return <File size={24} className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} />;
      case 'link':
        return <Link size={24} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />;
      default:
        return <File size={24} className={themeConfig[theme].secondaryText} />;
    }
  };

  // Modal component for file uploads
  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-lg ${themeConfig[theme].card}`}>
        <h3 className={`text-lg font-medium mb-4 ${themeConfig[theme].text}`}>Upload New Material</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm mb-1 ${themeConfig[theme].secondaryText}`}>Material Type</label>
            <select 
              className={`w-full p-2 rounded-lg outline-none ${
                theme === 'dark' 
                  ? 'bg-[#121A22] border border-[#1E2733] text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
            >
              <option value="file">File Upload</option>
              <option value="link">External Link</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm mb-1 ${themeConfig[theme].secondaryText}`}>Title</label>
            <input 
              type="text" 
              placeholder="Enter a title for this material"
              className={`w-full p-2 rounded-lg outline-none ${
                theme === 'dark' 
                  ? 'bg-[#121A22] border border-[#1E2733] text-white placeholder-gray-500' 
                  : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm mb-1 ${themeConfig[theme].secondaryText}`}>File</label>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                theme === 'dark' 
                  ? 'border-[#1E2733] bg-[#121A22]/50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <FilePlus size={36} className={`mx-auto mb-2 ${themeConfig[theme].secondaryText}`} />
              <p className={themeConfig[theme].secondaryText}>
                Drag and drop files here or
                <span className={`font-medium mx-1 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  browse
                </span>
                to upload
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              onClick={() => setShowUploadModal(false)}
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-[#121A22] hover:bg-[#1E2733] text-white border border-[#1E2733]' 
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Cancel
            </button>
            <button className={`px-4 py-2 rounded-lg ${themeConfig[theme].button.primary}`}>
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!course || !group || !classItem) {
    return (
      <div className={`p-8 text-center ${themeConfig[theme].secondaryText}`}>
        Please select a class to view shared materials
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${themeConfig[theme].text}`}>Class Materials</h2>
          <p className={`mt-1 ${themeConfig[theme].secondaryText}`}>
            {course.name} • {group.name} • {classItem.title}
          </p>
        </div>
        <div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className={`px-4 py-2 rounded-lg ${themeConfig[theme].button.primary}`}
          >
            <FilePlus size={18} className="mr-2 inline" />
            Add Material
          </button>
        </div>
      </div>

      <div className={`${themeConfig[theme].card} rounded-lg p-6`}>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-16 animate-pulse rounded-lg ${theme === 'dark' ? 'bg-[#121A22]/60' : 'bg-gray-100'}`} 
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {materials.length === 0 ? (
              <div className="text-center py-12">
                <FilePlus size={48} className={`mx-auto mb-3 ${themeConfig[theme].secondaryText}`} />
                <p className={`${themeConfig[theme].text} font-medium`}>No materials shared yet</p>
                <p className={`${themeConfig[theme].secondaryText} text-sm mt-1`}>
                  Upload files or share links to get started
                </p>
              </div>
            ) : (
              materials.map(material => (
                <div 
                  key={material.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-[#121A22] border border-[#1E2733] hover:border-[#506EE5]/30' 
                      : 'bg-white border border-gray-200 hover:border-blue-300'
                  } transition-all duration-200`}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-4 ${
                      theme === 'dark' ? 'bg-[#0A0E13]' : 'bg-gray-100'
                    }`}>
                      {getFileIcon(material.type)}
                    </div>
                    <div>
                      <p className={`font-medium ${themeConfig[theme].text}`}>{material.name}</p>
                      <div className={`flex text-sm mt-1 ${themeConfig[theme].secondaryText}`}>
                        <span>{formatDate(material.uploadedAt)}</span>
                        {material.type !== 'link' && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{material.size}</span>
                            <span className="mx-2">•</span>
                            <span>{material.downloadCount} downloads</span>
                          </>
                        )}
                        {material.type === 'link' && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="underline">{material.url}</span>
                            <span className="mx-2">•</span>
                            <span>{material.clickCount} clicks</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {material.type === 'link' ? (
                      <a 
                        href={material.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 rounded-full ${
                          theme === 'dark' 
                            ? 'hover:bg-[#1E2733] text-gray-400' 
                            : 'hover:bg-gray-100 text-gray-500'
                        }`}
                      >
                        <ExternalLink size={18} />
                      </a>
                    ) : (
                      <button 
                        className={`p-2 rounded-full ${
                          theme === 'dark' 
                            ? 'hover:bg-[#1E2733] text-gray-400' 
                            : 'hover:bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Download size={18} />
                      </button>
                    )}
                    <button 
                      className={`p-2 rounded-full ${
                        theme === 'dark' 
                          ? 'hover:bg-[#1E2733] text-gray-400' 
                          : 'hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      className={`p-2 rounded-full ${
                        theme === 'dark' 
                          ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' 
                          : 'hover:bg-red-100 text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default MaterialsSharing;