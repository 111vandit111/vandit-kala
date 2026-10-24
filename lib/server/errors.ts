export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class DuplicateError extends Error {
  constructor(message = "Already exists") {
    super(message);
    this.name = "DuplicateError";
  }
}
