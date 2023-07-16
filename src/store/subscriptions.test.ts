import {expect, test} from '@jest/globals';
import { storeSubscription, getSubscribedClientIds, unsubscribeClient } from './subscriptions';
import { v4 as uuid } from 'uuid';

test('verify subscription functionality', () => {
  const clientId = uuid()
  const storageKey = "myKey"

  storeSubscription(clientId, storageKey)

  const clients = getSubscribedClientIds(storageKey)
  expect(clients).toHaveLength(1)
  expect(clients[0]).toBe(clientId)

  unsubscribeClient(clientId)

  const clients2 = getSubscribedClientIds(storageKey)
  expect(clients2).toHaveLength(0)
})