export default class FirebaseBase {
  static keys = {
    link: 'link',
    email: 'email',
    payload: 'payload',
    created: 'created',
    createdBy: 'createdBy',
    expires: 'expires',
    accepted: 'accepted',
    acceptedBy: 'acceptedBy',
    cancelled: 'cancelled',
  };

  static getDate(source = undefined) {
    return new Date(source);
  }
  static getDateString(date = new Date()) {
    return date.toISOString();
  }
}
