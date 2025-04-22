import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';
import { File, FileText, Download, Video, Image, Link as LinkIcon } from 'lucide-react';

const ClassMaterials = () => {
  const { courseId, classId } = useParams();
  const { themeConfig, theme } = useTheme();
  
  const [classInfo, setClassInfo] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from API
    const fetchData = async () => {
      try {
        // Mock class info
        setClassInfo({
          _id: classId,
          title: 'Introduction to the Course',
          date: '2025-01-15',
          time: '10:00 AM - 11:30 AM',
          instructor: 'Dr. Jane Smith',
          description: 'Overview of the course content, objectives, and expectations.'
        });

        // Mock materials data
        setMaterials([
          {
            _id: '201',
            title: 'Course Syllabus',
            type: 'document',
            format: 'pdf',
            size: '256 KB',
            uploadedOn: '2025-01-14',
            url: '#'
          },
          {
            _id: '202',
            title: 'Introduction Slides',
            type: 'presentation',
            format: 'pptx',
            size: '3.2 MB',
            uploadedOn: '2025-01-14',
            url: '#'
          },
          {
            _id: '203',
            title: 'Welcome Video',
            type: 'video',
            format: 'mp4',
            size: '45.6 MB',
            duration: '12:34',
            uploadedOn: '2025-01-14',
            url: '#'
          },
          {
            _id: '204',
            title: 'Reading Assignment',
            type: 'document',
            format: 'pdf',
            size: '1.8 MB',
            uploadedOn: '2025-01-14',
            url: '#'
          },
          {
            _id: '205',
            title: 'Additional Resources',
            type: 'link',
            url: 'https://example.com/resources',
            uploadedOn: '2025-01-14'
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching class data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, classId]);

  const getFileIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video size={24} className={themeConfig[theme].icon} />;
      case 'image':
        return <Image size={24} className={themeConfig[theme].icon} />;
      case 'link':
        return <LinkIcon size={24} className={themeConfig[theme].icon} />;
      case 'presentation':
        return <FileText size={24} className={themeConfig[theme].icon} />;
      default:
        return <File size={24} className={themeConfig[theme].icon} />;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${themeConfig[theme].text}`}>
        Loading class materials...
      </div>
    );
  }

  if (!classInfo) {
    return (
      <div className={`flex items-center justify-center h-64 ${themeConfig[theme].text}`}>
        Class not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Class Header */}
      <div className={`${themeConfig[theme].card} p-6 rounded-lg`}>
        <h1 className={`text-2xl font-bold ${themeConfig[theme].gradient.text}`}>
          {classInfo.title}
        </h1>
        <p className={`mt-2 ${themeConfig[theme].text}`}>{classInfo.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center">
            <Video size={18} className={themeConfig[theme].icon} />
            <span className={`ml-2 ${themeConfig[theme].secondaryText}`}>
              {new Date(classInfo.date).toLocaleDateString()} at {classInfo.time}
            </span>
          </div>
          <div className="flex items-center">
            <File size={18} className={themeConfig[theme].icon} />
            <span className={`ml-2 ${themeConfig[theme].secondaryText}`}>
              {materials.length} materials available
            </span>
          </div>
          <div className="flex items-center">
            <FileText size={18} className={themeConfig[theme].icon} />
            <span className={`ml-2 ${themeConfig[theme].secondaryText}`}>
              Instructor: {classInfo.instructor}
            </span>
          </div>
        </div>
      </div>
      
      {/* Materials List */}
      <div className={`${themeConfig[theme].card} p-6 rounded-lg`}>
        <h2 className={`text-lg font-semibold mb-4 ${themeConfig[theme].text}`}>Class Materials</h2>
        
        <div className="space-y-4">
          {materials.map((material) => (
            <div 
              key={material._id}
              className={`${themeConfig[theme].card} p-4 rounded-lg flex items-center justify-between hover:bg-opacity-80 transition-all`}
            >
              <div className="flex items-center">
                {getFileIcon(material.type)}
                <div className="ml-3">
                  <h3 className={`font-medium ${themeConfig[theme].text}`}>{material.title}</h3>
                  <div className="flex space-x-4 mt-1">
                    {material.format && (
                      <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                        {material.format.toUpperCase()}
                      </span>
                    )}
                    {material.size && (
                      <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                        {material.size}
                      </span>
                    )}
                    {material.duration && (
                      <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                        {material.duration}
                      </span>
                    )}
                    <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                      Added {new Date(material.uploadedOn).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <a 
                href={material.url} 
                className={`flex items-center ${themeConfig[theme].button.secondary} px-3 py-2 rounded-md hover:opacity-90 transition-opacity`}
                download={material.type !== 'link'}
              >
                {material.type === 'link' ? (
                  <span>Visit</span>
                ) : (
                  <>
                    <Download size={16} className="mr-1" />
                    <span>Download</span>
                  </>
                )}
              </a>
            </div>
          ))}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button 
          className={`${themeConfig[theme].button.outline} px-4 py-2 rounded-md`}
          onClick={() => window.history.back()}
        >
          Back to Classes
        </button>
        <button 
          className={`${themeConfig[theme].button.primary} px-4 py-2 rounded-md`}
          onClick={() => console.log('Download all materials')}
        >
          Download All Materials
        </button>
      </div>
    </div>
  );
};

export default ClassMaterials;