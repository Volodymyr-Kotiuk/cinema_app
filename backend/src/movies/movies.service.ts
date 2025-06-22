import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }

  findOne(id: number): Promise<Movie | null> {
    return this.moviesRepository.findOneBy({ id });
  }

  async create(data: Partial<Movie>): Promise<Movie> {
    const movie = this.moviesRepository.create({
      ...data,
      available_seats: data.total_seats ?? 120,
    });
    return await this.moviesRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    await this.moviesRepository.delete(id);
  }

  async decreaseSeats(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOneBy({ id });
    if (!movie) throw new NotFoundException('Фільм не знайдено');
    if (movie.available_seats <= 0) throw new Error('Немає доступних місць');
    movie.available_seats -= 1;
    return this.moviesRepository.save(movie);
  }

  async increaseSeats(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOneBy({ id });
    if (!movie) throw new NotFoundException('Фільм не знайдено');
    if (movie.available_seats < movie.total_seats) {
      movie.available_seats += 1;
      return this.moviesRepository.save(movie);
    }
    return movie;
  }
}
