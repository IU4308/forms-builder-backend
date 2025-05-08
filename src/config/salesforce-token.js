import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SALESFORCE_LOGIN_URL = 'https://login.salesforce.com'; 

const privateKey = process.env.PRIVATE_KEY; 

export const getAccesToken = async () =>  {
    const payload = {
        iss: process.env.SF_CLIENT_ID,            
        sub: process.env.SF_USERNAME,  
        aud: SALESFORCE_LOGIN_URL,
        exp: Math.floor(Date.now() / 1000) + 60, 
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    const formData = new URLSearchParams();
    formData.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    formData.append('assertion', token);

    const res = await axios.post(`${SALESFORCE_LOGIN_URL}/services/oauth2/token`, formData);

    return res.data;
}