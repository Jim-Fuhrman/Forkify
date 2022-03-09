import {async} from 'regenerator-runtime';
import {TimeOut_Sec} from './config.js'

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

// the goal of this file is store functions we use again and again in our project. 
export const getJSON = async function(url) {
    try {
        const res = await Promise.race([fetch(url), timeout(TimeOut_Sec)]);
        const data = await res.json();

        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch(err) {
        throw err;
    }
}