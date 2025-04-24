import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import api, { endpoints } from '../../api';

// Define the type for data preview rows
type DataRow = Record<string, string | number>;

const DataArtifactsPanel: React.FC = () => {
  const { isLoading: globalLoading, setIsLoading: setGlobalLoading } = useDashboard();
  const [activeTab, setActiveTab] = useState('data-preview');
  
  // State for data preview
  const [dataPreview, setDataPreview] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch data preview from backend
  const fetchDataPreview = async () => {
    if (activeTab !== 'data-preview') return;
    
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await api.get(endpoints.getDataPreview);
      
      // Handle successful response
      console.log('Data preview fetched successfully:', response.data);
      
      // Update data preview state
      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          setDataPreview(response.data.data);
          
          // Extract column names from the first row
          if (response.data.data.length > 0) {
            setColumns(Object.keys(response.data.data[0]));
          }
          
          // Set total rows if available
          if (response.data.totalRows) {
            setTotalRows(response.data.totalRows);
          } else {
            setTotalRows(response.data.data.length);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data preview:', error);
      setError('Failed to fetch data preview. Please try again.');
      
      // Set fallback data for demo purposes
      const fallbackData = [
        { id: 1, sex: 'M', length: 0.455, diameter: 0.365, height: 0.095, weight: 0.514 },
        { id: 2, sex: 'M', length: 0.350, diameter: 0.265, height: 0.090, weight: 0.226 },
        { id: 3, sex: 'F', length: 0.530, diameter: 0.420, height: 0.135, weight: 0.677 },
        { id: 4, sex: 'M', length: 0.440, diameter: 0.365, height: 0.125, weight: 0.516 },
        { id: 5, sex: 'I', length: 0.330, diameter: 0.255, height: 0.080, weight: 0.205 },
        { id: 6, sex: 'I', length: 0.425, diameter: 0.300, height: 0.095, weight: 0.351 },
        { id: 7, sex: 'F', length: 0.530, diameter: 0.415, height: 0.150, weight: 0.861 },
        { id: 8, sex: 'F', length: 0.545, diameter: 0.425, height: 0.125, weight: 0.768 },
        { id: 9, sex: 'M', length: 0.475, diameter: 0.370, height: 0.125, weight: 0.662 },
        { id: 10, sex: 'F', length: 0.550, diameter: 0.440, height: 0.150, weight: 0.896 },
      ];
      setDataPreview(fallbackData);
      setColumns(['id', 'sex', 'length', 'diameter', 'height', 'weight']);
      setTotalRows(4177); // Fallback total rows
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data when component mounts or when active tab changes
  useEffect(() => {
    fetchDataPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Data Artifacts</h2>
      
      <div className="flex border-b mb-4">
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'data-preview' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}
          onClick={() => setActiveTab('data-preview')}
        >
          Data Preview
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'histograms' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}
          onClick={() => setActiveTab('histograms')}
        >
          Histograms
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'correlation' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}
          onClick={() => setActiveTab('correlation')}
        >
          Correlation
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'feature-importance' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}
          onClick={() => setActiveTab('feature-importance')}
        >
          Feature Importance
        </button>
      </div>
      
      <div className="flex-grow overflow-auto">
        {/* Error message */}
        {error && activeTab === 'data-preview' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
        
        {activeTab === 'data-preview' && isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-slate-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : activeTab === 'data-preview' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sex</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Length</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Diameter</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Height</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Weight</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {dataPreview.map((row) => (
                  <tr key={row.id as number} className="hover:bg-slate-50">
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-slate-500">{row.id}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-slate-500">{row.sex}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-slate-500">
                      {typeof row.length === 'number' ? row.length.toFixed(3) : row.length}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-slate-500">
                      {typeof row.diameter === 'number' ? row.diameter.toFixed(3) : row.diameter}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-slate-500">
                      {typeof row.height === 'number' ? row.height.toFixed(3) : row.height}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-slate-500">
                      {typeof row.weight === 'number' ? row.weight.toFixed(3) : row.weight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center text-sm text-slate-500 mt-2">
              Showing {dataPreview.length} of {totalRows} rows
            </div>
          </div>
        )}
        
        {activeTab === 'histograms' && (
          <div className="p-4 bg-slate-50 rounded-md text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-slate-600">Histogram visualizations would appear here</p>
            <p className="text-sm text-slate-500 mt-2">Showing distribution of numerical features</p>
          </div>
        )}
        
        {activeTab === 'correlation' && (
          <div className="p-4 bg-slate-50 rounded-md text-center">
            <div className="text-6xl mb-4">🔄</div>
            <p className="text-slate-600">Correlation matrix would appear here</p>
            <p className="text-sm text-slate-500 mt-2">Showing relationships between features</p>
          </div>
        )}
        
        {activeTab === 'feature-importance' && (
          <div className="p-4 bg-slate-50 rounded-md text-center">
            <div className="text-6xl mb-4">📈</div>
            <p className="text-slate-600">Feature importance plot would appear here</p>
            <p className="text-sm text-slate-500 mt-2">Showing most influential features for prediction</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataArtifactsPanel;
