import FirebaseBase from './firebase-base';

it('provides all required keys', () => {
  expect(Object.keys(FirebaseBase.keys)).toMatchSnapshot();
});

describe('date manipulation', () => {
  it('unserializes a date', () => {
    const date1 = FirebaseBase.getDate();
    const date2 = FirebaseBase.getDate(new Date().toString());
    const date3 = FirebaseBase.getDate(new Date().toISOString());
    expect(date1 instanceof Date).toBe(true);
    expect(date2 instanceof Date).toBe(true);
    expect(date3 instanceof Date).toBe(true);
  });
  it('serializes a date', () => {
    const date1 = FirebaseBase.getDateString();
    const date2 = FirebaseBase.getDateString(new Date());
    const date3 = FirebaseBase.getDateString(new Date(Date.now() + 1000));
    expect(typeof date1).toBe('string');
    expect(typeof date2).toBe('string');
    expect(typeof date3).toBe('string');
  });
  it('determines whether a datetime has lapsed', () => {
    const past = FirebaseBase.getDateString(new Date(Date.now() - 1000));
    const future = FirebaseBase.getDateString(new Date(Date.now() + 1000));
    expect(FirebaseBase.isAfter(past)).toBe(true);
    expect(FirebaseBase.isAfter(null)).toBe(false);
    expect(FirebaseBase.isAfter(future)).toBe(false);
  });
});

describe('status reporting', () => {
  const timestamp = FirebaseBase.getDateString();
  const invite = {
    created: undefined,
    cancelled: undefined,
    expires: undefined,
    accepted: undefined,
  };
  it('provides all required statuses', () => {
    expect(Object.keys(FirebaseBase.status)).toMatchSnapshot();
  });
  it('detects created', () => {
    invite.created = timestamp;
    expect(FirebaseBase.isCreated(invite)).toBe(true);
    expect(FirebaseBase.getStatus(invite)).toBe(FirebaseBase.status.CREATED);
  });
  it('detects cancelled', () => {
    invite.cancelled = timestamp;
    expect(FirebaseBase.isCancelled(invite)).toBe(true);
    expect(FirebaseBase.getStatus(invite)).toBe(FirebaseBase.status.CANCELLED);
  });
  it('detects expired', () => {
    invite.expires = timestamp;
    expect(FirebaseBase.isExpired(invite)).toBe(true);
    expect(FirebaseBase.getStatus(invite)).toBe(FirebaseBase.status.EXPIRED);
  });
  it('detects accepted', () => {
    invite.accepted = timestamp;
    expect(FirebaseBase.isAccepted(invite)).toBe(true);
    expect(FirebaseBase.getStatus(invite)).toBe(FirebaseBase.status.ACCEPTED);
  });
  it('detects deleted', () => {
    const deletedInvite = null;
    expect(FirebaseBase.isDeleted(deletedInvite)).toBe(true);
    expect(FirebaseBase.getStatus(deletedInvite)).toBe(FirebaseBase.status.DELETED);
  });
  it('detects unknown', () => {
    const invalidInvite = {};
    expect(FirebaseBase.getStatus(invalidInvite)).toBe(FirebaseBase.status.UNKNOWN);
  });
});