import { randomUUID } from "node:crypto";
import { ElectionStatus } from "./election-status.js";

export class Election {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;

  private _status: ElectionStatus;

  constructor(name: string) {
    if (!name.trim()) {
      throw new Error("Election name cannnot be emty");
    }

    this.id = randomUUID();
    this.name = name;
    this.createdAt = new Date();
    this._status = ElectionStatus.CREATED;
  }

  get status(): ElectionStatus {
    return this._status;
  }

  start(): void {
    if (this._status !== ElectionStatus.CREATED) {
      throw new Error("Election cannot be started");
    }

    this._status = ElectionStatus.IN_PROGRESS;
  }

  finish(): void {
    if (this._status !== ElectionStatus.IN_PROGRESS) {
      throw new Error("Election cannot be finished");
    }

    this._status = ElectionStatus.FINISHED;
  }
}
