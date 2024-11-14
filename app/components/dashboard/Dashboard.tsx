import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface Visualization {
  id: string;
  content: string;
  timestamp: number;
  title: string;
  category?: string;  // For organizing visualizations (e.g., "Physics", "Music", "Biology")
}

export const Dashboard: React.FC = () => {
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Load saved visualizations from localStorage
    const loadVisualizations = () => {
      const saved = localStorage.getItem('conceptVisualizations');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setVisualizations(parsed);
        } catch (error) {
          console.error('Error loading visualizations:', error);
        }
      }
    };

    loadVisualizations();
  }, []);

  // Extract category from content if available
  const extractCategory = (content: string): string => {
    const categoryMatch = content.match(/## Related Concepts\n([\s\S]*?)(?=\n#|$)/);
    if (categoryMatch) {
      const concepts = categoryMatch[1].split('\n').filter(line => line.trim());
      return concepts[0]?.replace(/[*-]\s*/, '').split(' ')[0] || 'Uncategorized';
    }
    return 'Uncategorized';
  };

  // Filter visualizations based on search term
  const filteredVisualizations = visualizations.filter(viz => 
    viz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    viz.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Copy content to clipboard
  const copyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  // Delete a visualization
  const deleteVisualization = (id: string) => {
    const updated = visualizations.filter(v => v.id !== id);
    setVisualizations(updated);
    localStorage.setItem('conceptVisualizations', JSON.stringify(updated));
  };

  return (
    <div className="dashboard p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Concept Visualizations</h2>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search visualizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTab('grid')}
              className={`px-3 py-1 rounded ${
                selectedTab === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setSelectedTab('list')}
              className={`px-3 py-1 rounded ${
                selectedTab === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {selectedTab === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVisualizations.map((viz) => (
            <div 
              key={viz.id} 
              className="visualization bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{viz.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyContent(viz.content)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Copy Content"
                  >
                    <span className="i-ph:copy text-lg" />
                  </button>
                  <button
                    onClick={() => deleteVisualization(viz.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <span className="i-ph:trash text-lg" />
                  </button>
                </div>
              </div>
              <div className="prose max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {viz.content}
                </ReactMarkdown>
              </div>
              <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(viz.timestamp).toLocaleString()}</span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {viz.category || extractCategory(viz.content)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVisualizations.map((viz) => (
            <div 
              key={viz.id} 
              className="visualization bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{viz.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyContent(viz.content)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Copy Content"
                  >
                    <span className="i-ph:copy text-lg" />
                  </button>
                  <button
                    onClick={() => deleteVisualization(viz.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <span className="i-ph:trash text-lg" />
                  </button>
                </div>
              </div>
              <div className="prose max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {viz.content}
                </ReactMarkdown>
              </div>
              <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(viz.timestamp).toLocaleString()}</span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {viz.category || extractCategory(viz.content)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredVisualizations.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          {searchTerm ? 'No matching visualizations found.' : 'No visualizations yet. Start by creating one!'}
        </div>
      )}
    </div>
  );
};
