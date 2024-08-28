import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface CoverLetterModalProps {
  show: boolean;
  handleClose: () => void;
  handleSubmit: (coverLetter: string) => void;
}

const CoverLetterModal: React.FC<CoverLetterModalProps> = ({ show, handleClose, handleSubmit }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = () => {
    if (!coverLetter.trim()) {
      setError('Cover letter cannot be empty.');
      return;
    }

    handleSubmit(coverLetter);
    setCoverLetter('');
    setError(null);
  };

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCoverLetter(e.target.value);
    if (e.target.value.trim()) {
      setError(null);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Submit Cover Letter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="coverLetter">
            <Form.Label>Cover Letter</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={coverLetter}
              onChange={handleCoverLetterChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={onSubmit} 
          disabled={!coverLetter.trim()}  // Disable the button if no cover letter is typed
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CoverLetterModal;
