import { Address } from '../types'

export enum PancakeCollectionKey {
  PANCAKE = 'base',
  SQUAD = 'pancakeSquad',
}

export type PancakeCollection = {
  name: string
  description?: string
  slug: string
  address: Address
}

export type PancakeCollections = {
  [key in PancakeCollectionKey]: PancakeCollection
}
