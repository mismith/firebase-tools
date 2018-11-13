import axios from 'axios';

export default class FirebaseDynamicLinks {
  androidBundleId: string;
  iosBundleId: string;
  domain: string;
  apiKey: string;

  constructor(apiKey, bundleId, domain = undefined) {
    this.apiKey = apiKey;
    if (typeof bundleId === 'object') {
      this.androidBundleId = bundleId.android;
      this.iosBundleId = bundleId.ios;
    } else {
      this.androidBundleId = bundleId;
      this.iosBundleId = bundleId;
    }
    this.domain = domain;
  }

  async getShortLink(url, unguessable = false): Promise<string> {
    const ENDPOINT = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks';
    const { data: { shortLink } } = await axios.post(`${ENDPOINT}?key=${this.apiKey}`, {
      dynamicLinkInfo: {
        dynamicLinkDomain: this.domain,
        link: url,
        androidInfo: {
          androidPackageName: this.androidBundleId,
        },
        iosInfo: {
          iosBundleId: this.iosBundleId,
        },
      },
      suffix: {
        option: unguessable ? 'UNGUESSABLE' : 'SHORT',
      },
    });
    return shortLink;
  }
}
