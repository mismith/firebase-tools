import FirebaseInvitesBase from './firebase-invites-base';

it('provides all required keys', () => {
  expect(Object.keys(FirebaseInvitesBase.keys)).toMatchSnapshot();
});

describe('date manipulation', () => {
  it('unserializes a date', () => {
    const date1 = FirebaseInvitesBase.getDate();
    const date2 = FirebaseInvitesBase.getDate(new Date().toString());
    const date3 = FirebaseInvitesBase.getDate(new Date().toISOString());
    expect(date1 instanceof Date).toBe(true);
    expect(date2 instanceof Date).toBe(true);
    expect(date3 instanceof Date).toBe(true);
  });
  it('serializes a date', () => {
    const date1 = FirebaseInvitesBase.getDateString();
    const date2 = FirebaseInvitesBase.getDateString(new Date());
    const date3 = FirebaseInvitesBase.getDateString(new Date(Date.now() + 1000));
    expect(typeof date1).toBe('string');
    expect(typeof date2).toBe('string');
    expect(typeof date3).toBe('string');
  });
  it('determines whether a datetime has lapsed', () => {
    const past = FirebaseInvitesBase.getDateString(new Date(Date.now() - 1000));
    const future = FirebaseInvitesBase.getDateString(new Date(Date.now() + 1000));
    expect(FirebaseInvitesBase.isAfter(past)).toBe(true);
    expect(FirebaseInvitesBase.isAfter(null)).toBe(false);
    expect(FirebaseInvitesBase.isAfter(future)).toBe(false);
  });
});

describe('status reporting', () => {
  const timestamp = FirebaseInvitesBase.getDateString();
  const invite = {
    created: undefined,
    cancelled: undefined,
    expires: undefined,
    accepted: undefined,
  };
  it('provides all required statuses', () => {
    expect(Object.keys(FirebaseInvitesBase.status)).toMatchSnapshot();
  });
  it('detects created', () => {
    invite.created = timestamp;
    expect(FirebaseInvitesBase.isCreated(invite)).toBe(true);
    expect(FirebaseInvitesBase.getStatus(invite)).toBe(FirebaseInvitesBase.status.CREATED);
  });
  it('detects cancelled', () => {
    invite.cancelled = timestamp;
    expect(FirebaseInvitesBase.isCancelled(invite)).toBe(true);
    expect(FirebaseInvitesBase.getStatus(invite)).toBe(FirebaseInvitesBase.status.CANCELLED);
  });
  it('detects expired', () => {
    invite.expires = timestamp;
    expect(FirebaseInvitesBase.isExpired(invite)).toBe(true);
    expect(FirebaseInvitesBase.getStatus(invite)).toBe(FirebaseInvitesBase.status.EXPIRED);
  });
  it('detects accepted', () => {
    invite.accepted = timestamp;
    expect(FirebaseInvitesBase.isAccepted(invite)).toBe(true);
    expect(FirebaseInvitesBase.getStatus(invite)).toBe(FirebaseInvitesBase.status.ACCEPTED);
  });
  it('detects deleted', () => {
    const deletedInvite = null;
    expect(FirebaseInvitesBase.isDeleted(deletedInvite)).toBe(true);
    expect(FirebaseInvitesBase.getStatus(deletedInvite)).toBe(FirebaseInvitesBase.status.DELETED);
  });
  it('detects unknown', () => {
    const invalidInvite = {};
    expect(FirebaseInvitesBase.getStatus(invalidInvite)).toBe(FirebaseInvitesBase.status.UNKNOWN);
  });
});