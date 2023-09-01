import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from 'src/item/item.entity';
import { Repository } from 'typeorm';
import { SubscriptionDto } from './subscription.dto';
import { SubscriptionEntity } from './subscription.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepo: Repository<SubscriptionEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(ItemEntity)
    private itemRepo: Repository<ItemEntity>,
) {}

  async create(newSubscription: SubscriptionDto) {
    const newEnt = this.subscriptionRepo.create(newSubscription);
    return this.subscriptionRepo.save(newEnt);
  }

  async findAllForUser(user_id: number) {
    return await this.subscriptionRepo.find({ where: { user: { userId: user_id } }});
  }

  async findOne(id: number) {
    return await this.subscriptionRepo.findOne({ where: { subscriptionId: id } });
  }

  async addMonthsToSubscription(subscriptionId: number, months: number) {
    return this.subscriptionRepo.findOne({where: { subscriptionId}})
      .then((subscription) => {
        if (subscription == null) {
          throw new Error("Cannot extend subscription because it was not found");
        }
        subscription.expirationDate.setMonth(subscription.expirationDate.getMonth() + months);
        return this.subscriptionRepo.save(subscription);
      }).catch((err) => {
        console.log(err);
        throw new Error("Error adding months to subscription");
      });
  }

  /**
   * @description Checks if a user has a valid subscription to an item
   * @returns true if the user has a subscription to an item that has not expired, false otherwise
   */
  async userHasValidSubscription(user_id: number, item_id: number) {
    const allUserSubscriptions = await this.subscriptionRepo.find({
      where: {user: {userId: user_id}, item: {itemId: item_id}}
    })
    const now = new Date(Date.now())
    return allUserSubscriptions.some(sub => sub.expirationDate > now)
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }

}
