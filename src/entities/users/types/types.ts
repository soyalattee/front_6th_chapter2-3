export interface User {
  id: number
  username: string
  image: string
}

export interface Address {
  address: string
  city: string
  country: string
  state: string
  stateCode: string
  postalCode: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface UserInfo {
  id: number
  image: string
  age: number
  username: string
  lastName: string
  firstName: string
  email?: string
  phone?: string
  company: {
    address: Address
    department: string
    name: string
    title: string
  }
  address: Address
  role: string
}

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}
