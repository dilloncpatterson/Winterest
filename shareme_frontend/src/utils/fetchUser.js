//fetch user function that does not accept any parameters
export const fetchUser = () => {
    const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear  

    return userInfo;
}