export let AccessToken: string = localStorage.getItem('token') || null;
export let User: any = {
    userid: localStorage.getItem('userid') || null,
    role: localStorage.getItem('role') || null
};

const apiService = async <T = any>(uri: string, method: string = 'GET', body?: {}) => {
    const headers = new Headers();
    const options: IOptions = {
        method,
        headers
    }

    if(AccessToken) {
        headers.append('Authorization', `Bearer ${AccessToken}`);
    }
    
    if (method === 'POST' || method === 'PUT') {
        headers.append('Content-Type', 'application/json');
        options.body = JSON.stringify(body);
    }
    
    try {
        const res = await fetch(uri, options);

        if (res.status === 500) {
            throw new Error('Server problem; if you see this, please contact site admin');
        }

        if (res.status === 404) {
            throw new Error('Path doesn\'t exist or has a typo');
        }

        if (res.status === 401) {
            throw new Error('Forgot to log in or you\'re not allowed to do that');
        }

        if (res.ok) {
            return <T>await res.json();
        }

    } catch (error) {
        console.log(error);
    }

}

interface IOptions {
    [key: string]: any;
}

export const SetAccessToken = (token: string, user: {userid: number, role: number}, sessionID?: number) => {
    AccessToken = token;
    User = user;

    localStorage.setItem('token', token);
    localStorage.setItem('userid', User.userid);
    localStorage.setItem('role', User.role);
    if(sessionID) localStorage.setItem('sessionID', sessionID.toString())
}

export default apiService;