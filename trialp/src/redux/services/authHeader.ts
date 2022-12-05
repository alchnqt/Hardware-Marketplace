export default function authHeader() {
    const user: any = JSON.parse(localStorage.getItem('persist:root') as any).user;

    if (user && user.accessToken) {
        return { Authorization: 'Bearer ' + user.accessToken };
    } else {
        return {};
    }
}