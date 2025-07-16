import React, { useState } from 'react';
import { Typography, Card, CardContent, Box, TextField, Button, Stack } from '@mui/material';

const initialReviews = [
  { id: 1, user: 'Alice Johnson', text: 'Great service and support!' },
  { id: 2, user: 'Bob Smith', text: 'Very helpful dashboard.' },
  { id: 3, user: 'Carol Lee', text: 'Easy to use and navigate.' },
];

function Reviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewText, setReviewText] = useState('');

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviews([
      { id: Date.now(), user: 'You', text: reviewText },
      ...reviews,
    ]);
    setReviewText('');
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>Reviews</Typography>
      <Box component="form" onSubmit={handleAddReview} mb={3}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Write a review..."
            variant="outlined"
            fullWidth
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
          />
          <Button type="submit" variant="contained">Add</Button>
        </Stack>
      </Box>
      {reviews.map((review) => (
        <Card key={review.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">{review.user}</Typography>
            <Typography variant="body1">{review.text}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default Reviews; 