import {UserData} from './UserData';

const TransformData = (data: any) => {
  let userData = new UserData();
  if (data.idToken) {
    userData.idToken = data.idToken;
  }
  if (data.email) {
    userData.email = data.email;
  }
  if (data.refereshToken) {
    userData.refereshToken = data.refereshToken;
  }
  if (data.expiresIn) {
    userData.expiresIn = data.expiresIn;
  }
  if (data.localId) {
    userData.localId = data.localId;
  }
  if (data.registered) {
    userData.registered = data.registered;
  }
  if (data.displayName) {
    userData.displayName = data.displayName;
  }
  if (data.photoUrl) {
    userData.photoUrl = data.photoUrl;
  }
  if (data.deletedAttribute) {
    userData.deletedAttribute = data.deletedAttribute;
  }
  if (data.emailVerified) {
    userData.emailVerified = data.emailVerified;
  }
  if (data.providerUserInfo) {
    userData.providerUserInfo = data.providerUserInfo;
  }
  if (data.passwordHash) {
    userData.passwordHash = data.passwordHash;
  }
  if (data.passwordUpdatedAt) {
    userData.passwordUpdatedAt = data.passwordUpdatedAt;
  }
  if (data.validSince) {
    userData.validSince = data.validSince;
  }
  if (data.disabled) {
    userData.disabled = data.disabled;
  }
  if (data.lastLoginAt) {
    userData.lastLoginAt = data.lastLoginAt;
  }
  if (data.createdAt) {
    userData.createdAt = data.createdAt;
  }
  if (data.customAuth) {
    userData.customAuth = data.customAuth;
  }
  if (data.lastRefreshAt) {
    userData.lastRefreshAt = data.lastRefreshAt;
  }

  return userData;
};

export default TransformData;
