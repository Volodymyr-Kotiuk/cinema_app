import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Movie } from '../../types/movie'
import Link from 'next/link'

export default function MoviePage() {
  const router = useRouter()
  const { id } = router.query
  const [movie, setMovie] = useState<Movie | null>(null)

  useEffect(() => {
    if (id) {
      axios
        .get<Movie>(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`)
        .then((res) => setMovie(res.data))
        .catch((err) => console.error('Помилка при завантаженні фільму:', err))
    }
  }, [id])

  const handleBuy = async () => {
    if (movie && movie.available_seats > 0) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      cart.push(movie)
      localStorage.setItem('cart', JSON.stringify(cart))
      alert(`Квиток на "${movie.title}" додано до корзини`)

      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${movie.id}/decrease`)
        setMovie({ ...movie, available_seats: movie.available_seats - 1 })
      } catch (err) {
        console.error('Помилка оновлення місць:', err)
      }
    }
  }

  if (!movie) {
    return <div className="container mt-5 text-center">Завантаження фільму...</div>
  }

  return (
    <div style={{ backgroundColor: '#121212', color: '#ffffff', padding: '4rem 12rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <Link
          href="/"
          className="btn"
          style={{
            backgroundColor: '#121212',
            color: '#ffffff',
            border: '1px solid #ffffff',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ff0000'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#121212'
          }}
        >
          ← Назад до фільмів
        </Link>

        <Link
          href="/cart"
          className="btn border border-white text-white"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ff0000'
            e.currentTarget.style.borderColor = '#ff0000'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.borderColor = '#ffffff'
          }}
        >
          <i className="bi bi-cart"></i>
        </Link>
      </div>

      <div className="d-flex flex-wrap gap-4 align-items-start mb-4">
  <img
    src={movie.poster_url}
    alt={movie.title}
    style={{ maxHeight: '400px', width: 'auto', borderRadius: '10px' }}
  />

  {/* Правий блок */}
  <div
    className="d-flex flex-column justify-content-between"
    style={{ flex: 1, height: '400px' }}
  >
    {/* Назва + сеанс */}
    <div>
      <h2 style={{ color: '#ffffff' }}>{movie.title}</h2>
      <p style={{ color: '#ffffff' }}>Сеанс: {new Date(movie.session_time).toLocaleString()}</p>
    </div>

    {/* Ціна + місця + кнопка */}
    <div style={{ color: '#ffffff' }}>
      <p style={{ fontSize: '18px', marginBottom: '0.25rem' }}>{movie.price} ₴</p>
      <p style={{ marginBottom: '0.75rem' }}>
        Місця: {movie.available_seats}/{movie.total_seats}
      </p>
      <button
        className="btn"
        style={{
          backgroundColor: '#ff0000',
          color: '#fff',
          fontSize: '16px',
          padding: '0.5rem 1.2rem',
          borderRadius: '10px',
          height: '48px',
          width: 'auto',
          minWidth: '120px'
        }}
        onClick={handleBuy}
        disabled={movie.available_seats === 0}
      >
        {movie.available_seats === 0 ? 'Немає місць' : 'Купити'}
      </button>
    </div>
  </div>
</div>
      <div className="ratio ratio-16x9 mb-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <iframe src={movie.trailer_url} title={movie.title} allowFullScreen></iframe>
      </div>

      <p style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '4rem' }}>{movie.description}</p>

      <style jsx>{`
        @media (max-width: 768px) {
          div {
            padding: 2rem 1rem !important;
          }

          .d-flex.justify-content-between {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .d-flex.flex-wrap {
            flex-direction: column;
            align-items: center;
          }

          img {
            width: 100% !important;
            height: auto;
          }

          .ratio {
            width: 100% !important;
            height: auto !important;
          }

          iframe {
            height: 200px !important;
          }
        }
      `}</style>
    </div>
  )
}
