import React, { useState, useEffect } from 'react';
import { 
  Card, 
  ListGroup, 
  Form, 
  Button, 
  Alert, 
  Spinner,
  Modal
} from 'react-bootstrap';
import { 
  getTicketComments, 
  addComment, 
  updateComment, 
  deleteComment 
} from '../../services/member3/ticketService';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';

const TicketComments = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const { user } = useAuth();
  const isAdminView = (user?.roles || []).includes('ADMIN');

  const isAdminAuthor = (author) => {
    const authorName = (author?.name || '').toLowerCase().trim();
    return author?.id === 1 || authorName === 'admin' || authorName === 'administrator';
  };

  const isUserCommentForAdmin = (comment) => isAdminView && !isAdminAuthor(comment?.author);
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getTicketComments(ticketId);
        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(
          err.response?.data?.message || 
          'Failed to load comments. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [ticketId]);
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const comment = await addComment(ticketId, newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(
        err.response?.data?.message || 
        'Failed to add comment. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };
  
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;
    
    try {
      const updatedComment = await updateComment(commentId, editContent);
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? updatedComment : comment
        )
      );
      setEditingComment(null);
      setEditContent('');
    } catch (err) {
      console.error('Error updating comment:', err);
      setError(
        err.response?.data?.message || 
        'Failed to update comment. Please try again.'
      );
    }
  };
  
  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };
  
  const handleDeleteComment = async () => {
    try {
      await deleteComment(commentToDelete);
      setComments(prev => prev.filter(comment => comment.id !== commentToDelete));
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(
        err.response?.data?.message || 
        'Failed to delete comment. Please try again.'
      );
    }
  };
  
  const canEditComment = (comment) => {
    return comment.author.id === user.id || (user?.roles || []).includes('ADMIN');
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
      
      <h5 className="mb-3">Comments</h5>
      
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleAddComment}>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      {comments.length === 0 ? (
        <Alert variant="info">No comments yet. Be the first to comment!</Alert>
      ) : (
        <ListGroup>
          {comments.map(comment => (
            <ListGroup.Item
              key={comment.id}
              className={`border-0 border-bottom ${isUserCommentForAdmin(comment) ? 'bg-warning-subtle border border-warning rounded my-1' : ''}`}
            >
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div className="fw-bold">{comment.author.name}</div>
                  {isUserCommentForAdmin(comment) && (
                    <span className="badge text-bg-warning">User Comment</span>
                  )}
                </div>
                <small className="text-muted">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </small>
              </div>
              
              {editingComment === comment.id ? (
                <div className="mt-2">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setEditingComment(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateComment(comment.id)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <p className={`mb-1 ${isUserCommentForAdmin(comment) ? 'fw-semibold text-dark' : ''}`}>
                    {comment.content}
                  </p>
                  
                  {canEditComment(comment) && (
                    <div className="d-flex gap-2">
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0"
                        onClick={() => handleEditComment(comment)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-danger"
                        onClick={() => handleDeleteClick(comment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this comment? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteComment}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TicketComments;