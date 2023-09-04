import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ConflictException } from '@nestjs/common';
import {FreeSubscriptionEntity} from "./free-subscription.entity";

/**
 * Manages business logic for which user email address suffixes have free access to all items
 */
@Injectable()
export class FreeSubscriptionService {

    constructor(
        @InjectRepository(FreeSubscriptionEntity)
        private freeSubscriptionRepo: Repository<FreeSubscriptionEntity>,
    ) {}

    create(createEmailSubscription: FreeSubscriptionEntity) {
        return this.freeSubscriptionRepo.save(createEmailSubscription)
    }

    async findAll() {
        const purchaseCodes = await this.freeSubscriptionRepo.find({
            select:{
                email_sub_id: true,
                suffix: true,
            }
        })
        return purchaseCodes
    }

    async findOne(suffix: string): Promise<FreeSubscriptionEntity | undefined> {
        const purchaseCode = await this.freeSubscriptionRepo.findOne({where: {suffix}});
        return purchaseCode || null;
    }

    async addOne(suffix: string): Promise<FreeSubscriptionEntity> {
        const newEmailSub = new FreeSubscriptionEntity();
        newEmailSub.suffix = suffix;
        const oldEmailSub = await this.freeSubscriptionRepo.findOne({where: {suffix}});
        if (oldEmailSub == null){
            const purchaseCode = await this.freeSubscriptionRepo.save(newEmailSub);
            return purchaseCode;
        }
        else{
            throw new ConflictException("Email suffix already exist!");
        }
    }

    async updateEmailSub(id: number, newSuffix: string): Promise<FreeSubscriptionEntity> {
        const sub = await this.freeSubscriptionRepo.findOne({where: {email_sub_id: id}});
        if (sub != null) {
            sub.suffix = newSuffix;
            await this.freeSubscriptionRepo.save(sub);
            return sub;
        }
        else {
            throw new ConflictException("Email suffix doesn't exist!");
        }
    }

    async deleteEmailSub(id: number): Promise<FreeSubscriptionEntity> {
        const sub = await this.freeSubscriptionRepo.findOne({where: {email_sub_id: id}});
        if (sub != null) {
            await this.freeSubscriptionRepo.remove(sub);
            return sub;
        }
        else {
            throw new ConflictException("Email suffix doesn't exist!");
        }
    }

    // determines if the supplied email address has a free subscription
    async userEmailHasFreeSubscription(userEmail: string): Promise<boolean> {
        const emailSuffix = userEmail.split('@')[1]
        const allEntities = await this.freeSubscriptionRepo.find();
        const allFreeEmailSuffixes = allEntities.map(entity => entity.suffix);
        return allFreeEmailSuffixes.includes(emailSuffix);
    }

}
