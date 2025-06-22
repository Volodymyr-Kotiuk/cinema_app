import { useEffect, useState } from 'react'
import { Movie } from '../types/movie'
import Link from 'next/link'
import axios from 'axios'

export default function CartPage() {
  const [cart, setCart] = useState<Movie[]>([])

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
  }, [])

  const handleRemove = async (index: number) => {
    const removedMovie = cart[index]
    const updatedCart = [...cart]
    updatedCart.splice(index, 1)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))

    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${removedMovie.id}/increase`)
    } catch (err) {
      console.error('Помилка при поверненні місця:', err)
    }
  }

  const handleClear = async () => {
    for (const movie of cart) {
      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${movie.id}/increase`)
      } catch (err) {
        console.error('Помилка при поверненні місця:', err)
      }
    }
    setCart([])
    localStorage.removeItem('cart')
  }

  const total = cart.reduce((sum, movie) => {
    const priceNum = Number(movie.price)
    return sum + (isNaN(priceNum) ? 0 : priceNum)
  }, 0)

  return (
    <>
      <style jsx>{`
        .cart-container {
          background-color: #121212;
          min-height: 100vh;
          padding: 4rem 12rem;
        }

        @media (max-width: 768px) {
          .cart-container {
            padding: 1rem;
          }

          .cart-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .cart-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .list-group-item {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 0.5rem;
          }
        }
      `}</style>

      <div className="cart-container">
        {/* Верхній ряд */}
        <div className="d-flex justify-content-between align-items-center mb-4 cart-top">
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

          <button
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
            onClick={handleClear}
          >
            Очистити кошик
          </button>
        </div>

        {/* Заголовок і сума */}
        <div className="d-flex justify-content-between align-items-center mb-4 cart-header">
          <h2 style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <i className="bi bi-ticket-perforated-fill" style={{ color: '#ff0000' }}></i> Ваші квитки
          </h2>
          <h4 style={{ color: '#ffffff', margin: 0 }}>
            Загальна сума:{' '}
            <span style={{ color: '#ff0000' }}>{total.toFixed(2)} ₴</span>
          </h4>
        </div>

        {/* Список квитків */}
        {cart.length === 0 ? (
          <p style={{ color: '#ffffff' }}>Кошик порожній.</p>
        ) : (
          <div className="list-group mb-4">
            {cart.map((movie, index) => (
              <div
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  backgroundColor: '#2a2929',
                  color: '#ffffff',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}
              >
                <div>
                  <i className="bi bi-ticket-perforated-fill" style={{ color: '#ff0000', marginRight: '10px' }}></i>
                  <strong>{movie.title}</strong> — {movie.price} ₴
                </div>
                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: '#ff0000',
                    color: '#ffffff'
                  }}
                  onClick={() => handleRemove(index)}
                >
                  Видалити
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
