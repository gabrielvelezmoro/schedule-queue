import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tweet } from '../entities/tweet.entity';
import { Interval } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TweetsCountService {
  private limit: any = 10;
  constructor(
    @InjectModel(Tweet)
    private tweetsModel: typeof Tweet,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Interval(5000)
  async countTweets() {
    console.log('procurando tweets');

    let offset = await this.cacheManager.get<number>('tweet-offset');
    offset = offset === undefined ? 0 : offset;
    const tweets: Tweet[] = await this.tweetsModel.findAll({
      offset,
      limit: this.limit,
    });

    console.log(`offset: ${offset}`);

    if (tweets.length === this.limit)
      this.cacheManager.set('tweet-offset', offset + this.limit, 1 * 60 * 10);

    console.log(`achou ${tweets.length} tweets`);
  }
}
