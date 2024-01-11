

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

  const getSendMessageUserApi = async () => {
    const url = `${apiUrlPrefix}/notification/user`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    return response;
  }

  const getLivedServer = async() => {
    const timeout = 3000;
    const url = `${apiUrlPrefix}/lived`;
    const controller = new AbortController();
    const signal = controller.signal;
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, {
      method: "GET",
      signal,
      headers: {
        "Content-Type": "application/json",
      }
    });

    clearTimeout(id);
    return response;
  }


  return {
    registApi,
    sendMessageApi,
    getSendMessageUserApi,
    getLivedServer,
  }
}

export default apiNotification;