import { BaseURL } from '../configration/config';
import request from '../configration/request';


export const loginRequest = async (data = null) => {
 
    console.log(data);

    // data: JSON.stringify({username: username, password: password}),

    // let isChild = false;
    // if (data.applyForSubCategories) {
    //   isChild = data.applyForSubCategories;
    // }
  
    // let categoryId = null;
    // if (data.categoryId) {
    //   categoryId = data.categoryId;
    // }
  
    // let res = await request({
    //   url: `${BaseURL}/webservices/login`,
    //   method:"POST",
    //   data
    // });
  
    // if (res && res.response ) {
    //   const data = res.response;
    //   return data;
    // }
    // return [];
  }
  
