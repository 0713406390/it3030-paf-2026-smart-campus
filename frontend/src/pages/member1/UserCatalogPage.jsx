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
    <Container fluid style={{ marginTop: '30px', marginBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontWeight: '600', color: '#1a3a52', marginBottom: '10px' }}>
          Resource Catalogue
        </h2>
      </div>

      {/* Search & Filter Section */}
      <Card style={{ marginBottom: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body style={{ padding: '20px' }}>
          <ResourceSearchBar onSearch={handleSearch} />
          <ResourceFilterBar onFilterChange={handleFilterChange} filters={filters} />
        </Card.Body>
      </Card>

      {/* View Mode Section */}
      <Card style={{ marginBottom: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body style={{ padding: '15px 20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
          <label style={{ marginBottom: '0', fontWeight: '500', color: '#1a3a52' }}>View:</label>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => handleViewModeChange('grid')}
            style={{ padding: '6px 12px' }}
          >
            ⊞ Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => handleViewModeChange('list')}
            style={{ padding: '6px 12px' }}
          >
            ☰ List
          </Button>
        </Card.Body>
      </Card>

      {/* Error Message */}
      {error && (
        <Card style={{ marginBottom: '20px', backgroundColor: '#f8d7da', borderColor: '#f5c6cb' }}>
          <Card.Body style={{ color: '#721c24', padding: '12px 20px' }}>
            {error}
          </Card.Body>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          <p>Loading resources...</p>
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
              marginTop: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <Card.Body style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px',
                padding: '15px'
              }}>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  ← Previous
                </Button>
                <span style={{ color: '#6c757d', fontSize: '14px', minWidth: '150px', textAlign: 'center' }}>
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next →
                </Button>
              </Card.Body>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && resources.length === 0 && !error && (
        <Card style={{
          marginTop: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <Card.Body style={{ padding: '60px 20px', color: '#6c757d' }}>
            <p style={{ fontSize: '16px', marginBottom: '10px' }}>No resources found</p>
            <p style={{ fontSize: '14px' }}>Try adjusting your search or filters</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default UserCatalogPage;
