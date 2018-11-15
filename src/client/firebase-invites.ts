import keys from '../invites-keys';

export default class FirebaseInvites {
  static keys = keys;
  ref;
  options;

  constructor(invitesRef, options = {}) {
    this.ref = invitesRef;
    this.options = {
      expiry: 2 * 24 * 60 * 60 * 1000, // 2 days
      ...options,
    };
  }

  async create(invitee, inviter, payload = {}) {
    const created = new Date();
    const expires = this.options.expiry && new Date(created.getTime() + this.options.expiry);
    const inviteRef = await this.ref.push({
      [keys.email]: invitee,
      [keys.invitedBy]: inviter,
      [keys.payload]: payload,
      [keys.created]: created.toISOString(),
      [keys.expires]: expires && expires.toISOString(),
    });
    const inviteId = inviteRef.key;
    return inviteId;
  }

  async accept(inviteId, acceptedBy) {
    return this.ref.child(inviteId).update({
      [keys.accepted]: new Date().toISOString(),
      [keys.acceptedBy]: acceptedBy,
    });
  }

  async cancel(inviteId) {
    return this.ref.child(inviteId).update({
      [keys.cancelled]: new Date().toISOString(),
    });
  }

  async delete(inviteId) {
    return this.ref.child(inviteId).remove();
  }
}
