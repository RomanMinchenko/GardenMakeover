import { GameEventPayload, GameEventType } from "../gameplay/events/GameEvents";

type Listener<T extends GameEventType = GameEventType> = (
  data: GameEventPayload[T]
) => void;

export default class EventManager {
  public static exists: boolean;
  public static instance: EventManager;

  private listeners: Map<string, Set<Function>>;

  constructor() {
    if (EventManager.exists) {
      return EventManager.instance;
    }

    EventManager.exists = true;
    EventManager.instance = this;

    this.listeners = new Map();
  }

  public static getInstance(): EventManager {
    if (EventManager.exists) {
      return EventManager.instance;
    }

    return new EventManager();
  }

  public on<T extends GameEventType>(eventName: T, listener: Listener<T>): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    this.listeners.get(eventName)!.add(listener);
  }

  public off<T extends GameEventType>(eventName: T, listener?: Listener<T>): void {
    if (this.listeners.has(eventName)) {
      if (listener) {
        this.listeners.get(eventName)!.delete(listener);
      } else {
        this.listeners.get(eventName)!.clear();
      }
    }
  }

  public once<T extends GameEventType>(eventName: T, listener: Listener<T>): void {
    this.on(eventName, (data: GameEventPayload[T]) => {
      listener(data);
      this.off(eventName, listener);
    });
  }

  public emit<T extends GameEventType>(eventName: T, data: GameEventPayload[T]): void {
    if (this.listeners.has(eventName)) {
      const listeners = this.listeners.get(eventName);
      for (const listener of listeners!) {
        listener(data);
      }
    }
  }
}