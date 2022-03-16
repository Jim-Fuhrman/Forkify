import {async} from 'regenerator-runtime';
import {TIMEOUT_SEC} from './config.js'

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

export const AJAX = async function(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData 
    ? fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
      }) 
    : fetch(url);

      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
      const data = await res.json();

      if(!res.ok) throw new Error(`${data.message} (${res.status})`);
      return data;
    } catch(err) {
      throw err;
    }
};

// the goal of this file is store functions we use again and again in our project. 
/*
export const getJSON = async function(url) {
    try {
      const fetchPro = fetch(url)
        const res = await Promise.race([fetchPro, timeout(TimeOut_Sec)]);
        const data = await res.json();

        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch(err) {
        throw err;
    }
}

export const sendJSON = async function(url, uploadData) {
  try {
    const fetchPro = 

    const res = await Promise.race([fetchPro, timeout(TimeOut_Sec)]);
    const data = await res.json();

    if(!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch(err) {
      throw err;
  }
}
*/