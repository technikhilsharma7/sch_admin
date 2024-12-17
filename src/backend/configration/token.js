export async function currentSessionToken() {    
    let token = localStorage.getItem('token');
    let schoolsession = localStorage.getItem('selectedSession');
    if (token) {
        return {  "Content-Type": "multipart/form-data",'Access-Control-Allow-Origin' : '*','Authorization': `Bearer `+token, 'schoolsession' : schoolsession };
    } else {
        return {  'Access-Control-Allow-Origin' : '*' };
    }
}