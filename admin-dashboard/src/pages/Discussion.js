import React, { useState } from 'react';
import { Typography, Box, TextField, Button, Paper, Stack, Avatar } from '@mui/material';

const initialMessages = [
  { id: 1, user: 'Alice', text: 'Hello everyone!' },
  { id: 2, user: 'Bob', text: 'Hi Alice!' },
  { id: 3, user: 'Carol', text: 'Good morning!' },
];

function Discussion() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, user: 'You', text: input }]);
      setInput('');
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>Discussion</Typography>
      <Paper sx={{ p: 2, mb: 2, minHeight: 200, maxHeight: 350, overflowY: 'auto' }}>
        {messages.map((msg) => (
          <Stack key={msg.id} direction="row" spacing={2} alignItems="flex-start" mb={1}>
            <Avatar>{msg.user[0]}</Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">{msg.user}:</Typography>
              <Typography variant="body2">{msg.text}</Typography>
            </Box>
          </Stack>
        ))}
      </Paper>
      <Box display="flex" gap={1}>
        <TextField
          label="Type a message"
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <Button variant="contained" onClick={handleSend}>Send</Button>
      </Box>
    </Box>
  );
}

export default Discussion; 