export type Flags = {[id: string]: Flag<any>}
export interface Flag<T> {
  name: string
  parse(): T
  required: boolean
}
