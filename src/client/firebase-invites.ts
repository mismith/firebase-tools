import FirebaseInvitesBase from '../firebase-invites-base';

export default class FirebaseInvites extends FirebaseInvitesBase {
  ref;

  constructor(invitesRef) {
    super();

    this.ref = invitesRef;
  }

  async create(payload = {}) {
    const inviteRef = await this.ref.push({
      [FirebaseInvites.keys.created]: FirebaseInvites.getDateString(),
      [FirebaseInvites.keys.payload]: payload || null,
    });
    const inviteId = inviteRef.key;
    return inviteId;
  }

  async resend(inviteId, payload = {}) {
    return this.ref.child(inviteId).update({
      [FirebaseInvites.keys.created]: FirebaseInvites.getDateString(),
      [FirebaseInvites.keys.payload]: payload || null,
    });
  }

  async cancel(inviteId) {
    return this.ref.child(inviteId).update({
      [FirebaseInvites.keys.cancelled]: FirebaseInvites.getDateString(),
    });
  }

  async accept(inviteId) {
    return this.ref.child(inviteId).update({
      [FirebaseInvites.keys.accepted]: FirebaseInvites.getDateString(),
    });
  }

  async delete(inviteId) {
    return this.ref.child(inviteId).remove();
  }
}
