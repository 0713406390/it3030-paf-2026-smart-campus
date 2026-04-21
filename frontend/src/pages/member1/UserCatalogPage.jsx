import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import ResourceSearchBar from '../../components/member1/ResourceSearchBar';
import ResourceFilterBar from '../../components/member1/ResourceFilterBar';
import ResourceGrid from '../../components/member1/ResourceGrid';
import ResourceListView from '../../components/member1/ResourceListView';
import resourceService from '../../services/member1/resourceService';

const UserCatalogPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    capacity: '',
    location: '',
    status: ''
  });

  useEffect(() => {
    fetchResources();
  }, [currentPage, pageSize, filters, searchTerm]);

  const fetchResources = async () => {
    setLoading(true);
    setError('');
    try {
      const filterParams = {
        type: filters.type || null,
        capacity: filters.capacity ? parseInt(filters.capacity) : null,
        location: filters.location || null,
        status: filters.status || null
      };

      const response = await resourceService.searchResources(
        searchTerm,
        filterParams,
        currentPage,
        pageSize
      );

      const data = response.data;
      const resourcesData = data.content || data || [];
      const totalPagesData = data.totalPages || 0;

      setResources(Array.isArray(resourcesData) ? resourcesData : []);
      setTotalPages(totalPagesData);
    } catch (err) {
      setError('Failed to load resources');
      console.error('Error loading resources:', err);
      setResources([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(0);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <Container fluid style={{ marginTop: '0px', marginBottom: '40px', paddingTop: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Professional Header Section */}
      <div style={{ 
        marginBottom: '40px', 
        backgroundColor: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
        padding: '40px 0',
        marginLeft: '-12px',
        marginRight: '-12px',
        marginTop: '-40px',
        backgroundImage: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
        paddingLeft: '12px',
        paddingRight: '12px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
          <h1 style={{ fontWeight: '700', color: '#ffffff', marginBottom: '8px', fontSize: '32px' }}>
            Resource Catalog
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', marginBottom: '0px' }}>
            Access and search campus resources and facilities easily.
          </p>
        </div>
      </div>

      {/* Search & Filter Section */}
      <Card style={{ 
        marginBottom: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: 'none'
      }}>
        <Card.Body style={{ padding: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '15px' }}>Search</p>
            <ResourceSearchBar onSearch={handleSearch} />
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '15px' }}>Filters</p>
            <ResourceFilterBar onFilterChange={handleFilterChange} filters={filters} />
          </div>
        </Card.Body>
      </Card>

      {/* View Mode & Results Info Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ color: '#6c757d', fontSize: '14px', fontWeight: '500' }}>
          {!loading && resources.length > 0 && (
            <span>Showing <strong style={{ color: '#1a3a52' }}>{resources.length}</strong> resource{resources.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ marginBottom: '0', fontWeight: '600', color: '#1a3a52', fontSize: '14px' }}>View Mode:</label>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => handleViewModeChange('grid')}
            style={{ 
              padding: '8px 16px',
              fontWeight: '500',
              fontSize: '14px',
              borderRadius: '6px',
              border: viewMode === 'grid' ? 'none' : '1.5px solid #0d6efd'
            }}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => handleViewModeChange('list')}
            style={{ 
              padding: '8px 16px',
              fontWeight: '500',
              fontSize: '14px',
              borderRadius: '6px',
              border: viewMode === 'list' ? 'none' : '1.5px solid #0d6efd'
            }}
          >
            List View
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card style={{ 
          marginBottom: '30px', 
          backgroundColor: '#f8d7da', 
          borderColor: '#f5c6cb',
          borderRadius: '12px',
          border: '1px solid #f5c6cb'
        }}>
          <Card.Body style={{ color: '#721c24', padding: '16px 20px', fontSize: '14px', fontWeight: '500' }}>
            Error: {error}
          </Card.Body>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6c757d' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              margin: '0 auto',
              border: '4px solid #e9ecef',
              borderTop: '4px solid #0d6efd',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
          <p style={{ fontSize: '15px', fontWeight: '500' }}>Loading resources...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Resources Display */}
      {!loading && resources.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <ResourceGrid resources={resources} />
          ) : (
            <ResourceListView resources={resources} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card style={{
              marginTop: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: 'none',
              backgroundColor: '#ffffff'
            }}>
              <Card.Body style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                padding: '24px'
              }}>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  style={{ 
                    padding: '8px 16px',
                    fontWeight: '500',
                    fontSize: '14px',
                    borderRadius: '6px'
                  }}
                >
                  Previous
                </Button>
                <div style={{ 
                  backgroundColor: '#e9ecef', 
                  padding: '8px 16px', 
                  borderRadius: '6px',
                  color: '#1a3a52', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  minWidth: '160px', 
                  textAlign: 'center' 
                }}>
                  Page {currentPage + 1} of {totalPages}
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  style={{ 
                    padding: '8px 16px',
                    fontWeight: '500',
                    fontSize: '14px',
                    borderRadius: '6px'
                  }}
                >
                  Next
                </Button>
              </Card.Body>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && resources.length === 0 && !error && (
        <Card style={{
          marginTop: '60px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          textAlign: 'center',
          border: 'none',
          backgroundColor: '#ffffff'
        }}>
          <Card.Body style={{ padding: '80px 40px', color: '#6c757d' }}>
            <div style={{ marginBottom: '20px', fontSize: '48px' }}>📋</div>
            <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a3a52' }}>No Resources Found</p>
            <p style={{ fontSize: '15px', marginBottom: '0px' }}>Try adjusting your search criteria or applying different filters</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default UserCatalogPage;
