import { faker } from '@faker-js/faker';
import { TItemData } from '../../src/types/ItemsTypes'

export async function insertItem(): Promise<TItemData> {
    return {
        title: (faker.word.adverb() + ' ' + faker.animal.cat()),
        url: faker.internet.url(),
        description: faker.lorem.paragraph(),
        amount: parseInt(faker.finance.amount())
    }
}
