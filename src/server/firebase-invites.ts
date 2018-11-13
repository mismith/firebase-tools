import keys from '../invites-keys';

export default class FirebaseInvites {
  static keys = keys;
  database;
  config;

  constructor(database, config = {}) {
    this.database = database;
    this.config = {};
  }

  async buildLink(snap, ctx): Promise<string> {
    return ctx.params.inviteId;
  }

  async buildInvitation(link, snap, ctx): Promise<object> {
    return {
      ...snap.val(),
      link,
    };
  }

  async send(invitation, snap, ctx) {
    // @STUB: extend to implement
  }

  async handleCreate(snap, ctx) {
    const link = await this.buildLink(snap, ctx);
    const invitation = await this.buildInvitation(link, snap, ctx);
    await this.send(invitation, snap, ctx);
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
    // @STUB: extend to implement
  }

  hook(path = 'invites') {
    const ref = this.database.ref(`${path}/{inviteId}`);
    return {
      onCreate: ref.onCreate(async (snap, ctx) => {
        try {
          await this.handleCreate(snap, ctx);
        } catch (err) {
          await this.handleError(err, snap, ctx);
        }
      }),
      onAccept: ref.onUpdate(async ({ before, after }, ctx) => {
        try {
          if (!before.child(keys.accepted).exists() && after.child(keys.accepted).exists()) {
            await this.handleAccept(after, ctx);
          }
        } catch (err) {
          await this.handleError(err, after, ctx);
        }
      }),
      onCancel: ref.onUpdate(async ({ before, after }, ctx) => {
        try {
          if (!before.child(keys.cancelled).exists() && after.child(keys.cancelled).exists()) {
            await this.handleCancel(after, ctx);
          }
        } catch (err) {
          await this.handleError(err, after, ctx);
        }
      }),
      onDelete: ref.onDelete(async (snap, ctx) => {
        try {
          await this.handleDelete(snap, ctx);
        } catch (err) {
          await this.handleError(err, snap, ctx);
        }
      }),
    };
  }
}
