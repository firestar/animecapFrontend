import {environment} from '../../environments/environment';


export class HttpFetch {
  baseDomain = "//"+environment.animecap_api;
  fetchURL(url, func){
    fetch(`${this.baseDomain}${url}`, {
      method: 'GET',
      cache: "no-cache",
    }).then(response=>response.json()).then(json=>func(json)).catch(error=>console.log(JSON.stringify(error)));
  }
  fetchURLPost(url, data, func){
    fetch(`${this.baseDomain}${url}`, {
      method: 'POST',
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data)
    }).then(response=>response.json()).then(json=>func(json)).catch(error=>console.log(JSON.stringify(error)));
  }
  fetchURLPut(url, data, func){
    fetch(`${this.baseDomain}${url}`, {
      method: 'PUT',
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data)
    }).then(response=>response.json()).then(json=>func(json)).catch(error=>console.log(JSON.stringify(error)));
  }
}
