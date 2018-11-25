export default class FirebaseBase {
  static keys = {
    payload: 'payload',
    created: 'created',
    createdBy: 'createdBy',
    cancelled: 'cancelled',
    expires: 'expires',
    accepted: 'accepted',
    acceptedBy: 'acceptedBy',
  };
  static status = {
    CREATED: 'created',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
    ACCEPTED: 'accepted',
    DELETED: 'deleted',
    UNKNOWN: 'unknown',
  };

  static getDate(source = undefined) {
    return source ? new Date(source) : new Date();
  }
  static getDateString(date = new Date()) {
    return date.toISOString();
  }
  static isAfter(timestamp) {
    if (timestamp) {
      const date = this.getDate(timestamp);
      return this.getDate().getTime() >= date.getTime();
    }
    return false;
  }

  static isCreated(invite) {
    return this.isAfter(invite[this.keys.created]);
  }
  static isCancelled(invite) {
    return this.isAfter(invite[this.keys.cancelled]);
  }
  static isExpired(invite) {
    return this.isAfter(invite[this.keys.expires]);
  }
  static isAccepted(invite) {
    return this.isAfter(invite[this.keys.accepted]);
  }
  static isDeleted(invite) {
    return !invite;
  }

  static getStatus(invite) {
    if (this.isDeleted(invite)) {
      return this.status.DELETED;
    } else if (this.isAccepted(invite)) {
      return this.status.ACCEPTED;
    } else if (this.isExpired(invite)) {
      return this.status.EXPIRED;
    } else if (this.isCancelled(invite)) {
      return this.status.CANCELLED;
    } else if (this.isCreated(invite)) {
      return this.status.CREATED;
    } else {
      return this.status.UNKNOWN;
    }
  }
}
