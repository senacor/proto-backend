const subscriptionsByClientId: Record<string, Array<string>> = {}
const subscriptionsByKey: Record<string, Array<string>> = {}

export const getSubscribedClientIds = (subscriptionKey: string): Array<string> => {
  return subscriptionsByKey[subscriptionKey] || []
}

export const storeSubscription = (clientId: string, subscriptionKey: string) => {
  if (!subscriptionsByClientId[clientId]) {
    subscriptionsByClientId[clientId] = []
  }

  if (!subscriptionsByClientId[clientId]?.includes(subscriptionKey)) {
    subscriptionsByClientId[clientId].push(subscriptionKey)
  }

  if (!subscriptionsByKey[subscriptionKey]) {
    subscriptionsByKey[subscriptionKey] = []
  }

  if (!subscriptionsByKey[subscriptionKey]?.includes(clientId)) {
    subscriptionsByKey[subscriptionKey].push(clientId)
  }
}

const arrayWithoutElement = <T>(array: Array<T>, element: T) => {
  return array.filter(value => value !== element);
};

export const unsubscribeClient = (clientId: string) => {
  subscriptionsByClientId[clientId]?.forEach(subscriptionKey => {
    subscriptionsByKey[subscriptionKey] = arrayWithoutElement(subscriptionsByKey[subscriptionKey], clientId)
  })

  delete subscriptionsByClientId[clientId]
}
