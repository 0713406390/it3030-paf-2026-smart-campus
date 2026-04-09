import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Card, 
  ListGroup, 
  Button, 
  Alert, 
  Spinner,
  Modal,
  Form
} from 'react-bootstrap';
import { 
  getTicketAttachments,
  viewAttachment,
  uploadAttachments, 
  deleteAttachment 
} from '../../services/member3/ticketService';
import { useAuth } from '../../hooks/useAuth';

const TicketAttachments = ({ ticketId }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const data = await getTicketAttachments(ticketId);
        setAttachments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load attachments. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttachments();
  }, [ticketId]);
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding these files would exceed the limit of 3
    if (attachments.length + files.length > 3) {
      setUploadError('Maximum of 3 attachments allowed per ticket');
      return;
    }
    
    setSelectedFiles(files);
    setUploadError(null);
  };
  
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      await uploadAttachments(ticketId, selectedFiles);
      const refreshed = await getTicketAttachments(ticketId);
      setAttachments(Array.isArray(refreshed) ? refreshed : []);
      setShowUploadModal(false);
      setSelectedFiles([]);
    } catch (err) {
      console.error('Error uploading attachments:', err);
      setUploadError(
        err.response?.data?.message || 
        'Failed to upload attachments. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteAttachment = async (attachmentId) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) {
      return;
    }
    
    try {
      await deleteAttachment(attachmentId);
      setAttachments(prev => prev.filter(a => a.id !== attachmentId));
    } catch (err) {
      console.error('Error deleting attachment:', err);
      setError(
        err.response?.data?.message || 
        'Failed to delete attachment. Please try again.'
      );
    }
  };

  const handleViewAttachment = async (attachmentId) => {
    try {
      await viewAttachment(attachmentId);
    } catch (err) {
      console.error('Error viewing attachment:', err);
      setError(
        err.response?.data?.message ||
        'Failed to open attachment. Please sign in again and try.'
      );
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  
  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Attachments</h5>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShowUploadModal(true)}
          disabled={attachments.length >= 3}
        >
          Add Attachment
        </Button>
      </div>
      
      {attachments.length === 0 ? (
        <Alert variant="info">No attachments for this ticket.</Alert>
      ) : (
        <Card>
          <ListGroup variant="flush">
            {attachments.map(attachment => (
              <ListGroup.Item 
                key={attachment.id} 
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <div>{attachment.fileName}</div>
                  <small className="text-muted">
                    {formatFileSize(attachment.fileSize)} • 
                    Uploaded {formatDistanceToNow(new Date(attachment.uploadedAt), { addSuffix: true })}
                  </small>
                </div>
                
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleViewAttachment(attachment.id)}
                    className="me-2"
                  >
                    View
                  </Button>
                  
                  {(attachment?.ticket?.reporter?.id === user.id || (user?.roles || []).includes('ADMIN')) && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteAttachment(attachment.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
      
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Attachments</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {uploadError && <Alert variant="danger">{uploadError}</Alert>}
          
          <Form.Group>
            <Form.Label>Select Files</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileSelect}
              accept="image/*"
            />
            <Form.Text className="text-muted">
              You can upload up to 3 images. Maximum file size: 5MB per file.
            </Form.Text>
          </Form.Group>
          
          {selectedFiles.length > 0 && (
            <div className="mt-3">
              <h6>Selected Files:</h6>
              <ListGroup>
                {selectedFiles.map((file, index) => (
                  <ListGroup.Item key={index}>
                    {file.name} ({formatFileSize(file.size)})
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default TicketAttachments;