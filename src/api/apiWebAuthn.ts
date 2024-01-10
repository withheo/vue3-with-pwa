

const apiNotification = () => {
  // const apiUrlPrefix =`http://localhost:3000`;
  const apiUrlPrefix = "https://port-0-web-push-3spy7mg2alqvu3uhv.sel5.cloudtype.app"

  const sendMessageApi = async (id: string, body: any) => {
    const url = `${apiUrlPrefix}/notification/send/${id}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })

    return response;
  }

  const registApi = async (body: any) => {
    const url = `${apiUrlPrefix}/notification`;
    // "http://localhost:3000";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    return response;
  }

  const getResitrationOptions = async () => {
    const url = `${apiUrlPrefix}/authn/generate-registration-options`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });

    return response;
  }

  const postVerifyRegistration = async (data: object) => {
    const url = `${apiUrlPrefix}/authn/verify-registration`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    return response;
  }

  const getAuthenticationOptions = async () => {
    const url = `${apiUrlPrefix}/authn/generate-authentication-options`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });

    return response;
  }

  const postVerifyAuthentication = async(data: object) => {
    const url = `${apiUrlPrefix}/authn/verify-authentication`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    return response;
  }

  return {
    registApi,
    sendMessageApi,
    getResitrationOptions,
    postVerifyRegistration,
    getAuthenticationOptions,
    postVerifyAuthentication,
  }
}

export default apiNotification;