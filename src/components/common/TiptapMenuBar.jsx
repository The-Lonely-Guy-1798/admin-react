// src/components/common/TiptapMenuBar.jsx

import React from 'react';
import { Button, Box, Divider } from '@mui/material';

const TiptapMenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      <Button size="small" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} variant={editor.isActive('bold') ? 'contained' : 'outlined'}>
        Bold
      </Button>
      <Button size="small" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} variant={editor.isActive('italic') ? 'contained' : 'outlined'}>
        Italic
      </Button>
      <Button size="small" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} variant={editor.isActive('strike') ? 'contained' : 'outlined'}>
        Strike
      </Button>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      <Button size="small" onClick={() => editor.chain().focus().setParagraph().run()} variant={editor.isActive('paragraph') ? 'contained' : 'outlined'}>
        Paragraph
      </Button>
      <Button size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} variant={editor.isActive('heading', { level: 1 }) ? 'contained' : 'outlined'}>
        H1
      </Button>
      <Button size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} variant={editor.isActive('heading', { level: 2 }) ? 'contained' : 'outlined'}>
        H2
      </Button>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      <Button size="small" onClick={() => editor.chain().focus().toggleBulletList().run()} variant={editor.isActive('bulletList') ? 'contained' : 'outlined'}>
        Bullet List
      </Button>
      <Button size="small" onClick={() => editor.chain().focus().toggleOrderedList().run()} variant={editor.isActive('orderedList') ? 'contained' : 'outlined'}>
        Ordered List
      </Button>
    </Box>
  );
};

export default TiptapMenuBar;