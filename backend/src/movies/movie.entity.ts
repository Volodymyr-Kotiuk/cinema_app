import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column('text')
  description: string

  @Column('decimal', { precision: 8, scale: 2 })
  price: number

  @Column()
  poster_url: string

  @Column()
  trailer_url: string

  @Column()
  session_time: Date

  @Column()
  total_seats: number

  @Column()
  available_seats: number
}
