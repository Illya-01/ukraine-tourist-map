import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Rating,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material'
import { NewReview, Review } from '../../types'

interface ReviewFormProps {
  attractionId: string
  existingReview?: Review
  onSubmit: (attractionId: string, review: NewReview) => Promise<void>
  onCancel?: () => void
  isEdit?: boolean
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  attractionId,
  existingReview,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [rating, setRating] = useState<number | null>(existingReview?.rating || null)
  const [text, setText] = useState(existingReview?.text || '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rating) {
      setError('Будь ласка, вкажіть рейтинг')
      return
    }

    if (text.trim().length < 10) {
      setError('Відгук має містити щонайменше 10 символів')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSubmit(attractionId, { rating, text })
      if (!isEdit) {
        // Reset form if it's a new review
        setRating(null)
        setText('')
      }
    } catch (err: any) {
      setError(err.message || 'Не вдалося зберегти відгук')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="subtitle1" gutterBottom>
          {isEdit ? 'Редагувати відгук' : 'Залишити відгук'}
        </Typography>

        <Box mb={2}>
          <Typography component="legend" variant="body2" mb={1}>
            Ваша оцінка
          </Typography>
          <Rating
            name="review-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            precision={1}
            size="large"
          />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Ваш відгук"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Поділіться своїми враженнями про це місце..."
          variant="outlined"
          required
          disabled={loading}
          error={!!error && text.trim().length < 10}
          helperText={error && text.trim().length < 10 ? error : ''}
          sx={{ mb: 2 }}
        />

        {error && text.trim().length >= 10 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" justifyContent="flex-end" gap={1}>
          {onCancel && (
            <Button onClick={onCancel} disabled={loading}>
              Скасувати
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {isEdit ? 'Зберегти зміни' : 'Опублікувати'}
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default ReviewForm
