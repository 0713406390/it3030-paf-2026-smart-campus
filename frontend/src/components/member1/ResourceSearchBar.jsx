import React, { useState } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';

const ResourceSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Auto-search as user types
    onSearch(value);
  };

  return (
    <Form onSubmit={handleSearch}>
      <InputGroup style={{ gap: '8px' }}>
        <Form.Control
          placeholder="Search by resource name..."
          value={searchTerm}
          onChange={handleInputChange}
          style={{ 
            borderColor: '#dee2e6',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '14px',
            border: '1.5px solid #dee2e6',
            transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#0d6efd'}
          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
        />
        <Button 
          variant="outline-secondary" 
          onClick={handleReset}
          style={{
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '14px',
            padding: '10px 18px',
            border: '1.5px solid #dee2e6'
          }}
        >
          Clear
        </Button>
      </InputGroup>
    </Form>
  );
};

export default ResourceSearchBar;
