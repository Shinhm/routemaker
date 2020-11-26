class UserAgentService {
  userAgent: string = '';

  setUserAgent = (userAgent: string) => {
    this.userAgent = userAgent;
  };

  isMobile = () => {
    return navigator.userAgent.indexOf('Mobi') > -1;
  };
}

export default new UserAgentService();
