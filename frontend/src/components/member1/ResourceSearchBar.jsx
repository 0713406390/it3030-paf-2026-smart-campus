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
    <Form onSubmit={handleSearch} style={{ marginBottom: '15px' }}>
      <InputGroup>
        <Form.Control
          placeholder="Search by resource name..."
          value={searchTerm}
          onChange={handleInputChange}
          style={{ borderColor: '#dee2e6' }}
        />
        <Button variant="outline-secondary" onClick={handleReset}>
          Clear
        </Button>
      </InputGroup>
    </Form>
  );
};

export default ResourceSearchBar;
