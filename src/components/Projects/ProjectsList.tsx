import React from 'react';
import { Plus, Calendar, ArrowRight, MoreHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function ProjectsList() {
  const navigate = useNavigate();

  const handleNewProject = () => {
    const projectName = prompt('Enter a name for your new project:');
    if (projectName) {
      alert(`Creating new project: "${projectName}"\n\nThis will be connected to your backend later to actually create and save the project.`);
    }
  };

  const handleProjectMenu = (projectTitle: string) => {
    const action = confirm(`Project: ${projectTitle}\n\nClick OK to edit project settings, or Cancel to delete project.`);
    if (action) {
      alert('Project settings would open here');
    } else {
      const confirmDelete = confirm(`Are you sure you want to delete "${projectTitle}"?`);
      if (confirmDelete) {
        alert('Project deleted (this will be connected to backend later)');
      }
    }
  };

  const handleProjectClick = (projectId: string) => {
    // Navigate to Q&A flow with project_id parameter
    navigate(`/questions?project_id=${projectId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Manage and continue your life story projects</p>
        </div>
        <button 
          onClick={handleNewProject}
          className="inline-flex items-center space-x-2 bg-burgundy-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-burgundy-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[].map((project) => (
          <div 
            key={project.id} 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleProjectClick(project.id)}
          >
            {project.coverImage && (
              <div className="h-48 overflow-hidden">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectMenu(project.title);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{project.answeredQuestions}/{project.totalQuestions}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-burgundy-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{project.progress}% complete</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {new Date(project.lastUpdated).toLocaleDateString()}</span>
                </div>
                <Link
                  to={`/questions?project_id=${project.id}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent project click when clicking resume link
                  }}
                  className="inline-flex items-center space-x-2 text-burgundy-600 hover:text-burgundy-700 font-medium text-sm group"
                >
                  <span>Resume</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for New Project */}
      <div className="mt-8">
        <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
          <div className="mx-auto h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start a New Story</h3>
          <p className="text-gray-600 mb-4 max-w-sm mx-auto">
            Create a new project to capture different aspects of your life story or explore new themes.
          </p>
          <button 
            onClick={handleNewProject}
            className="inline-flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>
    </div>
  );
}