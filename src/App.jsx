import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthorizationCodePKCE = () => {
    const [accessToken, setAccessToken] = useState('');
    const [error, setError] = useState('');

    const [codeVerifier, setCodeVerifier] = useState();

    const [codeChallenge, setCodeChallenge] = useState();
    // useEffect(() => {
    //     handleAuthorizationResponse();
    // }, []);

    const handleLogin = async () => {
        try {
            // console.log()
            // const codeVerifier = generateCodeVerifier();
            // console.log(codeVerifier)
            // console.log(1)
            // const codeChallenge = await generateCodeChallenge(codeVerifier);
            // console.log(codeChallenge)
            // console.log(1)

            const authorizeUrl = `http://localhost:9191/oauth2/authorize?response_type=code&client_id=test&state=hellowofsdrld&scope=openid&redirect_uri=http://localhost:3000&code_challenge=${codeChallenge}&code_challenge_method=S256`;
            window.location.href = authorizeUrl;
        } catch (error) {
            setError('Ошибка при генерации кода');
        }
    };
    //EVKowuq9wI_7z5GKRLZRYvAwRtAirh62dqXTsyRs8sSqC1tHOVL57bDQjlIJCR3KTqtul13pLvZGJJ1oYe0II6W2Hl-Mq4RSj80Fdl44L1rnp7TaVN_gs-ixbbIV7G1J
    //EVKowuq9wI_7z5GKRLZRYvAwRtAirh62dqXTsyRs8sSqC1tHOVL57bDQjlIJCR3KTqtul13pLvZGJJ1oYe0II6W2Hl-Mq4RSj80Fdl44L1rnp7TaVN_gs-ixbbIV7G1J

    const generateTokents = async () => {
        try {
            const codeVerifier = generateCodeVerifier();
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            setCodeVerifier(codeVerifier);
            setCodeChallenge(codeChallenge);
            console.log(codeVerifier);
            console.log(codeChallenge);
        } catch (error) {
            setError('Ошибка при генерации кода');
        }
    };


    // const handleAuthorizationResponse = async () => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const code = urlParams.get('code');
    //
    //
    //     try {
    //         const tokenEndpoint = 'http://localhost:9191/oauth2/token';
    //         const requestBody = {
    //             grant_type: 'authorization_code',
    //             code: code,
    //             redirect_uri: 'http://localhost:3000',
    //             code_verifier: localStorage.getItem('codeVerifier'),
    //             client_id: 'test',
    //         };
    //         console.log(requestBody)
    //         console.log(3)
    //
    //         const response = await axios.post(tokenEndpoint, requestBody);
    //
    //         console.log(response.data)
    //         console.log(4)
    //         setAccessToken(response.data.access_token);
    //     } catch (error) {
    //         setError('Ошибка при получении токена');
    //     }
    // };

    const makeToken = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams)
        console.log(window.location.search)
        const code = urlParams.get('code');


        try {
            const tokenEndpoint = 'http://localhost:9191/oauth2/token';
            const requestBody = {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://localhost:3000',
                code_verifier: localStorage.getItem('codeVerifier'),
                client_id: 'test',
            };
            console.log(requestBody)
            console.log(3)

            const response = await axios.post(tokenEndpoint, requestBody);

            console.log(response.data)
            console.log(4)
            setAccessToken(response.data.access_token);
        } catch (error) {
            setError('Ошибка при получении токена');
        }
    };

    const generateCodeVerifier = () => {
        const codeVerifier = generateRandomString(128);
        localStorage.setItem('codeVerifier', codeVerifier);
        return codeVerifier;
    };

    const generateCodeChallenge = async (codeVerifier) => {
        const hashedCodeVerifier = await sha256(codeVerifier);
        return base64urlencode(hashedCodeVerifier);
    };

    const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomString;
    };

    const sha256 = async (plain) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    };

    const base64urlencode = (buffer) => {
        const encoded = String.fromCharCode.apply(null, new Uint8Array(buffer));
        return btoa(encoded)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    return (
        <div>
            <button onClick={generateTokents}>Сгенерить токены</button>
            <button onClick={handleLogin}>Войти</button>
            <button onClick={makeToken}>Сделать запросик</button>

            {accessToken && <p>Access Token: {accessToken}</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default AuthorizationCodePKCE;