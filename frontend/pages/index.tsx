import { useEffect, useState } from 'react'
import axios from 'axios'
import { Movie } from '../types/movie'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
  axios.get<Movie[]>(`${process.env.NEXT_PUBLIC_API_URL}/movies`).then((res) => {
    setMovies(res.data)
  })
}, [])

  const handleBuy = async (movie: Movie) => {
    if (movie.available_seats === 0) return

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(movie)
    localStorage.setItem('cart', JSON.stringify(cart))

    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${movie.id}/decrease`)
      setMovies((prev) =>
        prev.map((m) =>
          m.id === movie.id ? { ...m, available_seats: m.available_seats - 1 } : m
        )
      )
    } catch (err) {
      console.error('Помилка оновлення місць:', err)
    }
  }

  const handleAdminLogin = () => {
    if (adminPassword === '1111') {
      setShowAdminLogin(false)
      setAdminPassword('')
      router.push('/admin')
    } else {
      alert('Доступ заборонено')
      setShowAdminLogin(false)
      setAdminPassword('')
    }
  }

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '2rem' }}>
      {/* Верхній бар */}
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ paddingInline: '12.5%' }}>
        {/* + */}
        <button
          className="btn border border-white text-white"
          style={{
            width: '48px',
            height: '48px',
            fontSize: '24px',
            borderRadius: '8px',
            transition: 'all 0.3s',
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
          onClick={() => setShowAdminLogin(true)}
        >
          +
        </button>

        <h2 style={{ color: '#ffffff', margin: 0, fontWeight: 'bold' }}>Автокінотеатр</h2>

        {/* Кошик */}
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

      {/* Модальне вікно */}
      {showAdminLogin && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1050
          }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ backgroundColor: '#2a2929', color: '#ffffff' }}>
              <div className="modal-header">
                <h5 className="modal-title">Вхід адміністратора</h5>
                <button type="button" className="btn-close" onClick={() => setShowAdminLogin(false)}></button>
              </div>
              <div className="modal-body">
                <label>Введіть пароль:</label>
                <input
                  type="password"
                  className="form-control mt-2"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAdminLogin(false)}>
                  Скасувати
                </button>
                <button className="btn" style={{ backgroundColor: '#ff0000', color: '#fff' }} onClick={handleAdminLogin}>
                  Підтвердити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Картки */}
<div className="d-flex flex-column align-items-center gap-3 mt-4">
  {movies.length === 0 ? (
    <p style={{ color: '#ff0000', fontSize: '18px' }}>Сеанси відсутні</p>
  ) : (
    movies.map((movie) => (
      <div
        key={movie.id}
        className="d-flex align-items-center"
        style={{
          width: '75%',
          backgroundColor: '#2a2929',
          color: '#ffffff',
          padding: '1rem',
          borderRadius: '20px',
          cursor: 'pointer',
          transition: '0.3s'
        }}
        onClick={() => window.location.href = `/movies/${movie.id}`}
      >
        {/* Фото */}
        <img
          src={movie.poster_url}
          alt={movie.title}
          style={{ height: '140px', width: 'auto', objectFit: 'cover', borderRadius: '5px' }}
        />

        {/* Назва + час */}
        <div style={{ marginLeft: '1.5rem', flex: 1 }}>
          <h4 className="mb-1">{movie.title}</h4>
          <p className="mb-0">Сеанс: {new Date(movie.session_time).toLocaleString()}</p>
        </div>

        {/* Ціна + місця + кнопка */}
        <div className="d-flex align-items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <div className="text-end">
            <p className="mb-1">{movie.price} ₴</p>
            <p className="mb-0">Місця: {movie.available_seats}/{movie.total_seats}</p>
          </div>
          <button
            className="btn"
            style={{
              backgroundColor: '#ff0000',
              color: '#fff',
              fontSize: '16px',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              height: '48px',
              display: 'flex',
              alignItems: 'center'
            }}
            disabled={movie.available_seats === 0}
            onClick={() => handleBuy(movie)}
          >
            {movie.available_seats === 0 ? 'Немає місць' : 'Купити'}
          </button>
        </div>
      </div>
    ))
  )}
</div>

                  <style jsx>{`
        @media (max-width: 768px) {
          h2 {
            font-size: 24px;
            text-align: center;
            margin-top: 1rem;
          }

          .modal-content {
            margin: 1rem;
          }

          /* Верхній бар: плюс та кошик на одному рівні */
          .d-flex.justify-content-between.align-items-center.mb-4 {
            justify-content: space-between !important;
            flex-direction: row !important;
            flex-wrap: wrap;
            padding-inline: 1rem !important;
          }

          /* Заголовок під верхнім баром */
          .header-title {
            order: 1;
            width: 100%;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-top: 1rem;
            color: #fff;
          }

          .d-flex.flex-column.align-items-center.gap-3.mt-4 > div {
            width: 100% !important;
            flex-direction: column !important;
            text-align: center;
          }

          .d-flex.flex-column.align-items-center.gap-3.mt-4 > div img {
            width: 100% !important;
            height: auto !important;
            margin-bottom: 1rem;
          }

          .d-flex.flex-column.align-items-center.gap-3.mt-4 > div > div {
            margin-left: 0 !important;
          }

          .d-flex.flex-column.align-items-center.gap-3.mt-4 > div .text-end {
            text-align: center !important;
          }

          .d-flex.align-items-center.gap-3 {
            flex-direction: column;
            gap: 0.5rem !important;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
