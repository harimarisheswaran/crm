import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input, Select } from '../common/Input';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { BookPlus } from 'lucide-react';

export const AddBookModal = ({ isOpen, onClose }) => {
  const { addBook } = useData();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Science',
    publisher: 'Academic Press',
    published_year: 2022,
    total_copies: 5,
    shelf_location: 'Shelf S-01',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;

    addBook({
      ...formData,
      isbn: formData.isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      total_copies: Number(formData.total_copies),
      published_year: Number(formData.published_year),
    });

    success(`Book "${formData.title}" added to library catalog!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Book to Library"
      subtitle="Catalog new academic textbooks and reference materials"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Book Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Modern Quantum Physics"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Author"
            required
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="e.g. Richard Feynman"
          />
          <Input
            label="ISBN Number"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            placeholder="Auto-generated if empty"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Science', label: 'Science' },
              { value: 'Mathematics', label: 'Mathematics' },
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Literature', label: 'Literature' },
              { value: 'History', label: 'History' },
              { value: 'Arts', label: 'Arts' },
            ]}
          />
          <Input
            label="Shelf Location"
            value={formData.shelf_location}
            onChange={(e) => setFormData({ ...formData, shelf_location: e.target.value })}
            placeholder="e.g. Shelf SCI-04"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Publisher"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
          />
          <Input
            label="Total Copies"
            type="number"
            min={1}
            value={formData.total_copies}
            onChange={(e) => setFormData({ ...formData, total_copies: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={BookPlus}>
            Catalog Book
          </Button>
        </div>
      </form>
    </Modal>
  );
};

