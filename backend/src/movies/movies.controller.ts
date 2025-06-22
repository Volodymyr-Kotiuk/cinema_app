import { Controller, Get, Param, Post, Body, Delete, Patch } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Movie | null> {
    return this.moviesService.findOne(id);
  }

  @Post()
  create(@Body() movie: Partial<Movie>): Promise<Movie> {
    return this.moviesService.create(movie);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.moviesService.remove(id);
  }

  @Patch(':id/decrease')
  decreaseSeats(@Param('id') id: number): Promise<Movie> {
    return this.moviesService.decreaseSeats(id);
  }

  @Patch(':id/increase')
  increaseSeats(@Param('id') id: number): Promise<Movie> {
    return this.moviesService.increaseSeats(id);
  }
}
