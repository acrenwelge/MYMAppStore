import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionDto } from './subscription.dto';
import { SubscriptionEntity } from './subscription.entity';
import Cart from 'src/payment/payment.entity';
import { ItemService } from 'src/item/item.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepo: Repository<SubscriptionEntity>,
    private itemService: ItemService,
) {}

  async create(newSubscription: SubscriptionDto) {
    const newEnt = this.subscriptionRepo.create(newSubscription);
    return this.subscriptionRepo.save(newEnt);
  }

  async findAll() {
    const subscriptions = await this.subscriptionRepo.find({
      relations: ["user", "item", "owner"]
    });
    return subscriptions
  }

  async findAllForOwner(user_id: number) {
    return await this.subscriptionRepo.find({
      relations: ["user", "item", "owner"],
      where: { owner: { userId: user_id } }
    });
  }

  async findAllForUser(user_id: number) {
    const subs = await this.subscriptionRepo.find({
      relations: ["user", "item"],
      where: { user: { userId: user_id } }
    });
    console.log("in user, subs = ", subs)
    return subs
  }

  async findOne(id: number) {
    return await this.subscriptionRepo.findOne({ where: { subscriptionId: id } });
  }

  private addMonthsUtil = (date: Date, months: number) => {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}

  private async addExtendSubscriptionLogic(order: Cart, item, subs: SubscriptionEntity[], recip: number) {
    const now = new Date(Date.now());
    const {subscriptionLengthMonths} = await this.itemService.findOne(item.itemId);
    const subsForItem = subs.filter(s => s.item.itemId === item.itemId);
    if (subsForItem.length > 0) { // user already has a subscription for this item
      const sub = subsForItem[0];
      if (sub.expirationDate < now) { // subscription has expired - replace it
        const newdate = this.addMonthsUtil(now, subscriptionLengthMonths);
        sub.expirationDate = newdate;
      } else { // subscription expires in the future - extend it
        sub.expirationDate = this.addMonthsUtil(sub.expirationDate, subscriptionLengthMonths);
      }
      return this.subscriptionRepo.save(sub);
    } else { // no existing subscriptions for this user for this item
      const newSub = this.subscriptionRepo.create();
      newSub.item = <any> item.itemId;
      newSub.user = <any> recip
      newSub.owner = <any> order.purchaserUserId
      newSub.expirationDate = this.addMonthsUtil(now, subscriptionLengthMonths);
      await this.subscriptionRepo.save(newSub);
    }
  }

  /**
   * Updates the expiration date of a subscription for a user, or creates a new subscription if one does not exist.
   * @returns the updated or created subscription
   */
  async addOrExtendSubscriptions(order: Cart, recipientIds: number[]) {
    for (const item of order.items) {
      for (let i = 0; i < item.quantity; i++) {
        // get the next recipientId (item.quantity === recipientIds.length)
        const recip = recipientIds[i]
        const subs: SubscriptionEntity[] = await this.findAllForOwner(recip);
        this.addExtendSubscriptionLogic(order, item, subs, recip)
      }
    }
  }

  /**
   * @description Checks if a user has a valid subscription to an item
   * @returns true if the user has a subscription to an item that has not expired, false otherwise
   */
  async userHasValidSubscription(user_id: number, item_id: number) {
    const allUserSubscriptions = await this.subscriptionRepo.find({
      where: {owner: {userId: user_id}, item: {itemId: item_id}}
    })
    const now = new Date(Date.now());
    return allUserSubscriptions.some(sub => sub.expirationDate > now)
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }

}
