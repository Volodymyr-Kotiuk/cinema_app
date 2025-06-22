import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Movie } from '../types/movie'

export default function AdminPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    poster_url: '',
    trailer_url: '',
    session_time: '',
    total_seats: '',
  })
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = () => {
    axios.get<Movie[]>('http://localhost:3001/movies').then((res) => {
      setMovies(res.data)
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3001/movies', {
        ...form,
        price: parseFloat(form.price),
        total_seats: parseInt(form.total_seats),
        session_time: new Date(form.session_time).toISOString(),
      })
      alert('Фільм додано успішно!')
      setForm({
        title: '',
        description: '',
        price: '',
        poster_url: '',
        trailer_url: '',
        session_time: '',
        total_seats: '',
      })
      fetchMovies()
    } catch {
      alert('Помилка при додаванні фільму!')
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Видалити цей фільм?')) {
      await axios.delete(`http://localhost:3001/movies/${id}`)
      fetchMovies()
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#121212',
        color: '#ffffff',
        padding: '2rem 12.5%',
        minHeight: '100vh'
      }}
    >
      <style jsx>{`
        @media (max-width: 768px) {
          div {
            padding: 2rem 1rem !important;
          }
        }
        .form-control {
          background-color: #2a2929;
          color: #ffffff;
          border: none;
        }
        .form-control:focus {
          background-color: #2a2929;
          color: #ffffff;
          box-shadow: none;
        }
      `}</style>

      <div className="d-flex justify-content-between mb-4">
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
      </div>

      <h2 className="mb-4">Додати новий фільм</h2>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label>Назва фільму</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Опис</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Ціна</label>
          <input
            className="form-control"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Посилання на постер</label>
          <input
            className="form-control"
            name="poster_url"
            value={form.poster_url}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Посилання на трейлер (YouTube embed)</label>
          <input
            className="form-control"
            name="trailer_url"
            value={form.trailer_url}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Час сеансу</label>
          <input
            className="form-control"
            type="datetime-local"
            name="session_time"
            value={form.session_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Кількість місць</label>
          <input
            className="form-control"
            type="number"
            name="total_seats"
            value={form.total_seats}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="btn"
          style={{ backgroundColor: '#ff0000', color: '#ffffff' }}
        >
          Додати фільм
        </button>
      </form>

      <h3 className="mb-3">Усі фільми</h3>

      {movies.length === 0 ? (
        <p>Фільмів поки немає.</p>
      ) : (
        <ul className="list-group">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ backgroundColor: '#2a2929', color: '#ffffff', border: 'none' }}
            >
              <div>
                <strong>{movie.title}</strong> — {movie.price} ₴ — Сеанс: {new Date(movie.session_time).toLocaleString()} — Місця: {movie.available_seats}/{movie.total_seats}
              </div>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: '#ff0000', color: '#ffffff' }}
                onClick={() => handleDelete(movie.id)}
              >
                Видалити
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
