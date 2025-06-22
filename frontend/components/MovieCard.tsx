import React from 'react'
import { Movie } from '../types/movie'
import { useRouter } from 'next/router'

interface Props {
  movie: Movie
  onBuyClick: (movie: Movie) => void
}

const MovieCard: React.FC<Props> = ({ movie, onBuyClick }) => {
  const router = useRouter()

  return (
    <div
      className="card mb-3 shadow-sm border-0 rounded-3 movie-card"
      style={{
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onClick={() => router.push(`/movie/${movie.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="row g-0 align-items-center">
        <div className="col-md-3 text-center p-3">
          <h5 className="text-success mb-3">{movie.price} ₴</h5>
          <button
            className="btn btn-outline-primary"
            onClick={(e) => {
              e.stopPropagation()
              onBuyClick(movie)
            }}
          >
            Купити квиток
          </button>
        </div>
        <div className="col-md-9 d-flex align-items-center">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="img-fluid rounded-start"
            style={{ height: '120px', width: '80px', objectFit: 'cover', marginRight: '15px' }}
          />
          <h5 className="card-title mb-0">{movie.title}</h5>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
