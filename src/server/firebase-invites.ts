import FirebaseInvitesBase from '../firebase-invites-base';

export default class FirebaseInvites extends FirebaseInvitesBase {
  database;
  config;

  constructor(database, config = {}) {
    super();

    this.database = database;
    this.config = config;
  }

  async handleCreate(snap, ctx) {
    // @STUB: extend to implement
  }

  async handleResend(snap, ctx) {
    // by default, do the same as on create
    return this.handleCreate(snap, ctx);
  }

  async handleAccept(snap, ctx) {
    // @STUB: extend to implement
  }

  async handleCancel(snap, ctx) {
    // @STUB: extend to implement
  }

  async handleDelete(snap, ctx) {
    // @STUB: extend to implement
  }

  async handleError(err, snap, ctx) {
    console.error(err, snap && snap.val(), ctx);
  }

  hook(path = 'invites') {
    const ref = this.database.ref(`${path}/{inviteId}`);
    const send = async (after, ctx) => {
      const created = FirebaseInvites.getDate(after.child(FirebaseInvites.keys.created).val());
      const expires = this.config.expiry && FirebaseInvites.getDate(created.getTime() + this.config.expiry);

      await after.ref.update({
        [FirebaseInvites.keys.createdBy]: ctx.auth.uid,
        [FirebaseInvites.keys.expires]: (expires && FirebaseInvites.getDateString(expires)) || null,
        [FirebaseInvites.keys.cancelled]: null,
        [FirebaseInvites.keys.accepted]: null,
      });
      const snap = await after.ref.once('value');

      return snap;
    }

    return {
      onCreate: ref.onCreate(async (after, ctx) => {
        try {
          // sending
          if (after.child(FirebaseInvites.keys.created).val()) {
            const snap = await send(after, ctx);

            return this.handleCreate(snap, ctx);
          }
        } catch (err) {
          return this.handleError(err, after, ctx);
        }
      }),
      onUpdate: ref.onUpdate(async ({ before, after }, ctx) => {
        try {
          const invite = after.val();

          // resending
          if (before.child(FirebaseInvites.keys.created).val() !== after.child(FirebaseInvites.keys.created).val()) {
            // prevent resending accepted invites
            if (FirebaseInvites.isAccepted(invite)) throw new Error('invite already accepted');

            const snap = await send(after, ctx);

            return this.handleResend(snap, ctx);
          }

          // cancelling
          if (before.child(FirebaseInvites.keys.cancelled).val() !== after.child(FirebaseInvites.keys.cancelled).val()) {
            // prevent cancelling accepted invites
            if (FirebaseInvites.isAccepted(invite)) throw new Error('invite already accepted');

            return this.handleCancel(after, ctx);
          }

          // accepting
          if (before.child(FirebaseInvites.keys.accepted).val() !== after.child(FirebaseInvites.keys.accepted).val()) {
            // prevent accepting expired invites
            if (FirebaseInvites.isExpired(invite)) throw new Error('invite has expired');

            // prevent accepting cancelled invites
            if (FirebaseInvites.isCancelled(invite)) throw new Error('invite was cancelled');

            await after.ref.update({
              [FirebaseInvites.keys.acceptedBy]: ctx.auth.uid,
            });
            const snap = await after.ref.once('value');

            return this.handleAccept(snap, ctx);
          }
        } catch (err) {
          return this.handleError(err, after, ctx);
        }
      }),
      onDelete: ref.onDelete(async (before, ctx) => {
        try {
          // deleting
          return this.handleDelete(before, ctx);
        } catch (err) {
          return this.handleError(err, before, ctx);
        }
      }),
    };
  }
}
